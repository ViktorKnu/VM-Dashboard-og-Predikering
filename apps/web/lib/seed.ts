import type { Broadcast, LiveSnapshot, Match, ModelPrediction, Player, ProbabilityEvent, Team } from "./types";

export const teams: Team[] = [
  { id: 1, name: "Norway", fifa_code: "NOR", confederation: "UEFA", flag_url: "https://flagcdn.com/no.svg", fifa_ranking: 43, fifa_ranking_points: 1472.2, elo_rating: 1810, gdp_per_capita: 87962, population: 5500000, football_popularity_score: 0.76, host_advantage_score: 0, historical_world_cup_score: 0.18 },
  { id: 2, name: "France", fifa_code: "FRA", confederation: "UEFA", flag_url: "https://flagcdn.com/fr.svg", fifa_ranking: 2, fifa_ranking_points: 1840.6, elo_rating: 2048, gdp_per_capita: 44461, population: 68000000, football_popularity_score: 0.92, host_advantage_score: 0, historical_world_cup_score: 0.92 },
  { id: 3, name: "Senegal", fifa_code: "SEN", confederation: "CAF", flag_url: "https://flagcdn.com/sn.svg", fifa_ranking: 17, fifa_ranking_points: 1620.1, elo_rating: 1802, gdp_per_capita: 1598, population: 17700000, football_popularity_score: 0.88, host_advantage_score: 0, historical_world_cup_score: 0.34 },
  { id: 4, name: "Iraq", fifa_code: "IRQ", confederation: "AFC", flag_url: "https://flagcdn.com/iq.svg", fifa_ranking: 58, fifa_ranking_points: 1410.3, elo_rating: 1640, gdp_per_capita: 5937, population: 45500000, football_popularity_score: 0.84, host_advantage_score: 0, historical_world_cup_score: 0.08 },
  { id: 5, name: "Netherlands", fifa_code: "NED", confederation: "UEFA", flag_url: "https://flagcdn.com/nl.svg", fifa_ranking: 7, fifa_ranking_points: 1745.5, elo_rating: 1987, gdp_per_capita: 57025, population: 17800000, football_popularity_score: 0.91, host_advantage_score: 0, historical_world_cup_score: 0.76 },
  { id: 6, name: "Spain", fifa_code: "ESP", confederation: "UEFA", flag_url: "https://flagcdn.com/es.svg", fifa_ranking: 8, fifa_ranking_points: 1732.6, elo_rating: 2001, gdp_per_capita: 32676, population: 48500000, football_popularity_score: 0.94, host_advantage_score: 0, historical_world_cup_score: 0.78 },
  { id: 7, name: "Portugal", fifa_code: "POR", confederation: "UEFA", flag_url: "https://flagcdn.com/pt.svg", fifa_ranking: 6, fifa_ranking_points: 1748.1, elo_rating: 1975, gdp_per_capita: 27405, population: 10400000, football_popularity_score: 0.95, host_advantage_score: 0, historical_world_cup_score: 0.62 },
  { id: 8, name: "Brazil", fifa_code: "BRA", confederation: "CONMEBOL", flag_url: "https://flagcdn.com/br.svg", fifa_ranking: 5, fifa_ranking_points: 1788.7, elo_rating: 2022, gdp_per_capita: 10044, population: 203000000, football_popularity_score: 0.98, host_advantage_score: 0, historical_world_cup_score: 1 }
];

export const players: Player[] = [
  { id: 1, team_id: 1, name: "Erling Haaland", position: "ST", shirt_number: 9, age: 25, club: "Manchester City", caps: 39, goals: 38, rating: 94 },
  { id: 2, team_id: 1, name: "Martin Odegaard", position: "CM", shirt_number: 10, age: 27, club: "Arsenal", caps: 70, goals: 4, rating: 89 },
  { id: 3, team_id: 2, name: "Kylian Mbappe", position: "LW", shirt_number: 10, age: 27, club: "Real Madrid", caps: 92, goals: 52, rating: 95 },
  { id: 4, team_id: 2, name: "Aurelien Tchouameni", position: "DM", shirt_number: 8, age: 26, club: "Real Madrid", caps: 44, goals: 3, rating: 87 },
  { id: 5, team_id: 3, name: "Sadio Mane", position: "LW", shirt_number: 10, age: 34, club: "Al Nassr", caps: 108, goals: 45, rating: 86 },
  { id: 6, team_id: 4, name: "Aymen Hussein", position: "ST", shirt_number: 18, age: 30, club: "Al Khor", caps: 80, goals: 28, rating: 77 },
  { id: 7, team_id: 5, name: "Cody Gakpo", position: "LW", shirt_number: 11, age: 27, club: "Liverpool", caps: 41, goals: 14, rating: 86 },
  { id: 8, team_id: 6, name: "Lamine Yamal", position: "RW", shirt_number: 19, age: 18, club: "Barcelona", caps: 28, goals: 8, rating: 90 },
  { id: 9, team_id: 7, name: "Bruno Fernandes", position: "AM", shirt_number: 8, age: 31, club: "Manchester United", caps: 82, goals: 25, rating: 88 },
  { id: 10, team_id: 8, name: "Vinicius Junior", position: "LW", shirt_number: 7, age: 25, club: "Real Madrid", caps: 40, goals: 7, rating: 93 }
];

