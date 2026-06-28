from __future__ import annotations

import unicodedata
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from app.services.processed_data import write_processed_player_stats


def normalized_name(value: str) -> str:
    ascii_name = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode()
    return " ".join(ascii_name.lower().split())


def normalize_top_scorer_payload(
    payload: dict[str, Any],
    players: list[dict[str, Any]],
    teams: list[dict[str, Any]] | None,
    source_name: str,
    source_url: str,
    processed_at: str | None = None,
) -> dict[str, Any]:
    response = payload.get("response")
    if not isinstance(response, list):
        raise ValueError("API-Football-svaret må inneholde en response-liste.")

    player_lookup = {normalized_name(player["name"]): player["id"] for player in players}
    team_lookup = {
        normalized_name(team["name"]): team["id"] for team in (teams or [])
    }
    normalized_players = []
    for item in response:
        if not isinstance(item, dict):
            continue
        provider_player = item.get("player") or {}
        player_name = str(provider_player.get("name") or "").strip()
        player_id = player_lookup.get(normalized_name(player_name))
        statistics = item.get("statistics") or []
        first_stats = statistics[0] if statistics and isinstance(statistics[0], dict) else {}
        goals = first_stats.get("goals") or {}
        provider_team = first_stats.get("team") or {}
        normalized_players.append(
            {
                "player_id": player_id,
                "provider_player_id": provider_player.get("id"),
                "name": player_name,
                "team_id": team_lookup.get(normalized_name(str(provider_team.get("name") or ""))),
                "position": provider_player.get("position"),
                "tournament_goals": int(goals.get("total") or 0),
            }
        )

    return {
        "metadata": {
            "dataset": "world_cup_2026_top_scorers",
            "source_name": source_name,
            "source_url": source_url,
            "source_updated_at": processed_at or datetime.now(timezone.utc).isoformat(),
            "processed_at": processed_at or datetime.now(timezone.utc).isoformat(),
            "timezone": "Europe/Oslo",
            "is_live_data": True,
        },
        "players": normalized_players,
    }


def import_top_scorer_payload(
    payload: dict[str, Any],
    players: list[dict[str, Any]],
    teams: list[dict[str, Any]] | None,
    source_name: str,
    source_url: str,
    output_path: Path | None = None,
) -> Path:
    normalized = normalize_top_scorer_payload(
        payload, players, teams, source_name, source_url
    )
    if output_path:
        return write_processed_player_stats(normalized, path=output_path)
    return write_processed_player_stats(normalized)
