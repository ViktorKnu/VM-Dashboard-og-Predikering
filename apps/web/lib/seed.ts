import type { Broadcast, Lineup, LiveSnapshot, Match, MatchEvent, ModelPrediction, Player, ProbabilityEvent, Team, TopScorerPrediction, TopScorerStanding } from "./types";
import matchSnapshot from "./data/matches.json";

const mkTeam = (
  id: number,
  group_name: string,
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
  group_name,
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
): Player => ({ id, team_id, name, position, shirt_number, age, club, caps, goals, tournament_goals: 0, rating });

export const teams: Team[] = [
  mkTeam(1, "I", "Norway", "NOR", "UEFA", "no", 29, 1528.0, 1810, 87962, 5500000, 0.76, 0.18),
  mkTeam(2, "I", "France", "FRA", "UEFA", "fr", 3, 1838.0, 2048, 44461, 68000000, 0.92, 0.92),
  mkTeam(3, "I", "Senegal", "SEN", "CAF", "sn", 19, 1609.0, 1802, 1598, 17700000, 0.88, 0.34),
  mkTeam(4, "I", "Iraq", "IRQ", "AFC", "iq", 58, 1410.3, 1640, 5937, 45500000, 0.84, 0.08),
  mkTeam(5, "J", "Argentina", "ARG", "CONMEBOL", "ar", 2, 1860.0, 2108, 13730, 46000000, 0.97, 1),
  mkTeam(6, "J", "Algeria", "ALG", "CAF", "dz", 35, 1512.0, 1735, 5260, 46000000, 0.9, 0.3),
  mkTeam(7, "J", "Austria", "AUT", "UEFA", "at", 24, 1546.0, 1815, 56000, 9100000, 0.82, 0.42),
  mkTeam(8, "J", "Jordan", "JOR", "AFC", "jo", 66, 1375.0, 1555, 4311, 11500000, 0.77, 0.02),
  mkTeam(9, "K", "Portugal", "POR", "UEFA", "pt", 6, 1748.1, 1975, 27405, 10400000, 0.95, 0.62),
  mkTeam(10, "K", "DR Congo", "COD", "CAF", "cd", 56, 1420.0, 1648, 715, 105000000, 0.86, 0.08),
  mkTeam(11, "K", "Uzbekistan", "UZB", "AFC", "uz", 50, 1455.0, 1662, 2496, 36400000, 0.72, 0.02),
  mkTeam(12, "K", "Colombia", "COL", "CONMEBOL", "co", 13, 1685.0, 1905, 6979, 52000000, 0.94, 0.45),
  mkTeam(13, "L", "England", "ENG", "UEFA", "gb-eng", 4, 1813.0, 2030, 48900, 57000000, 0.96, 0.84),
  mkTeam(14, "L", "Croatia", "CRO", "UEFA", "hr", 10, 1710.0, 1900, 21460, 3900000, 0.91, 0.82),
  mkTeam(15, "L", "Ghana", "GHA", "CAF", "gh", 72, 1350.0, 1610, 2238, 34000000, 0.89, 0.34),
  mkTeam(16, "L", "Panama", "PAN", "CONCACAF", "pa", 30, 1525.0, 1665, 18490, 4500000, 0.74, 0.08),
  mkTeam(17, "A", "Mexico", "MEX", "CONCACAF", "mx", 14, 1650.0, 1845, 13926, 129000000, 0.94, 0.66),
  mkTeam(18, "A", "South Africa", "RSA", "CAF", "za", 60, 1402.0, 1618, 6766, 62000000, 0.82, 0.2),
  mkTeam(19, "A", "South Korea", "KOR", "AFC", "kr", 25, 1563.0, 1788, 33147, 51700000, 0.8, 0.46),
  mkTeam(20, "A", "Czech Republic", "CZE", "UEFA", "cz", 40, 1495.0, 1762, 30427, 10900000, 0.78, 0.42),
  mkTeam(21, "B", "Canada", "CAN", "CONCACAF", "ca", 27, 1548.0, 1745, 53372, 40800000, 0.66, 0.1),
  mkTeam(22, "B", "Bosnia and Herzegovina", "BIH", "UEFA", "ba", 71, 1358.0, 1588, 7567, 3200000, 0.83, 0.08),
  mkTeam(23, "B", "Qatar", "QAT", "AFC", "qa", 51, 1447.0, 1668, 87480, 2700000, 0.7, 0.08),
  mkTeam(24, "B", "Switzerland", "SUI", "UEFA", "ch", 17, 1617.0, 1878, 99995, 8900000, 0.78, 0.52),
  mkTeam(25, "C", "Brazil", "BRA", "CONMEBOL", "br", 5, 1772.0, 2022, 10044, 203000000, 0.98, 1),
  mkTeam(26, "C", "Morocco", "MAR", "CAF", "ma", 12, 1690.0, 1888, 3850, 37800000, 0.92, 0.58),
  mkTeam(27, "C", "Haiti", "HAI", "CONCACAF", "ht", 84, 1284.0, 1495, 1748, 11700000, 0.76, 0.04),
  mkTeam(28, "C", "Scotland", "SCO", "UEFA", "gb-sct", 36, 1510.0, 1738, 49300, 5500000, 0.84, 0.28),
  mkTeam(29, "D", "United States", "USA", "CONCACAF", "us", 14, 1652.0, 1828, 81632, 336000000, 0.68, 0.42),
  mkTeam(30, "D", "Paraguay", "PAR", "CONMEBOL", "py", 39, 1501.0, 1748, 6153, 6100000, 0.9, 0.36),
  mkTeam(31, "D", "Australia", "AUS", "AFC", "au", 26, 1558.0, 1765, 64820, 26600000, 0.7, 0.3),
  mkTeam(32, "D", "Turkey", "TUR", "UEFA", "tr", 25, 1560.0, 1782, 12985, 85300000, 0.9, 0.34),
  mkTeam(33, "E", "Germany", "GER", "UEFA", "de", 9, 1716.0, 1968, 52745, 84600000, 0.94, 0.96),
  mkTeam(34, "E", "Curacao", "CUW", "CONCACAF", "cw", 82, 1298.0, 1510, 21400, 150000, 0.72, 0.02),
  mkTeam(35, "E", "Ivory Coast", "CIV", "CAF", "ci", 42, 1487.0, 1705, 2728, 31000000, 0.88, 0.24),
  mkTeam(36, "E", "Ecuador", "ECU", "CONMEBOL", "ec", 23, 1579.0, 1818, 6630, 18200000, 0.9, 0.24),
  mkTeam(37, "F", "Netherlands", "NED", "UEFA", "nl", 7, 1745.0, 1987, 61098, 17900000, 0.9, 0.78),
  mkTeam(38, "F", "Japan", "JPN", "AFC", "jp", 18, 1608.0, 1840, 33834, 124000000, 0.74, 0.34),
  mkTeam(39, "F", "Sweden", "SWE", "UEFA", "se", 43, 1485.0, 1760, 56305, 10600000, 0.8, 0.5),
  mkTeam(40, "F", "Tunisia", "TUN", "CAF", "tn", 40, 1493.0, 1698, 3895, 12400000, 0.86, 0.16),
  mkTeam(41, "G", "Belgium", "BEL", "UEFA", "be", 8, 1731.0, 1940, 53475, 11800000, 0.84, 0.66),
  mkTeam(42, "G", "Egypt", "EGY", "CAF", "eg", 34, 1516.0, 1726, 3512, 112000000, 0.93, 0.22),
  mkTeam(43, "G", "Iran", "IRN", "AFC", "ir", 20, 1588.0, 1785, 4502, 89000000, 0.84, 0.18),
  mkTeam(44, "G", "New Zealand", "NZL", "OFC", "nz", 86, 1275.0, 1490, 48850, 5300000, 0.55, 0.06),
  mkTeam(45, "H", "Spain", "ESP", "UEFA", "es", 1, 1885.0, 2001, 32677, 48600000, 0.94, 0.86),
  mkTeam(46, "H", "Cape Verde", "CPV", "CAF", "cv", 68, 1368.0, 1580, 4894, 600000, 0.82, 0.02),
  mkTeam(47, "H", "Saudi Arabia", "KSA", "AFC", "sa", 60, 1400.0, 1648, 32920, 36900000, 0.78, 0.18),
  mkTeam(48, "H", "Uruguay", "URU", "CONMEBOL", "uy", 16, 1624.0, 1908, 22564, 3400000, 0.96, 0.82)
];

