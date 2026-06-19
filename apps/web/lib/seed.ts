import type { Broadcast, Lineup, LiveSnapshot, Match, ModelPrediction, Player, ProbabilityEvent, Team, TopScorerPrediction, TopScorerStanding } from "./types";

const mkTeam = (
  id: number,
  name: string,
  fifa_code: string,
  confederation: string,
  flag: string,
  fifa_ranking: number,
  fifa_ranking_points: number,
  elo_rating: number,
  gdp_per_capita: number,
  population: number,
  football_popularity_score: number,
  historical_world_cup_score: number
): Team => ({
  id,
  name,
  fifa_code,
  confederation,
  flag_url: `https://flagcdn.com/${flag}.svg`,
  fifa_ranking,
  fifa_ranking_points,
  elo_rating,
  gdp_per_capita,
  population,
  football_popularity_score,
  host_advantage_score: 0,
  historical_world_cup_score
});

const mkPlayer = (
  id: number,
  team_id: number,
  name: string,
  position: string,
  shirt_number: number,
  age: number,
  club: string,
  caps: number,
  goals: number,
  rating: number
): Player => ({ id, team_id, name, position, shirt_number, age, club, caps, goals, rating });

export const teams: Team[] = [
  mkTeam(1, "Norway", "NOR", "UEFA", "no", 29, 1528.0, 1810, 87962, 5500000, 0.76, 0.18),
  mkTeam(2, "France", "FRA", "UEFA", "fr", 3, 1838.0, 2048, 44461, 68000000, 0.92, 0.92),
  mkTeam(3, "Senegal", "SEN", "CAF", "sn", 19, 1609.0, 1802, 1598, 17700000, 0.88, 0.34),
  mkTeam(4, "Iraq", "IRQ", "AFC", "iq", 58, 1410.3, 1640, 5937, 45500000, 0.84, 0.08),
  mkTeam(5, "Argentina", "ARG", "CONMEBOL", "ar", 2, 1860.0, 2108, 13730, 46000000, 0.97, 1),
  mkTeam(6, "Algeria", "ALG", "CAF", "dz", 35, 1512.0, 1735, 5260, 46000000, 0.9, 0.3),
  mkTeam(7, "Austria", "AUT", "UEFA", "at", 24, 1546.0, 1815, 56000, 9100000, 0.82, 0.42),
  mkTeam(8, "Jordan", "JOR", "AFC", "jo", 66, 1375.0, 1555, 4311, 11500000, 0.77, 0.02),
  mkTeam(9, "Portugal", "POR", "UEFA", "pt", 6, 1748.1, 1975, 27405, 10400000, 0.95, 0.62),
  mkTeam(10, "DR Congo", "COD", "CAF", "cd", 56, 1420.0, 1648, 715, 105000000, 0.86, 0.08),
  mkTeam(11, "Uzbekistan", "UZB", "AFC", "uz", 50, 1455.0, 1662, 2496, 36400000, 0.72, 0.02),
  mkTeam(12, "Colombia", "COL", "CONMEBOL", "co", 13, 1685.0, 1905, 6979, 52000000, 0.94, 0.45),
  mkTeam(13, "England", "ENG", "UEFA", "gb-eng", 4, 1813.0, 2030, 48900, 57000000, 0.96, 0.84),
  mkTeam(14, "Croatia", "CRO", "UEFA", "hr", 10, 1710.0, 1900, 21460, 3900000, 0.91, 0.82),
  mkTeam(15, "Ghana", "GHA", "CAF", "gh", 72, 1350.0, 1610, 2238, 34000000, 0.89, 0.34),
  mkTeam(16, "Panama", "PAN", "CONCACAF", "pa", 30, 1525.0, 1665, 18490, 4500000, 0.74, 0.08)
];

