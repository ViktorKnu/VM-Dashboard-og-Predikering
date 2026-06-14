import type { Match, Team } from "./types";

export const APP_NAME = "VM Dashboard og Predikering";

const teamNames: Record<string, string> = {
  Norway: "Norge",
  France: "Frankrike",
  Senegal: "Senegal",
  Iraq: "Irak",
  Netherlands: "Nederland",
  Spain: "Spania",
  Portugal: "Portugal",
  Brazil: "Brasil"
};

const stageLabels: Record<string, string> = {
  "Group stage": "Gruppespill",
  "Round of 32": "32-delsfinale",
  "Round of 16": "Åttedelsfinale",
  Quarterfinal: "Kvartfinale",
  Semifinal: "Semifinale",
  Final: "Finale"
};

const statusLabels: Record<Match["status"], string> = {
  scheduled: "Ikke startet",
  live: "Direkte",
  finished: "Ferdig"
};

const eventLabels: Record<string, string> = {
  goal: "Mål",
  red_card: "Rødt kort",
  xg_swing: "xG-sving",
  shot_momentum: "Skuddtrykk",
  substitution: "Bytte",
  formation_change: "Formasjonsendring",
  yellow_card_risk: "Gulkort-risiko",
  match_minute_and_score_state: "Minutt og kampbilde"
};

const featureLabels: Record<string, string> = {
  elo_rating: "Elo-rating",
  fifa_ranking: "FIFA-rangering",
  historical_world_cup_score: "Historisk VM-score",
  football_popularity_score: "Fotballpopularitet",
  confederation_strength: "Konføderasjonsstyrke",
  gdp_per_capita: "BNP per innbygger",
  population: "Befolkning",
  host_advantage_score: "Vertsnasjonsfordel"
};

const metricLabels: Record<string, string> = {
  accuracy: "Treffsikkerhet",
  log_loss: "Log loss",
  brier_score: "Brier-score"
};

export function teamName(team: Team | string): string {
  const name = typeof team === "string" ? team : team.name;
  return teamNames[name] ?? name;
}

export function matchStageLabel(stage: string): string {
  return stageLabels[stage] ?? stage;
}

export function matchStatusLabel(status: Match["status"]): string {
  return statusLabels[status] ?? status;
}

export function probabilityEventLabel(eventType: string): string {
  return eventLabels[eventType] ?? eventType.replaceAll("_", " ");
}

export function featureLabel(feature: string): string {
  return featureLabels[feature] ?? feature.replaceAll("_", " ");
}

export function metricLabel(metric: string): string {
  return metricLabels[metric] ?? metric.replaceAll("_", " ");
}