export const players: Player[] = [
  mkPlayer(1, 1, "Erling Haaland", "ST", 9, 25, "Manchester City", 52, 59, 94),
  mkPlayer(2, 1, "Martin Odegaard", "CM", 10, 27, "Arsenal", 70, 4, 89),
  mkPlayer(3, 2, "Kylian Mbappe", "LW", 10, 27, "Real Madrid", 100, 60, 95),
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
  mkPlayer(19, 14, "Petar Musa", "ST", 18, 28, "Benfica", 20, 6, 80),
  mkPlayer(20, 2, "Ousmane Dembele", "RW", 7, 29, "Paris Saint-Germain", 63, 11, 91)
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

type SnapshotMatch = Omit<Match, "kickoff_timezone" | "home_team" | "away_team" | "broadcasts">;

export const matchDataMetadata = matchSnapshot.metadata;
export const matches: Match[] = (matchSnapshot.matches as SnapshotMatch[])
  .map((match) => ({
    ...match,
    status: match.status as Match["status"],
    kickoff_timezone: "Europe/Oslo" as const,
    home_team: byTeam(match.home_team_id),
    away_team: byTeam(match.away_team_id),
    broadcasts: broadcasts.filter((item) => item.match_id === match.id)
  }))
  .sort((first, second) => new Date(first.kickoff_at).getTime() - new Date(second.kickoff_at).getTime());

const mkEvent = (
  id: number,
  match_id: number,
  team_id: number,
  player_id: number | null,
  minute: number,
  description: string,
  extra_minute: number | null = null
): MatchEvent => ({
  id,
  match_id,
  team_id,
  player_id,
  minute,
  extra_minute,
  event_type: "goal",
  description,
  player: player_id ? byPlayer(player_id) : null,
  team: byTeam(team_id)
});

export const events: MatchEvent[] = [
  mkEvent(1, 1, 2, 3, 66, "Kylian Mbappe sendte Frankrike foran mot Senegal."),
  mkEvent(2, 1, 2, 7, 79, "Bradley Barcola doblet ledelsen for Frankrike."),
  mkEvent(3, 1, 3, null, 88, "Senegal reduserte sent i kampen."),
  mkEvent(4, 1, 2, 3, 90, "Mbappe avgjorde med sitt andre mål.", 4),
  mkEvent(5, 2, 1, 1, 18, "Erling Haaland scoret Norges første mål mot Irak."),
  mkEvent(6, 2, 4, 6, 39, "Aymen Hussein utlignet for Irak."),
  mkEvent(7, 2, 1, 1, 45, "Haaland satte Norge tilbake i ledelsen før pause.", 3),
  mkEvent(8, 2, 1, 8, 72, "Leo Ostigard økte ledelsen på dødball."),
  mkEvent(9, 2, 1, null, 90, "Norge fikk kampens fjerde scoring på overtid.", 2),
  mkEvent(10, 7, 5, 9, 17, "Lionel Messi åpnet scoringen mot Algerie."),
  mkEvent(11, 7, 5, 9, 60, "Messi økte Argentinas ledelse."),
  mkEvent(12, 7, 5, 9, 76, "Messi fullførte hattricket."),
  mkEvent(13, 8, 7, 10, 22, "Romano Schmid sendte Østerrike foran mot Jordan."),
  mkEvent(14, 8, 8, 11, 29, "Ali Olwan scoret Jordans første VM-mål."),
  mkEvent(15, 8, 7, null, 77, "Østerrike tok ledelsen etter selvmål."),
  mkEvent(16, 8, 7, 12, 90, "Marko Arnautovic avgjorde på straffe.", 3),
  mkEvent(17, 13, 9, 13, 6, "Joao Neves ga Portugal en tidlig ledelse."),
  mkEvent(18, 13, 10, 14, 44, "Yoane Wissa utlignet for DR Kongo."),
  mkEvent(19, 18, 13, 15, 12, "Harry Kane scoret på straffe mot Kroatia."),
  mkEvent(20, 18, 14, 18, 25, "Martin Baturina utlignet for Kroatia."),
  mkEvent(21, 18, 13, 15, 40, "Kane headet inn sitt andre mål."),
  mkEvent(22, 18, 14, 19, 44, "Petar Musa gjorde 2-2 før pause."),
  mkEvent(23, 18, 13, 16, 52, "Jude Bellingham sendte England foran igjen."),
  mkEvent(24, 18, 13, 17, 85, "Marcus Rashford punkterte kampen."),
  mkEvent(25, 4, 2, 3, 14, "Kylian Mbappe scoret Frankrikes første mål mot Irak."),
  mkEvent(26, 4, 2, 3, 54, "Mbappe scoret sitt andre mål mot Irak."),
  mkEvent(27, 3, 1, 1, 48, "Erling Haaland scoret mot Senegal."),
  mkEvent(28, 3, 1, 1, 58, "Haaland scoret sitt andre mål mot Senegal."),
  mkEvent(29, 9, 5, 9, 31, "Lionel Messi scoret mot Østerrike."),
  mkEvent(30, 9, 5, 9, 73, "Messi scoret sitt andre mål mot Østerrike."),
  mkEvent(31, 4, 2, 20, 66, "Ousmane Dembele scoret mot Irak."),
  mkEvent(32, 5, 2, 20, 7, "Ousmane Dembele ga Frankrike ledelsen mot Norge."),
  mkEvent(33, 5, 2, 20, 20, "Dembele scoret sitt andre mål mot Norge."),
  mkEvent(34, 5, 2, 20, 32, "Dembele fullførte hattricket mot Norge.")
];

for (const event of events) {
  if (event.event_type !== "goal" || event.player_id === null) continue;
  const scorer = players.find((player) => player.id === event.player_id);
  if (scorer) scorer.tournament_goals += 1;
}

export const prediction: ModelPrediction = {
  match_id: 1,
  model_id: "country",
  model_name: "Landmodell",
  model_version: "wc-v0.2-country-features",
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

export const topScorers: TopScorerStanding[] = players
  .filter((player) => player.tournament_goals > 0)
  .map((player) => {
    const playerGoals = events.filter((event) => event.event_type === "goal" && event.player_id === player.id);
    const lastGoal = Math.max(...playerGoals.map((event) => event.minute + (event.extra_minute ?? 0) / 100));
    return {
      player_id: player.id,
      player,
      team: byTeam(player.team_id),
      goals: player.tournament_goals,
      last_goal_minute: lastGoal
    };
  })
  .sort((first, second) => second.goals - first.goals || first.last_goal_minute - second.last_goal_minute);

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
      model_version: "wc-v0.2-country-features",
      signals: ["spiller-rating", "landslagsmål per kamp", "lagets Elo-proxy"]
    };
  });