export const players: Player[] = [
  mkPlayer(1, 1, "Erling Haaland", "ST", 9, 25, "Manchester City", 39, 38, 94),
  mkPlayer(2, 1, "Martin Odegaard", "CM", 10, 27, "Arsenal", 70, 4, 89),
  mkPlayer(3, 2, "Kylian Mbappe", "LW", 10, 27, "Real Madrid", 92, 52, 95),
  mkPlayer(4, 2, "Aurelien Tchouameni", "DM", 8, 26, "Real Madrid", 44, 3, 87),
  mkPlayer(5, 3, "Sadio Mane", "LW", 10, 34, "Al Nassr", 108, 45, 86),
  mkPlayer(6, 4, "Aymen Hussein", "ST", 18, 30, "Al Khor", 80, 28, 77),
  mkPlayer(7, 2, "Bradley Barcola", "LW", 20, 23, "Paris Saint-Germain", 28, 8, 85),
  mkPlayer(8, 1, "Leo Ostigard", "CB", 4, 26, "Genoa", 31, 2, 78),
  mkPlayer(9, 5, "Lionel Messi", "AM", 10, 38, "Inter Miami", 200, 112, 94),
  mkPlayer(10, 7, "Romano Schmid", "AM", 18, 26, "Werder Bremen", 24, 3, 81),
  mkPlayer(11, 8, "Ali Olwan", "ST", 9, 26, "Al-Faisaly", 77, 19, 76),
  mkPlayer(12, 7, "Marko Arnautovic", "ST", 7, 37, "Inter", 125, 39, 82),
  mkPlayer(13, 9, "Joao Neves", "CM", 6, 21, "Paris Saint-Germain", 28, 2, 86),
  mkPlayer(14, 10, "Yoane Wissa", "ST", 20, 29, "Newcastle United", 34, 7, 82),
  mkPlayer(15, 13, "Harry Kane", "ST", 9, 32, "Bayern Munich", 112, 74, 92),
  mkPlayer(16, 13, "Jude Bellingham", "AM", 10, 22, "Real Madrid", 47, 8, 93),
  mkPlayer(17, 13, "Marcus Rashford", "LW", 11, 28, "Manchester United", 69, 18, 84),
  mkPlayer(18, 14, "Martin Baturina", "AM", 10, 23, "Dinamo Zagreb", 18, 3, 80),
  mkPlayer(19, 14, "Petar Musa", "ST", 18, 28, "Benfica", 20, 6, 80)
];

const byTeam = (id: number) => teams.find((team) => team.id === id)!;
const byPlayer = (id: number) => players.find((player) => player.id === id)!;

const mkBroadcast = (id: number, match_id: number, broadcaster: string, channel: string, requires_login: boolean): Broadcast => ({
  id,
  match_id,
  country_code: "NO",
  broadcaster,
  channel,
  stream_url: broadcaster === "NRK" ? "https://tv.nrk.no/" : "https://play.tv2.no/",
  replay_url: broadcaster === "NRK" ? "https://tv.nrk.no/programmer/sport" : "https://play.tv2.no/sport",
  requires_login,
  source_url: broadcaster === "NRK" ? "https://www.nrk.no/sport/" : "https://www.tv2.no/sport/"
});

export const broadcasts: Broadcast[] = [
  mkBroadcast(1, 1, "NRK", "NRK TV", false),
  mkBroadcast(2, 2, "TV 2", "TV 2 Play", true),
  mkBroadcast(3, 3, "TV 2", "TV 2 Direkte", true),
  mkBroadcast(4, 4, "NRK", "NRK", false),
  mkBroadcast(5, 5, "TV 2", "TV 2 Sport 1", true),
  mkBroadcast(6, 7, "NRK", "NRK TV", false),
  mkBroadcast(7, 8, "TV 2", "TV 2 Play", true),
  mkBroadcast(8, 13, "TV 2", "TV 2 Play", true),
  mkBroadcast(9, 18, "NRK", "NRK TV", false)
];

const mkMatch = (
  id: number,
  group_name: string,
  home_team_id: number,
  away_team_id: number,
  kickoff_at: string,
  stadium: string,
  city: string,
  status: Match["status"] = "scheduled",
  home_score: number | null = null,
  away_score: number | null = null
): Match => ({
  id,
  tournament_year: 2026,
  stage: "Group stage",
  group_name,
  home_team_id,
  away_team_id,
  kickoff_at,
  kickoff_timezone: "Europe/Oslo",
  stadium,
  city,
  status,
  home_score,
  away_score,
  home_team: byTeam(home_team_id),
  away_team: byTeam(away_team_id),
  broadcasts: broadcasts.filter((item) => item.match_id === id)
});

