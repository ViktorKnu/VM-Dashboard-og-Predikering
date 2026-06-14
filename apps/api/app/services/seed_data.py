from __future__ import annotations

from copy import deepcopy
from datetime import datetime, timezone


def utc(value: str) -> datetime:
    return datetime.fromisoformat(value).replace(tzinfo=timezone.utc)


TEAMS = [
    {
        "id": 1,
        "name": "Norway",
        "fifa_code": "NOR",
        "confederation": "UEFA",
        "flag_url": "https://flagcdn.com/no.svg",
        "fifa_ranking": 43,
        "fifa_ranking_points": 1472.2,
        "elo_rating": 1810,
        "gdp_per_capita": 87962,
        "population": 5500000,
        "football_popularity_score": 0.76,
        "host_advantage_score": 0.0,
        "historical_world_cup_score": 0.18,
    },
    {
        "id": 2,
        "name": "France",
        "fifa_code": "FRA",
        "confederation": "UEFA",
        "flag_url": "https://flagcdn.com/fr.svg",
        "fifa_ranking": 2,
        "fifa_ranking_points": 1840.6,
        "elo_rating": 2048,
        "gdp_per_capita": 44461,
        "population": 68000000,
        "football_popularity_score": 0.92,
        "host_advantage_score": 0.0,
        "historical_world_cup_score": 0.92,
    },
    {
        "id": 3,
        "name": "Senegal",
        "fifa_code": "SEN",
        "confederation": "CAF",
        "flag_url": "https://flagcdn.com/sn.svg",
        "fifa_ranking": 17,
        "fifa_ranking_points": 1620.1,
        "elo_rating": 1802,
        "gdp_per_capita": 1598,
        "population": 17700000,
        "football_popularity_score": 0.88,
        "host_advantage_score": 0.0,
        "historical_world_cup_score": 0.34,
    },
    {
        "id": 4,
        "name": "Iraq",
        "fifa_code": "IRQ",
        "confederation": "AFC",
        "flag_url": "https://flagcdn.com/iq.svg",
        "fifa_ranking": 58,
        "fifa_ranking_points": 1410.3,
        "elo_rating": 1640,
        "gdp_per_capita": 5937,
        "population": 45500000,
        "football_popularity_score": 0.84,
        "host_advantage_score": 0.0,
        "historical_world_cup_score": 0.08,
    },
    {
        "id": 5,
        "name": "Netherlands",
        "fifa_code": "NED",
        "confederation": "UEFA",
        "flag_url": "https://flagcdn.com/nl.svg",
        "fifa_ranking": 7,
        "fifa_ranking_points": 1745.5,
        "elo_rating": 1987,
        "gdp_per_capita": 57025,
        "population": 17800000,
        "football_popularity_score": 0.91,
        "host_advantage_score": 0.0,
        "historical_world_cup_score": 0.76,
    },
    {
        "id": 6,
        "name": "Spain",
        "fifa_code": "ESP",
        "confederation": "UEFA",
        "flag_url": "https://flagcdn.com/es.svg",
        "fifa_ranking": 8,
        "fifa_ranking_points": 1732.6,
        "elo_rating": 2001,
        "gdp_per_capita": 32676,
        "population": 48500000,
        "football_popularity_score": 0.94,
        "host_advantage_score": 0.0,
        "historical_world_cup_score": 0.78,
    },
    {
        "id": 7,
        "name": "Portugal",
        "fifa_code": "POR",
        "confederation": "UEFA",
        "flag_url": "https://flagcdn.com/pt.svg",
        "fifa_ranking": 6,
        "fifa_ranking_points": 1748.1,
        "elo_rating": 1975,
        "gdp_per_capita": 27405,
        "population": 10400000,
        "football_popularity_score": 0.95,
        "host_advantage_score": 0.0,
        "historical_world_cup_score": 0.62,
    },
    {
        "id": 8,
        "name": "Brazil",
        "fifa_code": "BRA",
        "confederation": "CONMEBOL",
        "flag_url": "https://flagcdn.com/br.svg",
        "fifa_ranking": 5,
        "fifa_ranking_points": 1788.7,
        "elo_rating": 2022,
        "gdp_per_capita": 10044,
        "population": 203000000,
        "football_popularity_score": 0.98,
        "host_advantage_score": 0.0,
        "historical_world_cup_score": 1.0,
    },
]