const forecastMatch = matches.find((match) => match.id === 5) ?? matches[0];
const mkModelForecast = (
  model_id: string,
  model_name: string,
  model_version: string,
  matchWinnerTeamId: number,
  matchWinnerProbability: number,
  cupWinnerTeamId: number,
  cupWinnerProbability: number,
  predictedScore: string,
  topFiveTeamIds: number[]
) => ({
  model_id,
  model_name,
  model_version,
  match: forecastMatch,
  match_prediction: {
    ...prediction,
    match_id: forecastMatch.id,
    model_id,
    model_name,
    model_version,
    predicted_score: predictedScore
  },
  match_winner_team: byTeam(matchWinnerTeamId),
  match_winner_probability: matchWinnerProbability,
  cup_winner_team: byTeam(cupWinnerTeamId),
  cup_winner_probability: cupWinnerProbability,
  cup_top_five: topFiveTeamIds.map((teamId, index) => ({
    team: byTeam(teamId),
    score: Number((0.76 - index * 0.035).toFixed(3))
  }))
});

const modelForecasts = [
  mkModelForecast("simple", "Enkel modell", "wc-v0.1-simple", 2, 0.56, 5, 0.16, "1-2", [5, 25, 2, 45, 33]),
  mkModelForecast("country", "Landmodell", "wc-v0.2-country-features", 2, 0.58, 5, 0.15, "1-2", [5, 2, 25, 45, 33]),
  mkModelForecast("advanced", "Avansert modell", "wc-v0.3-squad-context", 1, 0.53, 2, 0.14, "2-1", [2, 5, 25, 13, 45]),
  mkModelForecast("expert", "Ekspertmodell", "wc-v0.4-many-parameters", 2, 0.55, 25, 0.14, "1-2", [25, 5, 2, 45, 33])
];