export const matches: Match[] = [
  mkMatch(1, "I", 2, 3, "2026-06-16T16:00:00+00:00", "New York New Jersey Stadium", "New York/New Jersey", "finished", 3, 1),
  mkMatch(2, "I", 4, 1, "2026-06-16T19:00:00+00:00", "Boston Stadium", "Boston", "finished", 1, 4),
  mkMatch(3, "I", 1, 3, "2026-06-23T00:00:00+00:00", "New York New Jersey Stadium", "New York/New Jersey"),
  mkMatch(4, "I", 2, 4, "2026-06-22T21:00:00+00:00", "Philadelphia Stadium", "Philadelphia"),
  mkMatch(5, "I", 1, 2, "2026-06-26T19:00:00+00:00", "Boston Stadium", "Boston"),
  mkMatch(6, "I", 3, 4, "2026-06-26T19:00:00+00:00", "Toronto Stadium", "Toronto"),
  mkMatch(7, "J", 5, 6, "2026-06-16T22:00:00+00:00", "Kansas City Stadium", "Kansas City", "finished", 3, 0),
  mkMatch(8, "J", 7, 8, "2026-06-17T01:00:00+00:00", "San Francisco Bay Area Stadium", "San Francisco Bay Area", "finished", 3, 1),
  mkMatch(9, "J", 5, 7, "2026-06-22T17:00:00+00:00", "Dallas Stadium", "Dallas"),
  mkMatch(10, "J", 8, 6, "2026-06-23T03:00:00+00:00", "San Francisco Bay Area Stadium", "San Francisco Bay Area"),
  mkMatch(11, "J", 6, 7, "2026-06-28T02:00:00+00:00", "Kansas City Stadium", "Kansas City"),
  mkMatch(12, "J", 8, 5, "2026-06-28T02:00:00+00:00", "Dallas Stadium", "Dallas"),
  mkMatch(13, "K", 9, 10, "2026-06-17T19:00:00+00:00", "Houston Stadium", "Houston", "finished", 1, 1),
  mkMatch(14, "K", 9, 11, "2026-06-23T17:00:00+00:00", "Houston Stadium", "Houston"),
  mkMatch(15, "K", 12, 10, "2026-06-24T02:00:00+00:00", "Estadio Guadalajara", "Guadalajara"),
  mkMatch(16, "K", 12, 9, "2026-06-27T23:30:00+00:00", "Miami Stadium", "Miami"),
  mkMatch(17, "K", 10, 11, "2026-06-27T23:30:00+00:00", "Atlanta Stadium", "Atlanta"),
  mkMatch(18, "L", 13, 14, "2026-06-17T20:00:00+00:00", "Dallas Stadium", "Dallas", "finished", 4, 2),
  mkMatch(19, "L", 13, 15, "2026-06-23T20:00:00+00:00", "Boston Stadium", "Boston"),
  mkMatch(20, "L", 16, 14, "2026-06-23T23:00:00+00:00", "Toronto Stadium", "Toronto"),
  mkMatch(21, "L", 16, 13, "2026-06-27T21:00:00+00:00", "New York New Jersey Stadium", "New York/New Jersey"),
  mkMatch(22, "L", 14, 15, "2026-06-27T21:00:00+00:00", "Philadelphia Stadium", "Philadelphia")
].sort((first, second) => new Date(first.kickoff_at).getTime() - new Date(second.kickoff_at).getTime());

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

export const liveTimeline: LiveSnapshot[] = [];

export const whatChanged: ProbabilityEvent[] = [];

export const lineups: Lineup[] = [];

const mkScorer = (player_id: number, goals: number, last_goal_minute: number): TopScorerStanding => {
  const player = byPlayer(player_id);
  return { player_id, player, team: byTeam(player.team_id), goals, last_goal_minute };
};

export const topScorers: TopScorerStanding[] = [
  mkScorer(9, 3, 76),
  mkScorer(15, 2, 40),
  mkScorer(1, 2, 45),
  mkScorer(3, 2, 90),
  mkScorer(13, 1, 6),
  mkScorer(10, 1, 22),
  mkScorer(18, 1, 25),
  mkScorer(11, 1, 29),
  mkScorer(6, 1, 39),
  mkScorer(19, 1, 44),
  mkScorer(14, 1, 44),
  mkScorer(16, 1, 52),
  mkScorer(8, 1, 72),
  mkScorer(7, 1, 79),
  mkScorer(17, 1, 85),
  mkScorer(12, 1, 90)
];

