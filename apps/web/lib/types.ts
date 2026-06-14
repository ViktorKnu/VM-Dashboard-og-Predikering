export type Team = {
  id: number;
  name: string;
  fifa_code: string;
  confederation: string;
  flag_url?: string;
  fifa_ranking: number;
  fifa_ranking_points: number;
  elo_rating: number;
  gdp_per_capita: number;
  population: number;
  football_popularity_score: number;
  host_advantage_score: number;
  historical_world_cup_score: number;
};

export type Player = {
  id: number;
  team_id: number;
  name: string;
  position: string;
  shirt_number: number;
  age: number;
  club: string;
  caps: number;
  goals: number;
  rating: number;
};

export type Broadcast = {
  id: number;
  match_id: number;
  country_code: string;
  broadcaster: string;
  channel: string;
  stream_url?: string;
  replay_url?: string;
  requires_login: boolean;
  source_url: string;
};

export type Match = {
  id: number;
  tournament_year: number;
  stage: string;
  group_name?: string | null;
  home_team_id: number;
  away_team_id: number;
  kickoff_at: string;
  kickoff_timezone: "Europe/Oslo";
  stadium: string;
  city: string;
  status: "scheduled" | "live" | "finished";
  home_score?: number | null;
  away_score?: number | null;
  home_team: Team;
  away_team: Team;
  broadcasts?: Broadcast[];
};

export type ModelPrediction = {
  match_id: number;
  model_version: string;
  home_win_probability: number;
  draw_probability: number;
  away_win_probability: number;
  expected_home_goals: number;
  expected_away_goals: number;
  predicted_score: string;
  explanation_json: {
    summary: string;
    limitations: string[];
    home_features?: Record<string, number>;
    away_features?: Record<string, number>;
  };
};

export type LiveSnapshot = {
  id: number;
  match_id: number;
  minute: number;
  home_score: number;
  away_score: number;
  home_xg: number;
  away_xg: number;
  home_shots_on_target: number;
  away_shots_on_target: number;
  home_dangerous_attacks: number;
  away_dangerous_attacks: number;
  home_win_probability: number;
  draw_probability: number;
  away_win_probability: number;
};

export type ProbabilityEvent = {
  id: number;
  match_id: number;
  minute: number;
  score_state: string;
  event_type: string;
  probability_delta: number;
  explanation: string;
};