export const modelLab = {
  active_model_id: "country",
  model_forecasts: modelForecasts,
  models: [
    {
      id: "simple",
      name: "Enkel modell",
      version: "wc-v0.1-simple",
      status: "available",
      description: "Rask baseline som kombinerer FIFA-rangering og Elo. Denne er lett å forklare og brukes som første sammenligningspunkt.",
      features: ["fifa_ranking", "elo_rating"],
      weights: { fifa_ranking: 0.42, elo_rating: 0.58 },
      accuracy: 0.52,
      log_loss: 1.02,
      brier_score: 0.23,
      training_status: "seedet backtest",
      training_data: "Seedet turneringsfelt og lokal sanity-test, ikke historisk produksjonstrening.",
      training_notes: ["Lett å forklare.", "Brukes som kontrollmodell."],
      limitations: [
        "Tar ikke hensyn til form, skader eller kampkontekst.",
        "Brukes som enkel referanse, ikke som endelig prediksjonsmotor."
      ]
    },
    {
      id: "country",
      name: "Landmodell",
      version: "wc-v0.2-country-features",
      status: "available",
      description: "Utvidet modell med landnivå-features, økonomiske proxyer, fotballkultur og historisk VM-styrke.",
      features: ["fifa_ranking", "elo_rating", "gdp_per_capita", "population", "football_popularity_score", "confederation_strength", "host_advantage_score", "historical_world_cup_score"],
      weights: { fifa_ranking: 0.2, elo_rating: 0.26, gdp_per_capita: 0.08, population: 0.07, football_popularity_score: 0.1, confederation_strength: 0.1, host_advantage_score: 0.05, historical_world_cup_score: 0.14 },
      accuracy: 0.54,
      log_loss: 0.98,
      brier_score: 0.22,
      training_status: "seedet backtest",
      training_data: "Seedet VM-felt med dokumenterte begrensninger. Klar for Fjelstul/FIFA-backtest senere.",
      training_notes: ["Normaliserer features innen aktivt turneringsfelt.", "Økonomi og befolkning brukes bare som proxyer."],
      limitations: [
        "Økonomi og befolkning er proxyer, ikke direkte årsaker.",
        "Må backtestes mot historiske VM-kamper før den brukes som hovedmodell."
      ]
    },
    {
      id: "advanced",
      name: "Avansert modell",
      version: "wc-v0.3-squad-context",
      status: "available",
      description: "Legger til spillerstyrke, landslagsproduksjon og tidlig turneringsform oppå landmodellen.",
      features: ["fifa_ranking", "elo_rating", "gdp_per_capita", "population", "football_popularity_score", "confederation_strength", "historical_world_cup_score", "average_player_rating", "top_player_rating", "striker_rating", "squad_caps", "player_goal_rate", "current_group_points", "recent_goal_difference"],
      weights: {},
      accuracy: 0.57,
      log_loss: 0.93,
      brier_score: 0.2,
      training_status: "lokal treningsstruktur",
      training_data: "Seedet spiller- og kampdatasett. Trenger historiske VM-kamper før tallene kan kalles ekte backtest.",
      training_notes: ["Bruker bare tilgjengelige spiller- og kampfelt.", "Manglende live-/skadedata erstattes ikke med oppdiktede verdier."],
      limitations: [
        "Spiller-rating er seedet og må erstattes med dokumentert kilde.",
        "Tidlig gruppespillform er ustabil med få kamper."
      ]
    },
    {
      id: "expert",
      name: "Ekspertmodell",
      version: "wc-v0.4-many-parameters",
      status: "available",
      description: "Mange-parameter-modell med landstyrke, spillerkvalitet, målproduksjon, turneringsform og proxyer for robusthet.",
      features: ["fifa_ranking", "fifa_ranking_points", "elo_rating", "gdp_per_capita", "population", "football_popularity_score", "confederation_strength", "host_advantage_score", "historical_world_cup_score", "average_player_rating", "top_player_rating", "striker_rating", "squad_caps", "player_goal_rate", "attacking_depth", "current_group_points", "recent_goal_difference", "goals_for_per_match", "goals_against_per_match", "upset_resilience_proxy", "tournament_experience_proxy"],
      weights: {},
      accuracy: null,
      log_loss: null,
      brier_score: null,
      training_status: "eksperimentell",
      training_data: "Klar som struktur for historisk trening, men ikke validert på ekte full historikk ennå.",
      training_notes: ["Designet for mange parametre og senere kalibrering.", "Skal trenes mot historiske VM-kamper før den brukes som fasit."],
      limitations: [
        "Mange parametre gir høyere risiko for overfitting.",
        "Metrikker står tomme til modellen er trent på historiske data."
      ]
    }
  ],
  version_history: [
    { version: "wc-v0.1-simple", date: "2026-06-01", notes: "Enkel baseline med FIFA-rangering og Elo." },
    { version: "wc-v0.2-country-features", date: "2026-06-14", notes: "Landmodell med normaliserte landfeatures, økonomiske proxyer og fotballkultur." },
    { version: "wc-v0.3-squad-context", date: "2026-06-23", notes: "Avansert modell med spillerstyrke og kampkontekst fra tilgjengelige data." },
    { version: "wc-v0.4-many-parameters", date: "2026-06-23", notes: "Ekspertmodell med mange parametre, klar for historisk trening og kalibrering." }
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
  training_plan: [
    "Importer historiske VM-kamper fra Fjelstul/FIFA.",
    "Lås feature-generering per kampdato for å unngå datalekkasje.",
    "Tren enkel, land, avansert og ekspertmodell på samme split.",
    "Evaluer accuracy, log loss, Brier-score og kalibrering.",
    "Publiser bare modeller som har dokumentert datagrunnlag."
  ],
  chart_slots: {
    calibration_chart: "Klar for ekte kalibreringsgraf når historisk backtest er koblet på.",
    confusion_matrix: "Klar for forvekslingsmatrise per valgt modell.",
    shap_explanation: "Klar for SHAP-lignende forklaring per prediksjon."
  }
};
