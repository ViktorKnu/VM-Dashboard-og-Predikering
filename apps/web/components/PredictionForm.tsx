"use client";

import { useMemo, useState } from "react";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";
import { teamName } from "@/lib/labels";
import type { Match, Player, Team, UserPrediction } from "@/lib/types";

const inputClassName = "mt-1 w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-fjord focus:ring-2 focus:ring-fjord/20";

export function PredictionForm({ match, players, teams }: { match: Match; players: Player[]; teams: Team[] }) {
  const router = useRouter();
  const [homeScore, setHomeScore] = useState("1");
  const [awayScore, setAwayScore] = useState("0");
  const [winner, setWinner] = useState(String(match.home_team_id));
  const [firstScorer, setFirstScorer] = useState(String(players[0]?.id ?? ""));
  const [tournamentWinner, setTournamentWinner] = useState(String(teams[1]?.id ?? ""));
  const [topScorer, setTopScorer] = useState(String(players[2]?.id ?? ""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<UserPrediction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const comparison = useMemo(() => {
    const predictedWinner = Number(winner) === match.home_team_id
      ? teamName(match.home_team)
      : Number(winner) === match.away_team_id
        ? teamName(match.away_team)
        : "Uavgjort";
    return {
      predictedWinner,
      score: `${homeScore}-${awayScore}`,
      modelHint: "Modellens baseline sammenlignes med brukerens valg etter kampslutt."
    };
  }, [awayScore, homeScore, match.away_team, match.away_team_id, match.home_team, match.home_team_id, winner]);

  async function submitPrediction() {
    setIsSubmitting(true);
    setError(null);
    setResult(null);

    const payload = {
      match_id: match.id,
      user_name: "portfolio_guest",
      predicted_home_score: Number(homeScore),
      predicted_away_score: Number(awayScore),
      predicted_winner_team_id: winner ? Number(winner) : null,
      first_goalscorer_player_id: firstScorer ? Number(firstScorer) : null,
      group_winners_json: null,
      tournament_winner_team_id: tournamentWinner ? Number(tournamentWinner) : null,
      tournament_top_scorer_player_id: topScorer ? Number(topScorer) : null
    };

    try {
      const response = await fetch(`${API_BASE_URL}/predictions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error("API-et avviste prediksjonen.");
      }
      setResult((await response.json()) as UserPrediction);
      router.refresh();
    } catch {
      setError("Kunne ikke sende prediksjonen. Sjekk at API-et kjører og at CORS er satt riktig.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="surface p-4">
      <div className="mb-4">
        <p className="eyebrow">Bruker mot modell</p>
        <h2 className="text-lg font-semibold">Din prediksjon</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-semibold">
          {teamName(match.home_team)}
          <input className={inputClassName} min="0" type="number" value={homeScore} onChange={(event) => setHomeScore(event.target.value)} />
        </label>
        <label className="text-sm font-semibold">
          {teamName(match.away_team)}
          <input className={inputClassName} min="0" type="number" value={awayScore} onChange={(event) => setAwayScore(event.target.value)} />
        </label>
        <label className="text-sm font-semibold">
          Vinner
          <select className={inputClassName} value={winner} onChange={(event) => setWinner(event.target.value)}>
            <option value={match.home_team_id}>{teamName(match.home_team)}</option>
            <option value={match.away_team_id}>{teamName(match.away_team)}</option>
            <option value="">Uavgjort</option>
          </select>
        </label>
        <label className="text-sm font-semibold">
          Første målscorer
          <select className={inputClassName} value={firstScorer} onChange={(event) => setFirstScorer(event.target.value)}>
            {players.map((player) => <option key={player.id} value={player.id}>{player.name}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold">
          Turneringsvinner
          <select className={inputClassName} value={tournamentWinner} onChange={(event) => setTournamentWinner(event.target.value)}>
            {teams.map((team) => <option key={team.id} value={team.id}>{teamName(team)}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold">
          Toppscorer
          <select className={inputClassName} value={topScorer} onChange={(event) => setTopScorer(event.target.value)}>
            {players.map((player) => <option key={player.id} value={player.id}>{player.name}</option>)}
          </select>
        </label>
      </div>
      <div className="mt-4 rounded-md bg-frost p-3 text-sm">
        <strong>{comparison.score}</strong> · {comparison.predictedWinner}. {comparison.modelHint}
      </div>
      <button
        className="primary-action mt-4 w-full disabled:cursor-not-allowed disabled:bg-ink/35"
        disabled={isSubmitting}
        type="button"
        onClick={submitPrediction}
      >
        <Send size={17} /> {isSubmitting ? "Sender tips..." : "Send tips til API"}
      </button>
      {result ? (
        <div className="mt-3 rounded-md border border-pine/20 bg-pine/10 p-3 text-sm text-ink">
          <strong>Lagret.</strong> API-et ga {result.points} poeng på denne prediksjonen.
        </div>
      ) : null}
      {error ? (
        <div className="mt-3 rounded-md border border-coral/25 bg-coral/10 p-3 text-sm text-coral">
          {error}
        </div>
      ) : null}
    </section>
  );
}
