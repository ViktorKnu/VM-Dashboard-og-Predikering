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
    {"id": 1, "tournament_year": 2026, "stage": "Group stage", "group_name": "I", "home_team_id": 2, "away_team_id": 3, "kickoff_at": utc("2026-06-16T16:00:00+00:00"), "stadium": "New York New Jersey Stadium", "city": "New York/New Jersey", "status": "scheduled", "home_score": None, "away_score": None},
    {"id": 2, "tournament_year": 2026, "stage": "Group stage", "group_name": "I", "home_team_id": 4, "away_team_id": 1, "kickoff_at": utc("2026-06-16T19:00:00+00:00"), "stadium": "Boston Stadium", "city": "Boston", "status": "scheduled", "home_score": None, "away_score": None},
    {"id": 3, "tournament_year": 2026, "stage": "Group stage", "group_name": "I", "home_team_id": 1, "away_team_id": 3, "kickoff_at": utc("2026-06-22T19:00:00+00:00"), "stadium": "New York New Jersey Stadium", "city": "New York/New Jersey", "status": "scheduled", "home_score": None, "away_score": None},
    {"id": 4, "tournament_year": 2026, "stage": "Group stage", "group_name": "I", "home_team_id": 2, "away_team_id": 4, "kickoff_at": utc("2026-06-22T22:00:00+00:00"), "stadium": "Philadelphia Stadium", "city": "Philadelphia", "status": "scheduled", "home_score": None, "away_score": None},
    {"id": 5, "tournament_year": 2026, "stage": "Group stage", "group_name": "I", "home_team_id": 1, "away_team_id": 2, "kickoff_at": utc("2026-06-26T19:00:00+00:00"), "stadium": "Boston Stadium", "city": "Boston", "status": "scheduled", "home_score": None, "away_score": None},
    {"id": 6, "tournament_year": 2026, "stage": "Group stage", "group_name": "I", "home_team_id": 3, "away_team_id": 4, "kickoff_at": utc("2026-06-26T19:00:00+00:00"), "stadium": "Toronto Stadium", "city": "Toronto", "status": "scheduled", "home_score": None, "away_score": None},
]

EVENTS = []

LINEUPS = []

LINEUP_PLAYERS = []

BROADCASTS = [
    {"id": 1, "match_id": 1, "country_code": "NO", "broadcaster": "NRK", "channel": "NRK TV", "stream_url": "https://tv.nrk.no/", "replay_url": "https://tv.nrk.no/programmer/sport", "requires_login": False, "source_url": "https://www.nrk.no/sport/", "last_checked_at": utc("2026-06-15T12:00:00+00:00")},
    {"id": 2, "match_id": 2, "country_code": "NO", "broadcaster": "TV 2", "channel": "TV 2 Play", "stream_url": "https://play.tv2.no/", "replay_url": "https://play.tv2.no/sport", "requires_login": True, "source_url": "https://www.tv2.no/sport/", "last_checked_at": utc("2026-06-15T12:00:00+00:00")},
    {"id": 3, "match_id": 3, "country_code": "NO", "broadcaster": "TV 2", "channel": "TV 2 Direkte", "stream_url": "https://play.tv2.no/", "replay_url": "https://play.tv2.no/sport", "requires_login": True, "source_url": "https://www.tv2.no/sport/", "last_checked_at": utc("2026-06-15T12:00:00+00:00")},
    {"id": 4, "match_id": 4, "country_code": "NO", "broadcaster": "NRK", "channel": "NRK", "stream_url": "https://tv.nrk.no/", "replay_url": "https://tv.nrk.no/programmer/sport", "requires_login": False, "source_url": "https://www.nrk.no/sport/", "last_checked_at": utc("2026-06-15T12:00:00+00:00")},
    {"id": 5, "match_id": 5, "country_code": "NO", "broadcaster": "TV 2", "channel": "TV 2 Sport 1", "stream_url": "https://play.tv2.no/", "replay_url": "https://play.tv2.no/sport", "requires_login": True, "source_url": "https://www.tv2.no/sport/", "last_checked_at": utc("2026-06-15T12:00:00+00:00")},
]

LIVE_SNAPSHOTS = []

MODEL_VERSIONS = [
    {
        "version": "wc-v0.1-simple",
        "date": "2026-06-01",
        "notes": "Enkel baseline med FIFA-rangering og Elo. Aktiv i demoen nå.",
    },
    {
        "version": "wc-v0.2-country-features",
        "date": "2026-06-14",
        "notes": "Planlagt utvidelse med normaliserte landfeatures, økonomiske proxyer og fotballkultur.",
    },
    {
        "version": "wc-v1.0-advanced",
        "date": "Senere",
        "notes": "Planlagt avansert modell med historisk backtesting, kalibrering og forklarbarhet.",
    },
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