const byTeam = (id: number) => teams.find((team) => team.id === id)!;

export const broadcasts: Broadcast[] = [
  { id: 1, match_id: 1, country_code: "NO", broadcaster: "NRK", channel: "NRK TV", stream_url: "https://tv.nrk.no/", replay_url: "https://tv.nrk.no/programmer/sport", requires_login: false, source_url: "https://www.nrk.no/sport/" },
  { id: 2, match_id: 2, country_code: "NO", broadcaster: "TV 2", channel: "TV 2 Play", stream_url: "https://play.tv2.no/", replay_url: "https://play.tv2.no/sport", requires_login: true, source_url: "https://www.tv2.no/sport/" },
  { id: 3, match_id: 3, country_code: "NO", broadcaster: "TV 2", channel: "TV 2 Direkte", stream_url: "https://play.tv2.no/", replay_url: "https://play.tv2.no/sport", requires_login: true, source_url: "https://www.tv2.no/sport/" },
  { id: 4, match_id: 4, country_code: "NO", broadcaster: "NRK", channel: "NRK", stream_url: "https://tv.nrk.no/", replay_url: "https://tv.nrk.no/programmer/sport", requires_login: false, source_url: "https://www.nrk.no/sport/" },
  { id: 5, match_id: 5, country_code: "NO", broadcaster: "TV 2", channel: "TV 2 Sport 1", stream_url: "https://play.tv2.no/", replay_url: "https://play.tv2.no/sport", requires_login: true, source_url: "https://www.tv2.no/sport/" }
];

export const matches: Match[] = [
  { id: 1, tournament_year: 2026, stage: "Group stage", group_name: "I", home_team_id: 2, away_team_id: 3, kickoff_at: "2026-06-16T16:00:00+00:00", kickoff_timezone: "Europe/Oslo", stadium: "New York New Jersey Stadium", city: "New York/New Jersey", status: "scheduled", home_score: null, away_score: null, home_team: byTeam(2), away_team: byTeam(3), broadcasts: broadcasts.filter((item) => item.match_id === 1) },
  { id: 2, tournament_year: 2026, stage: "Group stage", group_name: "I", home_team_id: 4, away_team_id: 1, kickoff_at: "2026-06-16T19:00:00+00:00", kickoff_timezone: "Europe/Oslo", stadium: "Boston Stadium", city: "Boston", status: "scheduled", home_score: null, away_score: null, home_team: byTeam(4), away_team: byTeam(1), broadcasts: broadcasts.filter((item) => item.match_id === 2) },
  { id: 3, tournament_year: 2026, stage: "Group stage", group_name: "I", home_team_id: 1, away_team_id: 3, kickoff_at: "2026-06-22T19:00:00+00:00", kickoff_timezone: "Europe/Oslo", stadium: "New York New Jersey Stadium", city: "New York/New Jersey", status: "scheduled", home_score: null, away_score: null, home_team: byTeam(1), away_team: byTeam(3), broadcasts: broadcasts.filter((item) => item.match_id === 3) },
  { id: 4, tournament_year: 2026, stage: "Group stage", group_name: "I", home_team_id: 2, away_team_id: 4, kickoff_at: "2026-06-22T22:00:00+00:00", kickoff_timezone: "Europe/Oslo", stadium: "Philadelphia Stadium", city: "Philadelphia", status: "scheduled", home_score: null, away_score: null, home_team: byTeam(2), away_team: byTeam(4), broadcasts: broadcasts.filter((item) => item.match_id === 4) },
  { id: 5, tournament_year: 2026, stage: "Group stage", group_name: "I", home_team_id: 1, away_team_id: 2, kickoff_at: "2026-06-26T19:00:00+00:00", kickoff_timezone: "Europe/Oslo", stadium: "Boston Stadium", city: "Boston", status: "scheduled", home_score: null, away_score: null, home_team: byTeam(1), away_team: byTeam(2), broadcasts: broadcasts.filter((item) => item.match_id === 5) },
  { id: 6, tournament_year: 2026, stage: "Group stage", group_name: "I", home_team_id: 3, away_team_id: 4, kickoff_at: "2026-06-26T19:00:00+00:00", kickoff_timezone: "Europe/Oslo", stadium: "Toronto Stadium", city: "Toronto", status: "scheduled", home_score: null, away_score: null, home_team: byTeam(3), away_team: byTeam(4), broadcasts: [] }
];

export const prediction: ModelPrediction = {
  match_id: 1,
  model_version: "wc-v0.2-norway",
  home_win_probability: 0.47,
  draw_probability: 0.27,
  away_win_probability: 0.26,
  expected_home_goals: 1.34,
  expected_away_goals: 1.02,
  predicted_score: "1-1",
  explanation_json: {
    summary: "Deterministisk v0-baseline som bruker normalisert rangering, Elo og landnivåvariabler.",
    limitations: [
      "BNP per innbygger er en proxy for sportslig infrastruktur.",
      "Befolkning er en proxy for talentgrunnlag.",
      "Fotballpopularitet er seedet frem til dokumenterte datakilder kobles på.",
      "Tilfeldighet brukes bare i Monte Carlo-simulering."
    ]
  }
};

export const liveTimeline: LiveSnapshot[] = [
];

export const whatChanged: ProbabilityEvent[] = [
];

