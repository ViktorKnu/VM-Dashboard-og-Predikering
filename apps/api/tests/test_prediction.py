from app.services.live_probability import probability_events, update_live_probability
from app.services.prediction import predict_match, score_prediction
from app.services.seed_data import seed
from app.api.routes import create_prediction, data_status, list_predictions, model_lab, USER_PREDICTIONS
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
    prematch = {
        "home_win_probability": 0.47,
        "draw_probability": 0.27,
        "away_win_probability": 0.26,
    }
    snapshots = [
        {
            "id": 1,
            "match_id": 99,
            "minute": 0,
            "home_score": 0,
            "away_score": 0,
            "home_xg": 0.0,
            "away_xg": 0.0,
            "home_shots_on_target": 0,
            "away_shots_on_target": 0,
            "home_dangerous_attacks": 0,
            "away_dangerous_attacks": 0,
            "home_red_cards": 0,
            "away_red_cards": 0,
            "home_yellow_cards": 0,
            "away_yellow_cards": 0,
            "home_win_probability": 0.47,
        },
        {
            "id": 2,
            "match_id": 99,
            "minute": 24,
            "home_score": 1,
            "away_score": 0,
            "home_xg": 0.74,
            "away_xg": 0.15,
            "home_shots_on_target": 3,
            "away_shots_on_target": 0,
            "home_dangerous_attacks": 18,
            "away_dangerous_attacks": 7,
            "home_red_cards": 0,
            "away_red_cards": 0,
            "home_yellow_cards": 0,
            "away_yellow_cards": 0,
            "home_win_probability": 0.68,
        },
    ]
    current = update_live_probability(prematch, snapshots[1])
    events = probability_events(99, snapshots)

    assert current["home_win_probability"] > prematch["home_win_probability"]
    assert events
    assert events[0]["event_type"] == "goal"


def test_seed_schedule_uses_group_i_without_fake_live_or_knockout_matches():
    matches = seed()["matches"]

    assert matches
    assert all(match["group_name"] == "I" for match in matches)
    assert all(match["stage"] == "Group stage" for match in matches)
    assert all(match["status"] == "scheduled" for match in matches)
    assert all(match["home_score"] is None and match["away_score"] is None for match in matches)


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


def test_model_lab_exposes_selectable_model_levels():
    lab = model_lab()

    assert lab["active_model_id"] == "simple"
    assert [model["id"] for model in lab["models"]] == ["simple", "country", "advanced"]
    assert lab["models"][0]["status"] == "active"
    assert lab["models"][-1]["name"] == "Avansert modell"

