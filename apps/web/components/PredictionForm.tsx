"use client";

import { useMemo, useState } from "react";
import type { Match, Player, Team } from "@/lib/types";

export function PredictionForm({ match, players, teams }: { match: Match; players: Player[]; teams: Team[] }) {
  const [homeScore, setHomeScore] = useState("1");
  const [awayScore, setAwayScore] = useState("0");
  const [winner, setWinner] = useState(String(match.home_team_id));
  const [firstScorer, setFirstScorer] = useState(String(players[0]?.id ?? ""));
  const [tournamentWinner, setTournamentWinner] = useState(String(teams[1]?.id ?? ""));
  const [topScorer, setTopScorer] = useState(String(players[2]?.id ?? ""));

  const comparison = useMemo(() => {
    const predictedWinner = Number(winner) === match.home_team_id ? match.home_team.name : Number(winner) === match.away_team_id ? match.away_team.name : "Uavgjort";
    return {
      predictedWinner,
      score: `${homeScore}-${awayScore}`,
      modelHint: "Modellens baseline sammenlignes mot brukerens valg etter kampslutt."
    };
  }, [awayScore, homeScore, match.away_team.name, match.away_team_id, match.home_team.name, match.home_team_id, winner]);

  return (
    <section className="rounded-md border border-ink/10 bg-white/88 p-4">
      <h2 className="mb-3 text-lg font-semibold">Din prediksjon</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium">
          {match.home_team.name}
          <input className="mt-1 w-full rounded-sm border border-ink/15 px-3 py-2" min="0" type="number" value={homeScore} onChange={(event) => setHomeScore(event.target.value)} />
        </label>
        <label className="text-sm font-medium">
          {match.away_team.name}
          <input className="mt-1 w-full rounded-sm border border-ink/15 px-3 py-2" min="0" type="number" value={awayScore} onChange={(event) => setAwayScore(event.target.value)} />
        </label>
        <label className="text-sm font-medium">
          Vinner
          <select className="mt-1 w-full rounded-sm border border-ink/15 px-3 py-2" value={winner} onChange={(event) => setWinner(event.target.value)}>
            <option value={match.home_team_id}>{match.home_team.name}</option>
            <option value={match.away_team_id}>{match.away_team.name}</option>
            <option value="">Uavgjort</option>
          </select>
        </label>
        <label className="text-sm font-medium">
          Første målscorer
          <select className="mt-1 w-full rounded-sm border border-ink/15 px-3 py-2" value={firstScorer} onChange={(event) => setFirstScorer(event.target.value)}>
            {players.map((player) => <option key={player.id} value={player.id}>{player.name}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium">
          Turneringsvinner
          <select className="mt-1 w-full rounded-sm border border-ink/15 px-3 py-2" value={tournamentWinner} onChange={(event) => setTournamentWinner(event.target.value)}>
            {teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium">
          Toppscorer
          <select className="mt-1 w-full rounded-sm border border-ink/15 px-3 py-2" value={topScorer} onChange={(event) => setTopScorer(event.target.value)}>
            {players.map((player) => <option key={player.id} value={player.id}>{player.name}</option>)}
          </select>
        </label>
      </div>
      <div className="mt-4 rounded-sm bg-frost p-3 text-sm">
        <strong>{comparison.score}</strong> · {comparison.predictedWinner}. {comparison.modelHint}
      </div>
    </section>
  );
}

