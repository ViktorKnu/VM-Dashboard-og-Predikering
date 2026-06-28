from __future__ import annotations

import re
import unicodedata
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from app.services.processed_data import write_processed_matches

FINISHED_STATUSES = {"FINISHED", "finished", "FT", "AET", "PEN", "full_time"}
LIVE_STATUSES = {
    "LIVE", "IN_PLAY", "PAUSED", "live", "in_play", "paused",
    "1H", "HT", "2H", "ET", "BT", "P",
}

TEAM_ALIASES = {
    "congo dr": "dr congo",
    "congo democratic republic": "dr congo",
    "cape verde islands": "cape verde",
    "iran": "ir iran",
    "south korea": "korea republic",
    "usa": "united states",
}


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def normalize_status(value: str | None, home_score: int | None, away_score: int | None) -> str:
    if value in FINISHED_STATUSES:
        return "finished"
    if value in LIVE_STATUSES:
        return "live"
    if home_score is not None and away_score is not None:
        return "finished"
    return "scheduled"


def normalize_group(value: Any) -> str | None:
    if value is None:
        return None
    text = str(value).strip()
    if not text:
        return None
    group_match = re.search(r"group(?: stage)?[ _-]+([A-L])(?:\b|_)", text, re.IGNORECASE)
    if group_match:
        return group_match.group(1).upper()
    if "_" in text:
        text = text.split("_")[-1]
    if " " in text:
        text = text.split()[-1]
    return text[-1].upper()


def normalized_team_key(value: Any) -> str:
    text = unicodedata.normalize("NFKD", str(value)).encode("ascii", "ignore").decode()
    key = " ".join(text.lower().replace(".", "").split())
    return TEAM_ALIASES.get(key, key)


def team_lookup(teams: list[dict[str, Any]]) -> dict[str, int]:
    lookup: dict[str, int] = {}
    for team in teams:
        lookup[str(team["id"])] = team["id"]
        lookup[normalized_team_key(team["name"])] = team["id"]
        lookup[normalized_team_key(team["fifa_code"])] = team["id"]
    return lookup


def find_team_id(value: Any, lookup: dict[str, int]) -> int | None:
    if value is None:
        return None
    if isinstance(value, dict):
        for key in ("id", "tla", "code", "fifa_code", "name", "shortName"):
            found = find_team_id(value.get(key), lookup)
            if found is not None:
                return found
        return None
    return lookup.get(normalized_team_key(value))


def score_from_row(row: dict[str, Any]) -> tuple[int | None, int | None]:
    if "home_score" in row or "away_score" in row:
        return row.get("home_score"), row.get("away_score")

    score = row.get("score")
    if not isinstance(score, dict):
        return None, None

    full_time = score.get("fullTime") or score.get("full_time") or {}
    if isinstance(full_time, dict):
        return full_time.get("home"), full_time.get("away")
    return None, None


def kickoff_from_row(row: dict[str, Any]) -> str:
    value = row.get("kickoff_at") or row.get("utcDate") or row.get("date")
    if not value:
        raise ValueError("Kamp mangler kickoff_at/utcDate/date.")
    return str(value).replace("Z", "+00:00")


def match_key(match: dict[str, Any]) -> tuple[int | None, int | None, str | None]:
    return (match.get("home_team_id"), match.get("away_team_id"), match.get("group_name"))


def seed_match_index(seed_matches: list[dict[str, Any]]) -> dict[tuple[int | None, int | None, str | None], dict[str, Any]]:
    return {match_key(match): match for match in seed_matches}


def api_football_rows(payload: dict[str, Any]) -> list[dict[str, Any]] | None:
    response = payload.get("response")
    if not isinstance(response, list):
        return None

    rows = []
    for item in response:
        if not isinstance(item, dict):
            continue
        fixture = item.get("fixture") or {}
        league = item.get("league") or {}
        venue = fixture.get("venue") or {}
        status = fixture.get("status") or {}
        teams = item.get("teams") or {}
        rows.append(
            {
                "id": fixture.get("id"),
                "home_team": teams.get("home"),
                "away_team": teams.get("away"),
                "kickoff_at": fixture.get("date"),
                "stadium": venue.get("name"),
                "city": venue.get("city"),
                "status": status.get("short") or status.get("long"),
                "home_score": (item.get("goals") or {}).get("home"),
                "away_score": (item.get("goals") or {}).get("away"),
                "group": league.get("round"),
                "stage": league.get("round"),
            }
        )
    return rows