PLAYERS = [
    {"id": 1, "team_id": 1, "name": "Erling Haaland", "position": "ST", "shirt_number": 9, "age": 25, "club": "Manchester City", "caps": 39, "goals": 38, "rating": 94},
    {"id": 2, "team_id": 1, "name": "Martin Odegaard", "position": "CM", "shirt_number": 10, "age": 27, "club": "Arsenal", "caps": 70, "goals": 4, "rating": 89},
    {"id": 3, "team_id": 2, "name": "Kylian Mbappe", "position": "LW", "shirt_number": 10, "age": 27, "club": "Real Madrid", "caps": 92, "goals": 52, "rating": 95},
    {"id": 4, "team_id": 2, "name": "Aurelien Tchouameni", "position": "DM", "shirt_number": 8, "age": 26, "club": "Real Madrid", "caps": 44, "goals": 3, "rating": 87},
    {"id": 5, "team_id": 3, "name": "Sadio Mane", "position": "LW", "shirt_number": 10, "age": 34, "club": "Al Nassr", "caps": 108, "goals": 45, "rating": 86},
    {"id": 6, "team_id": 4, "name": "Aymen Hussein", "position": "ST", "shirt_number": 18, "age": 30, "club": "Al Khor", "caps": 80, "goals": 28, "rating": 77},
    {"id": 7, "team_id": 5, "name": "Cody Gakpo", "position": "LW", "shirt_number": 11, "age": 27, "club": "Liverpool", "caps": 41, "goals": 14, "rating": 86},
    {"id": 8, "team_id": 6, "name": "Lamine Yamal", "position": "RW", "shirt_number": 19, "age": 18, "club": "Barcelona", "caps": 28, "goals": 8, "rating": 90},
    {"id": 9, "team_id": 7, "name": "Bruno Fernandes", "position": "AM", "shirt_number": 8, "age": 31, "club": "Manchester United", "caps": 82, "goals": 25, "rating": 88},
    {"id": 10, "team_id": 8, "name": "Vinicius Junior", "position": "LW", "shirt_number": 7, "age": 25, "club": "Real Madrid", "caps": 40, "goals": 7, "rating": 93},
]

MATCHES = [
    {"id": 1, "tournament_year": 2026, "stage": "Group stage", "group_name": "A", "home_team_id": 1, "away_team_id": 3, "kickoff_at": utc("2026-06-15T19:00:00+00:00"), "stadium": "MetLife Stadium", "city": "New York/New Jersey", "status": "live", "home_score": 1, "away_score": 0},
    {"id": 2, "tournament_year": 2026, "stage": "Group stage", "group_name": "A", "home_team_id": 2, "away_team_id": 4, "kickoff_at": utc("2026-06-16T16:00:00+00:00"), "stadium": "BC Place", "city": "Vancouver", "status": "scheduled", "home_score": None, "away_score": None},
    {"id": 3, "tournament_year": 2026, "stage": "Group stage", "group_name": "B", "home_team_id": 5, "away_team_id": 6, "kickoff_at": utc("2026-06-17T19:00:00+00:00"), "stadium": "AT&T Stadium", "city": "Dallas", "status": "scheduled", "home_score": None, "away_score": None},
    {"id": 4, "tournament_year": 2026, "stage": "Group stage", "group_name": "B", "home_team_id": 7, "away_team_id": 8, "kickoff_at": utc("2026-06-18T22:00:00+00:00"), "stadium": "SoFi Stadium", "city": "Los Angeles", "status": "scheduled", "home_score": None, "away_score": None},
    {"id": 5, "tournament_year": 2026, "stage": "Round of 16", "group_name": None, "home_team_id": 2, "away_team_id": 5, "kickoff_at": utc("2026-07-04T19:00:00+00:00"), "stadium": "Mercedes-Benz Stadium", "city": "Atlanta", "status": "scheduled", "home_score": None, "away_score": None},
]

EVENTS = [
    {"id": 1, "match_id": 1, "minute": 12, "second": 8, "event_type": "shot_momentum", "team_id": 1, "player_id": 2, "assist_player_id": None, "description": "Norway starts with sustained pressure and two early shots."},
    {"id": 2, "match_id": 1, "minute": 24, "second": 41, "event_type": "goal", "team_id": 1, "player_id": 1, "assist_player_id": 2, "description": "Haaland scores from Odegaard's through ball."},
    {"id": 3, "match_id": 1, "minute": 53, "second": 10, "event_type": "yellow_card_risk", "team_id": 3, "player_id": 5, "assist_player_id": None, "description": "Mane booked after stopping a transition."},
    {"id": 4, "match_id": 1, "minute": 64, "second": 2, "event_type": "substitution", "team_id": 3, "player_id": None, "assist_player_id": None, "description": "Senegal adds a second striker and moves closer to 3-5-2."},
]

LINEUPS = [
    {"id": 1, "match_id": 1, "team_id": 1, "formation": "4-3-3"},
    {"id": 2, "match_id": 1, "team_id": 3, "formation": "4-2-3-1"},
]

LINEUP_PLAYERS = [
    {"id": 1, "lineup_id": 1, "player_id": 1, "position_x": 84, "position_y": 50, "is_starter": True},
    {"id": 2, "lineup_id": 1, "player_id": 2, "position_x": 56, "position_y": 44, "is_starter": True},
    {"id": 3, "lineup_id": 2, "player_id": 5, "position_x": 80, "position_y": 34, "is_starter": True},
]

