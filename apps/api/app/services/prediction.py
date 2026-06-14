from __future__ import annotations

from datetime import datetime, timezone
from math import exp
from typing import Any

from app.core.config import settings

FEATURES = [
    "fifa_ranking",
    "elo_rating",
    "gdp_per_capita",
    "population",
    "football_popularity_score",
    "confederation_strength",
    "host_advantage_score",
    "historical_world_cup_score",
]

CONFEDERATION_STRENGTH = {
    "UEFA": 0.86,
    "CONMEBOL": 0.84,
    "CAF": 0.62,
    "AFC": 0.55,
    "CONCACAF": 0.58,
    "OFC": 0.35,
}


def normalize(value: float, minimum: float, maximum: float, invert: bool = False) -> float:
    if maximum == minimum:
        return 0.5
    normalized = max(0.0, min(1.0, (value - minimum) / (maximum - minimum)))
    return 1.0 - normalized if invert else normalized


def team_strength(team: dict[str, Any], all_teams: list[dict[str, Any]]) -> tuple[float, dict[str, float]]:
    populations = [float(t["population"]) for t in all_teams]
    gdps = [float(t["gdp_per_capita"]) for t in all_teams]
    rankings = [float(t["fifa_ranking"]) for t in all_teams]
    elos = [float(t["elo_rating"]) for t in all_teams]

    normalized = {
        "fifa_ranking": normalize(float(team["fifa_ranking"]), min(rankings), max(rankings), invert=True),
        "elo_rating": normalize(float(team["elo_rating"]), min(elos), max(elos)),
        "gdp_per_capita": normalize(float(team["gdp_per_capita"]), min(gdps), max(gdps)),
        "population": normalize(float(team["population"]), min(populations), max(populations)),
        "football_popularity_score": float(team["football_popularity_score"]),
        "confederation_strength": CONFEDERATION_STRENGTH.get(team["confederation"], 0.5),
        "host_advantage_score": float(team.get("host_advantage_score") or 0),
        "historical_world_cup_score": float(team.get("historical_world_cup_score") or 0),
    }
    weights = {
        "fifa_ranking": 0.22,
        "elo_rating": 0.28,
        "gdp_per_capita": 0.08,
        "population": 0.07,
        "football_popularity_score": 0.10,
        "confederation_strength": 0.10,
        "host_advantage_score": 0.05,
        "historical_world_cup_score": 0.10,
    }
    strength = sum(normalized[key] * weight for key, weight in weights.items())
    return strength, normalized


def predict_match(home: dict[str, Any], away: dict[str, Any], all_teams: list[dict[str, Any]], match_id: int) -> dict[str, Any]:
    home_strength, home_features = team_strength(home, all_teams)
    away_strength, away_features = team_strength(away, all_teams)
    delta = home_strength - away_strength

    home_raw = exp(1.45 * delta + 0.06)
    away_raw = exp(-1.45 * delta)
    draw_raw = exp(0.22 - abs(delta) * 0.9)
    total = home_raw + draw_raw + away_raw

    home_probability = home_raw / total
    draw_probability = draw_raw / total
    away_probability = away_raw / total
    expected_home_goals = max(0.35, 1.25 + delta * 1.35)
    expected_away_goals = max(0.35, 1.15 - delta * 1.25)
    predicted_score = f"{round(expected_home_goals)}-{round(expected_away_goals)}"

    return {
        "id": None,
        "match_id": match_id,
        "model_version": settings.model_version,
        "home_win_probability": round(home_probability, 4),
        "draw_probability": round(draw_probability, 4),
        "away_win_probability": round(away_probability, 4),
        "expected_home_goals": round(expected_home_goals, 2),
        "expected_away_goals": round(expected_away_goals, 2),
        "predicted_score": predicted_score,
        "explanation_json": {
            "summary": "Deterministic v0 baseline using normalized country-level football, economic and ranking features.",
            "home_features": home_features,
            "away_features": away_features,
            "limitations": [
                "GDP per capita is only a rough proxy for sports infrastructure.",
                "Population is only a rough proxy for available talent pool.",
                "Football popularity is seeded and should later be replaced by documented survey or participation data.",
                "Chance is excluded from raw probabilities and only used in Monte Carlo simulations.",
            ],
        },
        "created_at": datetime.now(timezone.utc),
    }


def score_prediction(prediction: dict[str, Any], actual: dict[str, Any]) -> dict[str, Any]:
    breakdown = {
        "correct_winner": 0,
        "correct_goal_difference": 0,
        "exact_score": 0,
        "correct_first_goalscorer": 0,
        "correct_tournament_top_scorer": 0,
    }
    if actual.get("home_score") is not None and actual.get("away_score") is not None:
        actual_home = int(actual["home_score"])
        actual_away = int(actual["away_score"])
        predicted_home = prediction.get("predicted_home_score")
        predicted_away = prediction.get("predicted_away_score")
        if actual_home > actual_away:
            actual_winner = actual["home_team_id"]
        elif actual_away > actual_home:
            actual_winner = actual["away_team_id"]
        else:
            actual_winner = None

        if prediction.get("predicted_winner_team_id") == actual_winner:
            breakdown["correct_winner"] = 3
        if predicted_home is not None and predicted_away is not None:
            if int(predicted_home) - int(predicted_away) == actual_home - actual_away:
                breakdown["correct_goal_difference"] = 2
            if int(predicted_home) == actual_home and int(predicted_away) == actual_away:
                breakdown["exact_score"] = 5

    if prediction.get("first_goalscorer_player_id") == actual.get("first_goalscorer_player_id"):
        breakdown["correct_first_goalscorer"] = 4
    if prediction.get("tournament_top_scorer_player_id") == actual.get("tournament_top_scorer_player_id"):
        breakdown["correct_tournament_top_scorer"] = 10

    return {"total_points": sum(breakdown.values()), "breakdown": breakdown}

