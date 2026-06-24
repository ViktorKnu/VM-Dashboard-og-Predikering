from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from math import exp
from typing import Any

FEATURES = [
    "fifa_ranking",
    "fifa_ranking_points",
    "elo_rating",
    "gdp_per_capita",
    "population",
    "football_popularity_score",
    "confederation_strength",
    "host_advantage_score",
    "historical_world_cup_score",
    "average_player_rating",
    "top_player_rating",
    "striker_rating",
    "squad_caps",
    "player_goal_rate",
    "attacking_depth",
    "current_group_points",
    "recent_goal_difference",
    "goals_for_per_match",
    "goals_against_per_match",
    "upset_resilience_proxy",
    "tournament_experience_proxy",
]

COUNTRY_FEATURES = [
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

INVERTED_FEATURES = {"fifa_ranking", "goals_against_per_match"}


@dataclass(frozen=True)
class ModelConfig:
    id: str
    name: str
    version: str
    status: str
    description: str
    features: list[str]
    weights: dict[str, float]
    temperature: float
    draw_bias: float
    home_edge: float
    goal_scale: float
    accuracy: float | None
    log_loss: float | None
    brier_score: float | None
    training_status: str
    training_data: str
    training_notes: list[str]
    limitations: list[str]


MODEL_CONFIGS: dict[str, ModelConfig] = {
    "simple": ModelConfig(
        id="simple",
        name="Enkel modell",
        version="wc-v0.1-simple",
        status="available",
        description="Rask baseline med bare FIFA-rangering og Elo. Brukes som kontrollmodell.",
        features=["fifa_ranking", "elo_rating"],
        weights={"fifa_ranking": 0.42, "elo_rating": 0.58},
        temperature=1.25,
        draw_bias=0.26,
        home_edge=0.04,
        goal_scale=1.05,
        accuracy=0.52,
        log_loss=1.02,
        brier_score=0.23,
        training_status="seedet backtest",
        training_data="Seedet turneringsfelt og lokal sanity-test, ikke historisk produksjonstrening.",
        training_notes=[
            "Skal være lett å forklare.",
            "Brukes som sammenligningspunkt for mer komplekse modeller.",
        ],
        limitations=[
            "Tar ikke hensyn til spillerstyrke, form eller kampkontekst.",
            "For grov til å være hovedmodell alene.",
        ],
    ),
    "country": ModelConfig(
        id="country",
        name="Landmodell",
        version="wc-v0.2-country-features",
        status="available",
        description="Utvidet modell med landnivå-features, økonomiske proxyer, fotballkultur og historisk VM-styrke.",
        features=COUNTRY_FEATURES,
        weights={
            "fifa_ranking": 0.20,
            "elo_rating": 0.26,
            "gdp_per_capita": 0.08,
            "population": 0.07,
            "football_popularity_score": 0.10,
            "confederation_strength": 0.10,
            "host_advantage_score": 0.05,
            "historical_world_cup_score": 0.14,
        },
        temperature=1.45,
        draw_bias=0.22,
        home_edge=0.06,
        goal_scale=1.25,
        accuracy=0.54,
        log_loss=0.98,
        brier_score=0.22,
        training_status="seedet backtest",
        training_data="Seedet VM-felt med dokumenterte begrensninger. Klar for Fjelstul/FIFA-backtest senere.",
        training_notes=[
            "Normaliserer alle features innen aktivt turneringsfelt.",
            "Økonomi og befolkning brukes bare som proxyer.",
        ],
        limitations=[
            "BNP og befolkning er ikke direkte årsaksvariabler.",
            "Fotballpopularitet må erstattes med etterprøvbar kilde før seriøs bruk.",
        ],
    ),
    "advanced": ModelConfig(
        id="advanced",
        name="Avansert modell",
        version="wc-v0.3-squad-context",
        status="available",
        description="Legger til spillerstyrke, landslagsproduksjon og tidlig turneringsform oppå landmodellen.",
        features=[
            *COUNTRY_FEATURES,
            "average_player_rating",
            "top_player_rating",
            "striker_rating",
            "squad_caps",
            "player_goal_rate",
            "current_group_points",
            "recent_goal_difference",
        ],
        weights={
            "fifa_ranking": 0.14,
            "elo_rating": 0.21,
            "gdp_per_capita": 0.05,
            "population": 0.04,
            "football_popularity_score": 0.07,
            "confederation_strength": 0.07,
            "host_advantage_score": 0.03,
            "historical_world_cup_score": 0.10,
            "average_player_rating": 0.09,
            "top_player_rating": 0.07,
            "striker_rating": 0.07,
            "squad_caps": 0.03,
            "player_goal_rate": 0.07,
            "current_group_points": 0.03,
            "recent_goal_difference": 0.03,
        },
        temperature=1.7,
        draw_bias=0.18,
        home_edge=0.04,
        goal_scale=1.38,
        accuracy=0.57,
        log_loss=0.93,
        brier_score=0.20,
        training_status="lokal treningsstruktur",
        training_data="Seedet spiller- og kampdatasett. Trenger historiske VM-kamper før tallene kan kalles ekte backtest.",
        training_notes=[
            "Bruker bare tilgjengelige spiller- og kampfelt.",
            "Manglende live-/skadedata erstattes ikke med oppdiktede verdier.",
        ],
        limitations=[
            "Spiller-rating er seedet og må erstattes med dokumentert kilde.",
            "Tidlig gruppespillform er ustabil med få kamper.",
        ],
    ),
    "expert": ModelConfig(
        id="expert",
        name="Ekspertmodell",
        version="wc-v0.4-many-parameters",
        status="available",
        description="Mange-parameter-modell med landstyrke, spillerkvalitet, målproduksjon, turneringsform og proxyer for robusthet.",
        features=FEATURES,
        weights={
            "fifa_ranking": 0.10,
            "fifa_ranking_points": 0.05,
            "elo_rating": 0.16,
            "gdp_per_capita": 0.035,
            "population": 0.03,
            "football_popularity_score": 0.055,
            "confederation_strength": 0.06,
            "host_advantage_score": 0.025,
            "historical_world_cup_score": 0.085,
            "average_player_rating": 0.075,
            "top_player_rating": 0.06,
            "striker_rating": 0.06,
            "squad_caps": 0.035,
            "player_goal_rate": 0.06,
            "attacking_depth": 0.04,
            "current_group_points": 0.035,
            "recent_goal_difference": 0.04,
            "goals_for_per_match": 0.035,
            "goals_against_per_match": 0.035,
            "upset_resilience_proxy": 0.035,
            "tournament_experience_proxy": 0.035,
        },
        temperature=1.9,
        draw_bias=0.16,
        home_edge=0.03,
        goal_scale=1.52,
        accuracy=None,
        log_loss=None,
        brier_score=None,
        training_status="eksperimentell",
        training_data="Klar som struktur for historisk trening, men ikke validert på ekte full historikk ennå.",
        training_notes=[
            "Designet for mange parametre og senere kalibrering.",
            "Skal trenes mot historiske VM-kamper før den brukes som fasit.",
            "Krever leakage-sjekk, kalibrering og feature-dokumentasjon.",
        ],
        limitations=[
            "Mange parametre gir høyere risiko for overfitting.",
            "Noen proxyer må erstattes med ekte datakilder før produksjonsbruk.",
            "Metrikker står tomme til modellen er trent på historiske data.",
        ],
    ),
}


def normalize(value: float, minimum: float, maximum: float, invert: bool = False) -> float:
    if maximum == minimum:
        return 0.5
    normalized = max(0.0, min(1.0, (value - minimum) / (maximum - minimum)))
    return 1.0 - normalized if invert else normalized


def available_models() -> list[dict[str, Any]]:
    return [
        {
            "id": model.id,
            "name": model.name,
            "version": model.version,
            "status": model.status,
            "description": model.description,
            "features": model.features,
            "weights": model.weights,
            "accuracy": model.accuracy,
            "log_loss": model.log_loss,
            "brier_score": model.brier_score,
            "training_status": model.training_status,
            "training_data": model.training_data,
            "training_notes": model.training_notes,
            "limitations": model.limitations,
        }
        for model in MODEL_CONFIGS.values()
    ]


def get_model_config(model_id: str | None = None) -> ModelConfig:
    key = model_id or "country"
    if key not in MODEL_CONFIGS:
        raise ValueError(f"Unknown model_id: {key}")
    return MODEL_CONFIGS[key]


def team_finished_match_stats(team_id: int, matches: list[dict[str, Any]]) -> dict[str, float]:
    played = points = goals_for = goals_against = 0
    for match in matches:
        if match.get("home_score") is None or match.get("away_score") is None:
            continue
        if match["home_team_id"] != team_id and match["away_team_id"] != team_id:
            continue
        played += 1
        is_home = match["home_team_id"] == team_id
        team_goals = int(match["home_score"] if is_home else match["away_score"])
        opponent_goals = int(match["away_score"] if is_home else match["home_score"])
        goals_for += team_goals
        goals_against += opponent_goals
        if team_goals > opponent_goals:
            points += 3
        elif team_goals == opponent_goals:
            points += 1

    return {
        "current_group_points": float(points),
        "recent_goal_difference": float(goals_for - goals_against),
        "goals_for_per_match": goals_for / played if played else 0.0,
        "goals_against_per_match": goals_against / played if played else 0.0,
    }


def raw_team_features(
    team: dict[str, Any],
    players: list[dict[str, Any]] | None,
    matches: list[dict[str, Any]] | None,
) -> dict[str, float]:
    squad = [player for player in players or [] if player.get("team_id") == team["id"]]
    ratings = [float(player.get("rating") or 0) for player in squad]
    caps = [float(player.get("caps") or 0) for player in squad]
    goals = [float(player.get("goals") or 0) for player in squad]
    striker_ratings = [
        float(player.get("rating") or 0)
        for player in squad
        if str(player.get("position", "")).upper() in {"ST", "CF", "LW", "RW"}
    ]
    match_stats = team_finished_match_stats(team["id"], matches or [])
    total_caps = sum(caps)
    total_goals = sum(goals)
    average_rating = sum(ratings) / len(ratings) if ratings else 70.0
    top_rating = max(ratings) if ratings else average_rating
    striker_rating = max(striker_ratings) if striker_ratings else average_rating
    player_goal_rate = total_goals / total_caps if total_caps else 0.0
    attacking_depth = float(sum(1 for rating in ratings if rating >= 85))
    confederation_strength = CONFEDERATION_STRENGTH.get(team["confederation"], 0.5)
    historical = float(team.get("historical_world_cup_score") or 0)

    return {
        "fifa_ranking": float(team["fifa_ranking"]),
        "fifa_ranking_points": float(team.get("fifa_ranking_points") or 0),
        "elo_rating": float(team["elo_rating"]),
        "gdp_per_capita": float(team["gdp_per_capita"]),
        "population": float(team["population"]),
        "football_popularity_score": float(team["football_popularity_score"]),
        "confederation_strength": confederation_strength,
        "host_advantage_score": float(team.get("host_advantage_score") or 0),
        "historical_world_cup_score": historical,
        "average_player_rating": average_rating,
        "top_player_rating": top_rating,
        "striker_rating": striker_rating,
        "squad_caps": total_caps,
        "player_goal_rate": player_goal_rate,
        "attacking_depth": attacking_depth,
        "current_group_points": match_stats["current_group_points"],
        "recent_goal_difference": match_stats["recent_goal_difference"],
        "goals_for_per_match": match_stats["goals_for_per_match"],
        "goals_against_per_match": match_stats["goals_against_per_match"],
        "upset_resilience_proxy": confederation_strength * 0.5 + historical * 0.5,
        "tournament_experience_proxy": min(1.0, total_caps / 500.0) * 0.55 + historical * 0.45,
    }


def normalized_feature_table(
    all_teams: list[dict[str, Any]],
    players: list[dict[str, Any]] | None,
    matches: list[dict[str, Any]] | None,
) -> dict[int, dict[str, float]]:
    raw_by_team = {
        team["id"]: raw_team_features(team, players, matches)
        for team in all_teams
    }
    normalized: dict[int, dict[str, float]] = {team_id: {} for team_id in raw_by_team}
    for feature in FEATURES:
        values = [raw[feature] for raw in raw_by_team.values()]
        minimum = min(values)
        maximum = max(values)
        for team_id, raw in raw_by_team.items():
            normalized[team_id][feature] = normalize(
                raw[feature],
                minimum,
                maximum,
                invert=feature in INVERTED_FEATURES,
            )
    return normalized


def team_strength(
    team: dict[str, Any],
    all_teams: list[dict[str, Any]],
    model: ModelConfig | None = None,
    players: list[dict[str, Any]] | None = None,
    matches: list[dict[str, Any]] | None = None,
) -> tuple[float, dict[str, float]]:
    selected_model = model or get_model_config("country")
    features_by_team = normalized_feature_table(all_teams, players, matches)
    team_features = {
        feature: features_by_team[team["id"]][feature]
        for feature in selected_model.features
    }
    weight_total = sum(selected_model.weights.get(feature, 0.0) for feature in selected_model.features) or 1.0
    strength = sum(
        team_features[feature] * selected_model.weights.get(feature, 0.0)
        for feature in selected_model.features
    ) / weight_total
    return strength, team_features


def model_feature_importance(model_id: str | None = None) -> list[dict[str, float | str]]:
    model = get_model_config(model_id)
    weight_total = sum(model.weights.values()) or 1.0
    return [
        {"feature": feature, "importance": round(weight / weight_total, 4)}
        for feature, weight in sorted(model.weights.items(), key=lambda item: item[1], reverse=True)
    ]


def predict_match(
    home: dict[str, Any],
    away: dict[str, Any],
    all_teams: list[dict[str, Any]],
    match_id: int,
    model_id: str | None = None,
    players: list[dict[str, Any]] | None = None,
    matches: list[dict[str, Any]] | None = None,
) -> dict[str, Any]:
    model = get_model_config(model_id)
    home_strength, home_features = team_strength(home, all_teams, model, players, matches)
    away_strength, away_features = team_strength(away, all_teams, model, players, matches)
    delta = home_strength - away_strength

    home_raw = exp(model.temperature * delta + model.home_edge)
    away_raw = exp(-model.temperature * delta)
    draw_raw = exp(model.draw_bias - abs(delta) * (0.85 + model.temperature / 8))
    total = home_raw + draw_raw + away_raw

    home_probability = home_raw / total
    draw_probability = draw_raw / total
    away_probability = away_raw / total
    expected_home_goals = max(0.25, 1.2 + delta * model.goal_scale)
    expected_away_goals = max(0.25, 1.12 - delta * (model.goal_scale * 0.92))
    predicted_score = f"{round(expected_home_goals)}-{round(expected_away_goals)}"

    return {
        "id": None,
        "match_id": match_id,
        "model_id": model.id,
        "model_name": model.name,
        "model_version": model.version,
        "home_win_probability": round(home_probability, 4),
        "draw_probability": round(draw_probability, 4),
        "away_win_probability": round(away_probability, 4),
        "expected_home_goals": round(expected_home_goals, 2),
        "expected_away_goals": round(expected_away_goals, 2),
        "predicted_score": predicted_score,
        "explanation_json": {
            "summary": model.description,
            "training_status": model.training_status,
            "training_data": model.training_data,
            "features_used": model.features,
            "weights": model.weights,
            "home_features": home_features,
            "away_features": away_features,
            "limitations": [
                *model.limitations,
                "Tilfeldighet er ekskludert fra rå sannsynlighet og brukes bare i Monte Carlo-simuleringer.",
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
