from app.services.api_football import api_football_source, refresh_api_football_data
from app.services.player_import import import_top_scorer_payload, normalize_top_scorer_payload
from app.services.seed_data import PLAYERS, TEAMS


def test_normalize_api_football_top_scorers_matches_names_without_accents():
    payload = {
        "response": [
            {
                "player": {"id": 278, "name": "Kylian Mbappé"},
                "statistics": [{"goals": {"total": 4}}],
            }
        ]
    }

    normalized = normalize_top_scorer_payload(
        payload,
        PLAYERS,
        TEAMS,
        source_name="API-Football toppscorere",
        source_url="https://v3.football.api-sports.io/players/topscorers",
        processed_at="2026-06-23T00:00:00+00:00",
    )

    assert normalized["metadata"]["is_live_data"] is True
    assert normalized["players"] == [
        {
            "player_id": 3,
            "provider_player_id": 278,
            "name": "Kylian Mbappé",
            "team_id": None,
            "position": None,
            "tournament_goals": 4,
        }
    ]


def test_import_top_scorers_writes_processed_file(tmp_path):
    output_path = tmp_path / "player_tournament_stats.json"
    payload = {
        "response": [
            {
                "player": {"id": 278, "name": "Kylian Mbappé"},
                "statistics": [{"goals": {"total": 4}}],
            }
        ]
    }

    written = import_top_scorer_payload(
        payload,
        PLAYERS,
        TEAMS,
        source_name="API-Football toppscorere",
        source_url="https://v3.football.api-sports.io/players/topscorers",
        output_path=output_path,
    )

    assert written == output_path
    assert output_path.exists()


def test_api_football_uses_world_cup_2026_and_requires_key(monkeypatch):
    source = api_football_source("fixtures", "Kamper", "fixtures")

    assert "league=1" in source.url
    assert "season=2026" in source.url
    assert source.requires_key is True

    monkeypatch.setattr("app.services.api_football.settings.api_football_key", "")
    assert refresh_api_football_data() == {"status": "missing_api_key", "updated": []}
