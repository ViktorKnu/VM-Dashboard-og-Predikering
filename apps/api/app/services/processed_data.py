from __future__ import annotations

import json
from copy import deepcopy
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

PROJECT_ROOT = Path(__file__).resolve().parents[4]
PROCESSED_DIR = PROJECT_ROOT / "data" / "processed"
MATCHES_FILE = PROCESSED_DIR / "matches.json"
PLAYER_STATS_FILE = PROCESSED_DIR / "player_tournament_stats.json"


def parse_datetime(value: str) -> datetime:
    return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(timezone.utc)


def write_json_atomically(path: Path, payload: dict[str, Any]) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary_path = path.with_suffix(f"{path.suffix}.tmp")
    temporary_path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2, default=str), encoding="utf-8"
    )
    temporary_path.replace(path)
    return path


def load_processed_matches() -> tuple[list[dict[str, Any]], dict[str, Any] | None]:
    if not MATCHES_FILE.exists():
        return [], None

    payload = json.loads(MATCHES_FILE.read_text(encoding="utf-8"))
    matches = payload.get("matches", [])
    metadata = payload.get("metadata", {})

    normalized = []
    for match in matches:
        normalized.append(
            {
                **match,
                "tournament_year": match.get("tournament_year", 2026),
                "stage": match.get("stage", "Group stage"),
                "kickoff_at": parse_datetime(match["kickoff_at"]),
            }
        )
    return normalized, metadata


def write_processed_matches(payload: dict[str, Any], path: Path = MATCHES_FILE) -> Path:
    return write_json_atomically(path, payload)


def load_processed_player_stats() -> tuple[list[dict[str, Any]], dict[str, Any] | None]:
    if not PLAYER_STATS_FILE.exists():
        return [], None

    payload = json.loads(PLAYER_STATS_FILE.read_text(encoding="utf-8"))
    return payload.get("players", []), payload.get("metadata", {})


def write_processed_player_stats(
    payload: dict[str, Any], path: Path = PLAYER_STATS_FILE
) -> Path:
    return write_json_atomically(path, payload)


def apply_processed_data(data: dict[str, list[dict[str, Any]]]) -> dict[str, list[dict[str, Any]]]:
    processed_matches, match_metadata = load_processed_matches()
    player_stats, player_metadata = load_processed_player_stats()
    if not processed_matches and not player_stats:
        return data

    merged = deepcopy(data)
    metadata_entries = []
    if processed_matches:
        seed_matches = {match["id"]: match for match in merged["matches"]}
        for match in processed_matches:
            original = seed_matches.get(match["id"], {})
            seed_matches[match["id"]] = {**original, **match}
        merged["matches"] = sorted(seed_matches.values(), key=lambda match: match["kickoff_at"])
        metadata_entries.append(
            {"collection": "matches", "mode": "processed", **(match_metadata or {})}
        )

    if player_stats:
        players_by_id = {player["id"]: player for player in merged["players"]}
        for stats in player_stats:
            player = players_by_id.get(stats.get("player_id"))
            if player is not None:
                player["tournament_goals"] = int(stats.get("tournament_goals") or 0)
        metadata_entries.append(
            {
                "collection": "player_tournament_stats",
                "mode": "processed",
                **(player_metadata or {}),
            }
        )

    merged["data_metadata"] = metadata_entries
    return merged


def processed_status() -> dict[str, Any]:
    matches, match_metadata = load_processed_matches()
    player_stats, player_metadata = load_processed_player_stats()
    if not matches and not player_stats:
        return {
            "mode": "seeded",
            "collections": {},
            "metadata": None,
        }

    finished = sum(1 for match in matches if match.get("status") == "finished")
    return {
        "mode": "processed",
        "collections": {
            "matches": len(matches),
            "finished_matches": finished,
            "player_tournament_stats": len(player_stats),
        },
        "metadata": match_metadata or player_metadata,
    }
