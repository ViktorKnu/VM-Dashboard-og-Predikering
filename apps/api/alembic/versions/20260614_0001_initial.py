"""Initial portfolio schema.

Revision ID: 20260614_0001
Revises:
Create Date: 2026-06-14
"""

from typing import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "20260614_0001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "teams",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("fifa_code", sa.String(length=3), nullable=False),
        sa.Column("confederation", sa.String(length=30), nullable=False),
        sa.Column("flag_url", sa.String(length=500)),
        sa.Column("fifa_ranking", sa.Integer()),
        sa.Column("fifa_ranking_points", sa.Float()),
        sa.Column("elo_rating", sa.Float()),
        sa.Column("gdp_per_capita", sa.Float()),
        sa.Column("population", sa.Integer()),
        sa.Column("football_popularity_score", sa.Float()),
        sa.Column("host_advantage_score", sa.Float()),
        sa.Column("historical_world_cup_score", sa.Float()),
    )
    op.create_index("ix_teams_name", "teams", ["name"], unique=True)
    op.create_index("ix_teams_fifa_code", "teams", ["fifa_code"], unique=True)

    op.create_table(
        "players",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("team_id", sa.Integer(), sa.ForeignKey("teams.id"), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("position", sa.String(length=30), nullable=False),
        sa.Column("shirt_number", sa.Integer()),
        sa.Column("age", sa.Integer()),
        sa.Column("club", sa.String(length=120)),
        sa.Column("caps", sa.Integer()),
        sa.Column("goals", sa.Integer()),
        sa.Column("rating", sa.Float()),
    )
    op.create_index("ix_players_name", "players", ["name"])

    op.create_table(
        "matches",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("tournament_year", sa.Integer(), nullable=False),
        sa.Column("stage", sa.String(length=80), nullable=False),
        sa.Column("group_name", sa.String(length=20)),
        sa.Column("home_team_id", sa.Integer(), sa.ForeignKey("teams.id"), nullable=False),
        sa.Column("away_team_id", sa.Integer(), sa.ForeignKey("teams.id"), nullable=False),
        sa.Column("kickoff_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("stadium", sa.String(length=120), nullable=False),
        sa.Column("city", sa.String(length=120), nullable=False),
        sa.Column("status", sa.String(length=30), nullable=False),
        sa.Column("home_score", sa.Integer()),
        sa.Column("away_score", sa.Integer()),
    )
    op.create_index("ix_matches_kickoff_at", "matches", ["kickoff_at"])
    op.create_index("ix_matches_tournament_year", "matches", ["tournament_year"])

    op.create_table(
        "match_events",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("match_id", sa.Integer(), sa.ForeignKey("matches.id"), nullable=False),
        sa.Column("minute", sa.Integer(), nullable=False),
        sa.Column("second", sa.Integer()),
        sa.Column("event_type", sa.String(length=60), nullable=False),
        sa.Column("team_id", sa.Integer(), sa.ForeignKey("teams.id")),
        sa.Column("player_id", sa.Integer(), sa.ForeignKey("players.id")),
        sa.Column("assist_player_id", sa.Integer(), sa.ForeignKey("players.id")),
        sa.Column("description", sa.Text(), nullable=False),
    )
    op.create_index("ix_match_events_match_id", "match_events", ["match_id"])

    op.create_table(
        "lineups",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("match_id", sa.Integer(), sa.ForeignKey("matches.id"), nullable=False),
        sa.Column("team_id", sa.Integer(), sa.ForeignKey("teams.id"), nullable=False),
        sa.Column("formation", sa.String(length=20), nullable=False),
    )
    op.create_index("ix_lineups_match_id", "lineups", ["match_id"])

    op.create_table(
        "lineup_players",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("lineup_id", sa.Integer(), sa.ForeignKey("lineups.id"), nullable=False),
        sa.Column("player_id", sa.Integer(), sa.ForeignKey("players.id"), nullable=False),
        sa.Column("position_x", sa.Float(), nullable=False),
        sa.Column("position_y", sa.Float(), nullable=False),
        sa.Column("is_starter", sa.Boolean(), nullable=False),
    )
    op.create_index("ix_lineup_players_lineup_id", "lineup_players", ["lineup_id"])

    op.create_table(
        "user_predictions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("match_id", sa.Integer(), sa.ForeignKey("matches.id")),
        sa.Column("user_name", sa.String(length=80), nullable=False),
        sa.Column("predicted_home_score", sa.Integer()),
        sa.Column("predicted_away_score", sa.Integer()),
        sa.Column("predicted_winner_team_id", sa.Integer(), sa.ForeignKey("teams.id")),
        sa.Column("first_goalscorer_player_id", sa.Integer(), sa.ForeignKey("players.id")),
        sa.Column("group_winners_json", sa.JSON()),
        sa.Column("tournament_winner_team_id", sa.Integer(), sa.ForeignKey("teams.id")),
        sa.Column("tournament_top_scorer_player_id", sa.Integer(), sa.ForeignKey("players.id")),
        sa.Column("points", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )

    op.create_table(
        "model_predictions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("match_id", sa.Integer(), sa.ForeignKey("matches.id"), nullable=False),
        sa.Column("model_version", sa.String(length=60), nullable=False),
        sa.Column("home_win_probability", sa.Float(), nullable=False),
        sa.Column("draw_probability", sa.Float(), nullable=False),
        sa.Column("away_win_probability", sa.Float(), nullable=False),
        sa.Column("expected_home_goals", sa.Float(), nullable=False),
        sa.Column("expected_away_goals", sa.Float(), nullable=False),
        sa.Column("predicted_score", sa.String(length=20), nullable=False),
        sa.Column("explanation_json", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_model_predictions_match_id", "model_predictions", ["match_id"])

    op.create_table(
        "live_match_snapshots",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("match_id", sa.Integer(), sa.ForeignKey("matches.id"), nullable=False),
        sa.Column("minute", sa.Integer(), nullable=False),
        sa.Column("second", sa.Integer()),
        sa.Column("home_score", sa.Integer(), nullable=False),
        sa.Column("away_score", sa.Integer(), nullable=False),
        sa.Column("home_xg", sa.Float(), nullable=False),
        sa.Column("away_xg", sa.Float(), nullable=False),
        sa.Column("home_shots", sa.Integer(), nullable=False),
        sa.Column("away_shots", sa.Integer(), nullable=False),
        sa.Column("home_shots_on_target", sa.Integer(), nullable=False),
        sa.Column("away_shots_on_target", sa.Integer(), nullable=False),
        sa.Column("home_possession", sa.Float(), nullable=False),
        sa.Column("away_possession", sa.Float(), nullable=False),
        sa.Column("home_corners", sa.Integer(), nullable=False),
        sa.Column("away_corners", sa.Integer(), nullable=False),
        sa.Column("home_yellow_cards", sa.Integer(), nullable=False),
        sa.Column("away_yellow_cards", sa.Integer(), nullable=False),
        sa.Column("home_red_cards", sa.Integer(), nullable=False),
        sa.Column("away_red_cards", sa.Integer(), nullable=False),
        sa.Column("home_dangerous_attacks", sa.Integer(), nullable=False),
        sa.Column("away_dangerous_attacks", sa.Integer(), nullable=False),
        sa.Column("home_win_probability", sa.Float(), nullable=False),
        sa.Column("draw_probability", sa.Float(), nullable=False),
        sa.Column("away_win_probability", sa.Float(), nullable=False),
        sa.Column("model_version", sa.String(length=60), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_live_match_snapshots_match_id", "live_match_snapshots", ["match_id"])

    op.create_table(
        "probability_events",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("match_id", sa.Integer(), sa.ForeignKey("matches.id"), nullable=False),
        sa.Column("snapshot_id", sa.Integer(), sa.ForeignKey("live_match_snapshots.id")),
        sa.Column("minute", sa.Integer(), nullable=False),
        sa.Column("score_state", sa.String(length=20), nullable=False),
        sa.Column("event_type", sa.String(length=60), nullable=False),
        sa.Column("previous_home_win_probability", sa.Float(), nullable=False),
        sa.Column("current_home_win_probability", sa.Float(), nullable=False),
        sa.Column("probability_delta", sa.Float(), nullable=False),
        sa.Column("explanation", sa.Text(), nullable=False),
        sa.Column("factors_json", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_probability_events_match_id", "probability_events", ["match_id"])

    op.create_table(
        "broadcasts",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("match_id", sa.Integer(), sa.ForeignKey("matches.id"), nullable=False),
        sa.Column("country_code", sa.String(length=2), nullable=False),
        sa.Column("broadcaster", sa.String(length=80), nullable=False),
        sa.Column("channel", sa.String(length=80), nullable=False),
        sa.Column("stream_url", sa.String(length=500)),
        sa.Column("replay_url", sa.String(length=500)),
        sa.Column("requires_login", sa.Boolean(), nullable=False),
        sa.Column("source_url", sa.String(length=500), nullable=False),
        sa.Column("last_checked_at", sa.DateTime(timezone=True)),
    )
    op.create_index("ix_broadcasts_match_id", "broadcasts", ["match_id"])


def downgrade() -> None:
    for table in [
        "broadcasts",
        "probability_events",
        "live_match_snapshots",
        "model_predictions",
        "user_predictions",
        "lineup_players",
        "lineups",
        "match_events",
        "matches",
        "players",
        "teams",
    ]:
        op.drop_table(table)
