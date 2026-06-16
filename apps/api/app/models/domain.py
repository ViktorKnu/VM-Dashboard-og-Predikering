from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Team(Base):
    __tablename__ = "teams"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    fifa_code: Mapped[str] = mapped_column(String(3), unique=True)
    confederation: Mapped[str] = mapped_column(String(30))
    flag_url: Mapped[str | None] = mapped_column(String(500))
    fifa_ranking: Mapped[int | None] = mapped_column(Integer)
    fifa_ranking_points: Mapped[float | None] = mapped_column(Float)
    elo_rating: Mapped[float | None] = mapped_column(Float)
    gdp_per_capita: Mapped[float | None] = mapped_column(Float)
    population: Mapped[int | None] = mapped_column(Integer)
    football_popularity_score: Mapped[float | None] = mapped_column(Float)
    host_advantage_score: Mapped[float | None] = mapped_column(Float, default=0.0)
    historical_world_cup_score: Mapped[float | None] = mapped_column(Float, default=0.0)

    players: Mapped[list["Player"]] = relationship(back_populates="team")


class Player(Base):
    __tablename__ = "players"

    id: Mapped[int] = mapped_column(primary_key=True)
    team_id: Mapped[int] = mapped_column(ForeignKey("teams.id"))
    name: Mapped[str] = mapped_column(String(120), index=True)
    position: Mapped[str] = mapped_column(String(30))
    shirt_number: Mapped[int | None] = mapped_column(Integer)
    age: Mapped[int | None] = mapped_column(Integer)
    club: Mapped[str | None] = mapped_column(String(120))
    caps: Mapped[int | None] = mapped_column(Integer)
    goals: Mapped[int | None] = mapped_column(Integer)
    rating: Mapped[float | None] = mapped_column(Float)

    team: Mapped[Team] = relationship(back_populates="players")


class Match(Base):
    __tablename__ = "matches"

    id: Mapped[int] = mapped_column(primary_key=True)
    tournament_year: Mapped[int] = mapped_column(Integer, index=True)
    stage: Mapped[str] = mapped_column(String(80))
    group_name: Mapped[str | None] = mapped_column(String(20))
    home_team_id: Mapped[int] = mapped_column(ForeignKey("teams.id"))
    away_team_id: Mapped[int] = mapped_column(ForeignKey("teams.id"))
    kickoff_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
    stadium: Mapped[str] = mapped_column(String(120))
    city: Mapped[str] = mapped_column(String(120))
    status: Mapped[str] = mapped_column(String(30), default="scheduled")
    home_score: Mapped[int | None] = mapped_column(Integer)
    away_score: Mapped[int | None] = mapped_column(Integer)


class MatchEvent(Base):
    __tablename__ = "match_events"

    id: Mapped[int] = mapped_column(primary_key=True)
    match_id: Mapped[int] = mapped_column(ForeignKey("matches.id"), index=True)
    minute: Mapped[int] = mapped_column(Integer)
    second: Mapped[int | None] = mapped_column(Integer)
    event_type: Mapped[str] = mapped_column(String(60))
    team_id: Mapped[int | None] = mapped_column(ForeignKey("teams.id"))
    player_id: Mapped[int | None] = mapped_column(ForeignKey("players.id"))
    assist_player_id: Mapped[int | None] = mapped_column(ForeignKey("players.id"))
    description: Mapped[str] = mapped_column(Text)


class Lineup(Base):
    __tablename__ = "lineups"

    id: Mapped[int] = mapped_column(primary_key=True)
    match_id: Mapped[int] = mapped_column(ForeignKey("matches.id"), index=True)
    team_id: Mapped[int] = mapped_column(ForeignKey("teams.id"))
    formation: Mapped[str] = mapped_column(String(20))


class LineupPlayer(Base):
    __tablename__ = "lineup_players"

    id: Mapped[int] = mapped_column(primary_key=True)
    lineup_id: Mapped[int] = mapped_column(ForeignKey("lineups.id"), index=True)
    player_id: Mapped[int] = mapped_column(ForeignKey("players.id"))
    position_x: Mapped[float] = mapped_column(Float)
    position_y: Mapped[float] = mapped_column(Float)
    is_starter: Mapped[bool] = mapped_column(Boolean, default=True)


