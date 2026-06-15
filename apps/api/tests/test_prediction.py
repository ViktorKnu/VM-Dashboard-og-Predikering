from app.services.live_probability import probability_events, update_live_probability
from app.services.prediction import predict_match, score_prediction
from app.services.seed_data import seed
from app.api.routes import create_prediction, data_status, list_predictions, USER_PREDICTIONS
from app.schemas import PredictionIn


def test_prediction_is_deterministic_and_sums_to_one():
    data = seed()
    norway = data["teams"][0]
    senegal = data["teams"][2]
    first = predict_match(norway, senegal, data["teams"], match_id=1)
    second = predict_match(norway, senegal, data["teams"], match_id=1)

    total = (
        first["home_win_probability"]
        + first["draw_probability"]
        + first["away_win_probability"]
    )
    assert first["home_win_probability"] == second["home_win_probability"]
    assert abs(total - 1.0) < 0.001


def test_prediction_points_are_additive():
    prediction = {
        "predicted_home_score": 2,
        "predicted_away_score": 1,
        "predicted_winner_team_id": 10,
        "first_goalscorer_player_id": 99,
        "tournament_top_scorer_player_id": 42,
    }
    actual = {
        "home_score": 2,
        "away_score": 1,
        "home_team_id": 10,
        "away_team_id": 11,
        "first_goalscorer_player_id": 99,
        "tournament_top_scorer_player_id": 42,
    }

    result = score_prediction(prediction, actual)

    assert result["total_points"] == 24
    assert result["breakdown"]["correct_winner"] == 3
    assert result["breakdown"]["correct_goal_difference"] == 2
    assert result["breakdown"]["exact_score"] == 5
    assert result["breakdown"]["correct_first_goalscorer"] == 4
    assert result["breakdown"]["correct_tournament_top_scorer"] == 10


def test_live_probability_explains_significant_change():
    data = seed()
    prematch = {
        "home_win_probability": 0.47,
        "draw_probability": 0.27,
        "away_win_probability": 0.26,
    }
    current = update_live_probability(prematch, data["live_snapshots"][1])
    events = probability_events(1, data["live_snapshots"][:2])

    assert current["home_win_probability"] > prematch["home_win_probability"]
    assert events
    assert events[0]["event_type"] == "goal"


def test_data_status_exposes_counts_and_prediction_flow():
    USER_PREDICTIONS.clear()

    status = data_status()
    assert status["timezone"] == "Europe/Oslo"
    assert status["counts"]["teams"] == len(seed()["teams"])

    created = create_prediction(
        PredictionIn(
            match_id=1,
            predicted_home_score=1,
            predicted_away_score=0,
            predicted_winner_team_id=1,
            first_goalscorer_player_id=1,
            tournament_winner_team_id=2,
            tournament_top_scorer_player_id=3,
        )
    )

    assert created["points"] > 0
    assert list_predictions(limit=5)[-1]["id"] == created["id"]

