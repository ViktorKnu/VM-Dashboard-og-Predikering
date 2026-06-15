import { api } from "@/lib/api";
import { teamName } from "@/lib/labels";
import { PredictionForm } from "@/components/PredictionForm";

export default async function PredictionsPage() {
  const [matches, players, teams, predictions] = await Promise.all([
    api.matches(),
    api.players(),
    api.teams(),
    api.predictions()
  ]);

  const teamsById = new Map(teams.map((team) => [team.id, team]));
  const latestPredictions = predictions.slice(-5).reverse();

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Bruker vs modell</h1>
      <PredictionForm match={matches[0]} players={players} teams={teams} />
      <section className="rounded-md border border-ink/10 bg-white/88 p-4">
        <h2 className="mb-3 text-lg font-semibold">Poengsystem</h2>
        <div className="grid gap-2 text-sm sm:grid-cols-5">
          {[
            ["Vinner", 3],
            ["Målforskjell", 2],
            ["Eksakt resultat", 5],
            ["Første målscorer", 4],
            ["Turnerings-toppscorer", 10]
          ].map(([label, points]) => (
            <div key={String(label)} className="rounded-sm bg-frost p-3">
              <span>{label}</span>
              <strong className="block">{points} p</strong>
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-md border border-ink/10 bg-white/88 p-4">
        <h2 className="mb-3 text-lg font-semibold">Siste tips fra API</h2>
        {latestPredictions.length ? (
          <div className="space-y-2">
            {latestPredictions.map((prediction) => {
              const winner = prediction.predicted_winner_team_id
                ? teamsById.get(prediction.predicted_winner_team_id)
                : null;
              return (
                <div key={prediction.id} className="grid gap-2 rounded-sm bg-frost p-3 text-sm sm:grid-cols-[1fr_auto]">
                  <span>
                    {prediction.predicted_home_score}-{prediction.predicted_away_score} · {winner ? teamName(winner) : "Uavgjort"}
                  </span>
                  <strong>{prediction.points} poeng</strong>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-ink/60">Ingen tips er lagret ennå.</p>
        )}
      </section>
    </div>
  );
}