BROADCASTS = [
    {"id": 1, "match_id": 1, "country_code": "NO", "broadcaster": "NRK", "channel": "NRK TV", "stream_url": "https://tv.nrk.no/", "replay_url": "https://tv.nrk.no/programmer/sport", "requires_login": False, "source_url": "https://www.nrk.no/sport/", "last_checked_at": utc("2026-06-14T12:00:00+00:00")},
    {"id": 2, "match_id": 2, "country_code": "NO", "broadcaster": "TV 2", "channel": "TV 2 Direkte", "stream_url": "https://play.tv2.no/", "replay_url": "https://play.tv2.no/sport", "requires_login": True, "source_url": "https://www.tv2.no/sport/", "last_checked_at": utc("2026-06-14T12:00:00+00:00")},
    {"id": 3, "match_id": 3, "country_code": "NO", "broadcaster": "TV 2", "channel": "TV 2 Sport 1", "stream_url": "https://play.tv2.no/", "replay_url": "https://play.tv2.no/sport", "requires_login": True, "source_url": "https://www.tv2.no/sport/", "last_checked_at": utc("2026-06-14T12:00:00+00:00")},
    {"id": 4, "match_id": 4, "country_code": "NO", "broadcaster": "NRK", "channel": "NRK", "stream_url": "https://tv.nrk.no/", "replay_url": "https://tv.nrk.no/programmer/sport", "requires_login": False, "source_url": "https://www.nrk.no/sport/", "last_checked_at": utc("2026-06-14T12:00:00+00:00")},
]

LIVE_SNAPSHOTS = [
    {"id": 1, "match_id": 1, "minute": 0, "second": 0, "home_score": 0, "away_score": 0, "home_xg": 0.0, "away_xg": 0.0, "home_shots": 0, "away_shots": 0, "home_shots_on_target": 0, "away_shots_on_target": 0, "home_possession": 50, "away_possession": 50, "home_corners": 0, "away_corners": 0, "home_yellow_cards": 0, "away_yellow_cards": 0, "home_red_cards": 0, "away_red_cards": 0, "home_dangerous_attacks": 0, "away_dangerous_attacks": 0, "home_win_probability": 0.47, "draw_probability": 0.27, "away_win_probability": 0.26, "model_version": "wc-v0.2-norway", "created_at": utc("2026-06-15T18:59:00+00:00")},
    {"id": 2, "match_id": 1, "minute": 24, "second": 41, "home_score": 1, "away_score": 0, "home_xg": 0.74, "away_xg": 0.15, "home_shots": 5, "away_shots": 1, "home_shots_on_target": 3, "away_shots_on_target": 0, "home_possession": 57, "away_possession": 43, "home_corners": 2, "away_corners": 0, "home_yellow_cards": 0, "away_yellow_cards": 0, "home_red_cards": 0, "away_red_cards": 0, "home_dangerous_attacks": 18, "away_dangerous_attacks": 7, "home_win_probability": 0.68, "draw_probability": 0.20, "away_win_probability": 0.12, "model_version": "wc-v0.2-norway", "created_at": utc("2026-06-15T19:25:00+00:00")},
    {"id": 3, "match_id": 1, "minute": 64, "second": 2, "home_score": 1, "away_score": 0, "home_xg": 1.05, "away_xg": 0.82, "home_shots": 8, "away_shots": 7, "home_shots_on_target": 4, "away_shots_on_target": 3, "home_possession": 52, "away_possession": 48, "home_corners": 3, "away_corners": 4, "home_yellow_cards": 1, "away_yellow_cards": 2, "home_red_cards": 0, "away_red_cards": 0, "home_dangerous_attacks": 31, "away_dangerous_attacks": 29, "home_win_probability": 0.61, "draw_probability": 0.25, "away_win_probability": 0.14, "model_version": "wc-v0.2-norway", "created_at": utc("2026-06-15T20:05:00+00:00")},
]

MODEL_VERSIONS = [
    {"version": "wc-v0.1-baseline", "date": "2026-06-01", "notes": "Initial ranking and Elo baseline."},
    {"version": "wc-v0.2-norway", "date": "2026-06-14", "notes": "Adds normalized country features, Norwegian broadcast support and live explanations."},
]


def seed() -> dict[str, list[dict]]:
    return deepcopy(
        {
            "teams": TEAMS,
            "players": PLAYERS,
            "matches": MATCHES,
            "events": EVENTS,
            "lineups": LINEUPS,
            "lineup_players": LINEUP_PLAYERS,
            "broadcasts": BROADCASTS,
            "live_snapshots": LIVE_SNAPSHOTS,
            "model_versions": MODEL_VERSIONS,
        }
    )


def find_one(collection: str, item_id: int) -> dict | None:
    return next((item for item in seed()[collection] if item["id"] == item_id), None)