class UserPrediction(Base):
    __tablename__ = "user_predictions"

    id: Mapped[int] = mapped_column(primary_key=True)
    match_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    user_name: Mapped[str] = mapped_column(String(80), default="portfolio_guest")
    predicted_home_score: Mapped[int | None] = mapped_column(Integer)
    predicted_away_score: Mapped[int | None] = mapped_column(Integer)
    predicted_winner_team_id: Mapped[int | None] = mapped_column(Integer)
    first_goalscorer_player_id: Mapped[int | None] = mapped_column(Integer)
    group_winners_json: Mapped[dict | None] = mapped_column(JSON)
    tournament_winner_team_id: Mapped[int | None] = mapped_column(Integer)
    tournament_top_scorer_player_id: Mapped[int | None] = mapped_column(Integer)
    points: Mapped[int] = mapped_column(Integer, default=0)
    scoring_json: Mapped[dict | None] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)


class ModelPrediction(Base):
    __tablename__ = "model_predictions"

    id: Mapped[int] = mapped_column(primary_key=True)
    match_id: Mapped[int] = mapped_column(ForeignKey("matches.id"), index=True)
    model_version: Mapped[str] = mapped_column(String(60))
    home_win_probability: Mapped[float] = mapped_column(Float)
    draw_probability: Mapped[float] = mapped_column(Float)
    away_win_probability: Mapped[float] = mapped_column(Float)
    expected_home_goals: Mapped[float] = mapped_column(Float)
    expected_away_goals: Mapped[float] = mapped_column(Float)
    predicted_score: Mapped[str] = mapped_column(String(20))
    explanation_json: Mapped[dict] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)


class LiveMatchSnapshot(Base):
    __tablename__ = "live_match_snapshots"

    id: Mapped[int] = mapped_column(primary_key=True)
    match_id: Mapped[int] = mapped_column(ForeignKey("matches.id"), index=True)
    minute: Mapped[int] = mapped_column(Integer)
    second: Mapped[int | None] = mapped_column(Integer)
    home_score: Mapped[int] = mapped_column(Integer)
    away_score: Mapped[int] = mapped_column(Integer)
    home_xg: Mapped[float] = mapped_column(Float)
    away_xg: Mapped[float] = mapped_column(Float)
    home_shots: Mapped[int] = mapped_column(Integer)
    away_shots: Mapped[int] = mapped_column(Integer)
    home_shots_on_target: Mapped[int] = mapped_column(Integer)
    away_shots_on_target: Mapped[int] = mapped_column(Integer)
    home_possession: Mapped[float] = mapped_column(Float)
    away_possession: Mapped[float] = mapped_column(Float)
    home_corners: Mapped[int] = mapped_column(Integer)
    away_corners: Mapped[int] = mapped_column(Integer)
    home_yellow_cards: Mapped[int] = mapped_column(Integer)
    away_yellow_cards: Mapped[int] = mapped_column(Integer)
    home_red_cards: Mapped[int] = mapped_column(Integer)
    away_red_cards: Mapped[int] = mapped_column(Integer)
    home_dangerous_attacks: Mapped[int] = mapped_column(Integer)
    away_dangerous_attacks: Mapped[int] = mapped_column(Integer)
    home_win_probability: Mapped[float] = mapped_column(Float)
    draw_probability: Mapped[float] = mapped_column(Float)
    away_win_probability: Mapped[float] = mapped_column(Float)
    model_version: Mapped[str] = mapped_column(String(60))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)


class ProbabilityEvent(Base):
    __tablename__ = "probability_events"

    id: Mapped[int] = mapped_column(primary_key=True)
    match_id: Mapped[int] = mapped_column(ForeignKey("matches.id"), index=True)
    snapshot_id: Mapped[int | None] = mapped_column(ForeignKey("live_match_snapshots.id"))
    minute: Mapped[int] = mapped_column(Integer)
    score_state: Mapped[str] = mapped_column(String(20))
    event_type: Mapped[str] = mapped_column(String(60))
    previous_home_win_probability: Mapped[float] = mapped_column(Float)
    current_home_win_probability: Mapped[float] = mapped_column(Float)
    probability_delta: Mapped[float] = mapped_column(Float)
    explanation: Mapped[str] = mapped_column(Text)
    factors_json: Mapped[dict] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)


class Broadcast(Base):
    __tablename__ = "broadcasts"

    id: Mapped[int] = mapped_column(primary_key=True)
    match_id: Mapped[int] = mapped_column(ForeignKey("matches.id"), index=True)
    country_code: Mapped[str] = mapped_column(String(2), default="NO")
    broadcaster: Mapped[str] = mapped_column(String(80))
    channel: Mapped[str] = mapped_column(String(80))
    stream_url: Mapped[str | None] = mapped_column(String(500))
    replay_url: Mapped[str | None] = mapped_column(String(500))
    requires_login: Mapped[bool] = mapped_column(Boolean, default=False)
    source_url: Mapped[str] = mapped_column(String(500))
    last_checked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
