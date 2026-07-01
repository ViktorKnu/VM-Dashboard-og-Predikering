from __future__ import annotations

from typing import Any
from urllib.parse import urlencode

from app.core.config import settings
from app.services.external_data import ExternalSource, fetch_json
from app.services.match_import import import_matches_payload
from app.services.player_import import import_top_scorer_payload
from app.services.seed_data import MATCHES, PLAYERS, TEAMS


def api_football_source(key: str, label: str, endpoint: str) -> ExternalSource:
    query = urlencode(
        {
            "league": settings.api_football_league_id,
            "season": settings.api_football_season,
        }
    )
    return ExternalSource(
        key=f"api_football_{key}",
        label=label,
        purpose="VM 2026-kamper og spillerstatistikk",
        url=f"{settings.api_football_base_url.rstrip('/')}/{endpoint}?{query}",
        requires_key=True,
    )


def refresh_api_football_data(force: bool = False) -> dict[str, Any]:
    if not settings.api_football_key:
        return {"status": "missing_api_key", "updated": []}

    fixtures_source = api_football_source("fixtures", "API-Football kamper", "fixtures")
    fixtures_result = fetch_json(fixtures_source, force=force)
    updated = []
    fixtures = fixtures_result.get("payload")
    if fixtures:
        path = import_matches_payload(
            fixtures,
            TEAMS,
            MATCHES,
            source_name=fixtures_source.label,
            source_url=fixtures_source.url,
            preserve_existing=True,
        )
        updated.append(str(path))

    scorers_source = api_football_source(
        "top_scorers", "API-Football toppscorere", "players/topscorers"
    )
    scorers_result = fetch_json(scorers_source, force=force)
    scorers = scorers_result.get("payload")
    if scorers:
        path = import_top_scorer_payload(
            scorers,
            PLAYERS,
            TEAMS,
            source_name=scorers_source.label,
            source_url=scorers_source.url,
        )
        updated.append(str(path))

    statuses = [fixtures_result["status"], scorers_result["status"]]
    return {
        "status": "updated" if updated else "error",
        "provider_statuses": statuses,
        "updated": updated,
    }