export const topScorerPredictions: TopScorerPrediction[] = players
  .map((player) => {
    const team = byTeam(player.team_id);
    const goalsPerCap = player.goals / Math.max(player.caps, 1);
    const teamAttackProxy = (team.elo_rating - 1400) / 800;
    const score = Math.max(0.01, 0.45 * (player.rating / 100) + 0.35 * goalsPerCap + 0.2 * teamAttackProxy);
    return { player, team, score };
  })
  .sort((first, second) => second.score - first.score)
  .slice(0, 8)
  .map((item, _index, list) => {
    const total = list.reduce((sum, current) => sum + current.score, 0) || 1;
    return {
      player_id: item.player.id,
      player: item.player,
      team: item.team,
      probability: Number((item.score / total).toFixed(4)),
      expected_goals: Number((1.2 + item.score * 5).toFixed(2)),
      model_version: "wc-v0.2-norway",
      signals: ["spiller-rating", "landslagsmål per kamp", "lagets Elo-proxy"]
    };
  });

export const modelLab = {
  active_model_id: "simple",
  models: [
    {
      id: "simple",
      name: "Enkel modell",
      version: "wc-v0.1-simple",
      status: "active",
      description: "Rask baseline som kombinerer FIFA-rangering og Elo. Denne er lett å forklare og brukes som første sammenligningspunkt.",
      features: ["fifa_ranking", "elo_rating"],
      accuracy: 0.52,
      log_loss: 1.02,
      brier_score: 0.23,
      limitations: [
        "Tar ikke hensyn til form, skader eller kampkontekst.",
        "Brukes som enkel referanse, ikke som endelig prediksjonsmotor."
      ]
    },
    {
      id: "country",
      name: "Utvidet landmodell",
      version: "wc-v0.2-country-features",
      status: "planned",
      description: "Neste steg legger til BNP per innbygger, befolkning, fotballpopularitet, historisk VM-score og konføderasjonsstyrke.",
      features: ["fifa_ranking", "elo_rating", "gdp_per_capita", "population", "football_popularity_score", "historical_world_cup_score"],
      accuracy: null,
      log_loss: null,
      brier_score: null,
      limitations: [
        "Økonomi og befolkning er proxyer, ikke direkte årsaker.",
        "Må backtestes mot historiske VM-kamper før den brukes som hovedmodell."
      ]
    },
    {
      id: "advanced",
      name: "Avansert modell",
      version: "wc-v1.0-advanced",
      status: "planned",
      description: "Senere modell med historiske kampdata, ratings over tid, kalibrering, SHAP-lignende forklaringer og bedre evaluering.",
      features: ["all_country_features", "historical_match_results", "team_form", "squad_strength", "market_and_injury_signals", "calibrated_probabilities"],
      accuracy: null,
      log_loss: null,
      brier_score: null,
      limitations: [
        "Krever rene datakilder og streng validering.",
        "Skal ikke slippes før kalibrering og leakage-sjekk er dokumentert."
      ]
    }
  ],
  version_history: [
    { version: "wc-v0.1-simple", date: "2026-06-01", notes: "Enkel baseline med FIFA-rangering og Elo. Aktiv i demoen nå." },
    { version: "wc-v0.2-country-features", date: "2026-06-14", notes: "Planlagt utvidelse med normaliserte landfeatures, økonomiske proxyer og fotballkultur." },
    { version: "wc-v1.0-advanced", date: "Senere", notes: "Planlagt avansert modell med historisk backtesting, kalibrering og forklarbarhet." }
  ],
  feature_importance: [
    { feature: "elo_rating", importance: 0.28 },
    { feature: "fifa_ranking", importance: 0.22 },
    { feature: "historical_world_cup_score", importance: 0.1 },
    { feature: "football_popularity_score", importance: 0.1 },
    { feature: "confederation_strength", importance: 0.1 },
    { feature: "gdp_per_capita", importance: 0.08 },
    { feature: "population", importance: 0.07 },
    { feature: "host_advantage_score", importance: 0.05 }
  ],
  backtesting: {
    dataset: "Historiske VM-kamper: kobles mot Fjelstul + offisielle FIFA-resultater.",
    accuracy: 0.52,
    log_loss: 1.02,
    brier_score: 0.23
  },
  placeholders: {
    calibration_chart: "Reservert grafplass",
    confusion_matrix: "Reservert grafplass",
    shap_explanation: "Reservert forklaringsplass"
  }
};