def normalize_match_row(
    row: dict[str, Any],
    teams: list[dict[str, Any]],
    seed_matches: list[dict[str, Any]],
) -> dict[str, Any]:
    lookup = team_lookup(teams)
    home_team_id = row.get("home_team_id") or find_team_id(row.get("homeTeam") or row.get("home_team"), lookup)
    away_team_id = row.get("away_team_id") or find_team_id(row.get("awayTeam") or row.get("away_team"), lookup)
    if home_team_id is None or away_team_id is None:
        raise ValueError(f"Klarte ikke mappe lag for kamp: {row}")

    group_name = row.get("group_name") or normalize_group(row.get("group") or row.get("stage"))
    home_score, away_score = score_from_row(row)
    seed_by_key = seed_match_index(seed_matches)
    seed_match = seed_by_key.get((home_team_id, away_team_id, group_name)) or next(
        (
            match
            for match in seed_matches
            if match.get("home_team_id") == home_team_id
            and match.get("away_team_id") == away_team_id
        ),
        {},
    )
    group_name = group_name or seed_match.get("group_name")
    provider_stage = str(row.get("stage") or "")
    stage = "Group stage" if group_name else provider_stage or "Ukjent fase"

    return {
        "id": int(seed_match.get("id") or row.get("id")),
        "tournament_year": int(row.get("tournament_year", 2026)),
        "stage": stage,
        "group_name": group_name,
        "home_team_id": home_team_id,
        "away_team_id": away_team_id,
        "kickoff_at": kickoff_from_row(row),
        "stadium": row.get("stadium") or seed_match.get("stadium") or "Ukjent stadion",
        "city": row.get("city") or seed_match.get("city") or "Ukjent by",
        "status": normalize_status(row.get("status"), home_score, away_score),
        "home_score": home_score,
        "away_score": away_score,
    }


def normalize_match_payload(
    payload: dict[str, Any],
    teams: list[dict[str, Any]],
    seed_matches: list[dict[str, Any]],
    source_name: str,
    source_url: str,
    processed_at: str | None = None,
) -> dict[str, Any]:
    timestamp = processed_at or utc_now_iso()
    raw_matches = payload.get("matches")
    if not isinstance(raw_matches, list):
        raw_matches = api_football_rows(payload)
    if not isinstance(raw_matches, list):
        raise ValueError("Kilden må inneholde en matches-liste.")

    matches = [
        normalize_match_row(row, teams, seed_matches)
        for row in raw_matches
        if isinstance(row, dict)
    ]
    matches.sort(key=lambda match: match["kickoff_at"])

    source_metadata = payload.get("metadata") if isinstance(payload.get("metadata"), dict) else {}
    is_live_data = bool(source_metadata.get("is_live_data")) or source_name.startswith(
        "API-Football"
    )
    return {
        "metadata": {
            "dataset": source_metadata.get("dataset", "world_cup_2026_group_stage_snapshot"),
            "source_name": source_metadata.get("source_name", source_name),
            "source_url": source_metadata.get("source_url", source_url),
            "source_updated_at": source_metadata.get("source_updated_at")
            or (timestamp if is_live_data else None),
            "processed_at": timestamp,
            "timezone": "Europe/Oslo",
            "is_live_data": is_live_data,
            "notes": source_metadata.get(
                "notes",
                ["Kilde-merket leverandørimport med cache og fallback."]
                if is_live_data
                else [
                    "Kilde-merket resultat-snapshot for visning.",
                    "Ikke sekund-for-sekund live-feed.",
                ],
            ),
        },
        "matches": matches,
    }


def import_matches_payload(
    payload: dict[str, Any],
    teams: list[dict[str, Any]],
    seed_matches: list[dict[str, Any]],
    source_name: str,
    source_url: str,
    output_path: Path | None = None,
) -> Path:
    normalized = normalize_match_payload(payload, teams, seed_matches, source_name, source_url)
    return write_processed_matches(normalized, path=output_path) if output_path else write_processed_matches(normalized)
