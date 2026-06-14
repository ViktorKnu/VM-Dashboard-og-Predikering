HISTORICAL_INSIGHTS = {
    "winning_after_scoring_first": 0.69,
    "winning_when_leading_at_halftime": 0.78,
    "comeback_probability_by_minute_and_scoreline": [
        {"minute": 30, "scoreline": "0-1", "comeback_win_probability": 0.18},
        {"minute": 60, "scoreline": "0-1", "comeback_win_probability": 0.11},
        {"minute": 75, "scoreline": "0-1", "comeback_win_probability": 0.06},
        {"minute": 60, "scoreline": "0-2", "comeback_win_probability": 0.03},
    ],
    "red_card_impact": {
        "average_win_probability_drop": 0.18,
        "note": "Direction depends on score state and minute; value is a seeded placeholder for model UX.",
    },
    "knockout_match_trends": {
        "extra_time_frequency": 0.18,
        "penalty_shootout_frequency": 0.10,
        "first_goal_importance": "Higher than group stage because draw state has no shared point value.",
    },
    "penalty_shootout_history": {
        "sample_size_note": "Wire Fjelstul and FIFA historical data before treating as analytical truth.",
        "favorite_win_rate": 0.54,
    },
    "underdog_win_frequency": 0.24,
    "goal_timing_patterns": [
        {"window": "0-15", "share": 0.14},
        {"window": "16-30", "share": 0.16},
        {"window": "31-45+", "share": 0.21},
        {"window": "46-60", "share": 0.16},
        {"window": "61-75", "share": 0.15},
        {"window": "76-90+", "share": 0.18},
    ],
    "common_scorelines": [
        {"scoreline": "1-0", "share": 0.18},
        {"scoreline": "1-1", "share": 0.13},
        {"scoreline": "2-1", "share": 0.12},
        {"scoreline": "2-0", "share": 0.11},
        {"scoreline": "0-0", "share": 0.08},
    ],
}

