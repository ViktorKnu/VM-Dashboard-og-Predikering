import { api } from "@/lib/api";
import { PredictionForm } from "@/components/PredictionForm";

export default async function PredictionsPage() {
  const [matches, players, teams] = await Promise.all([api.matches(), api.players(), api.teams()]);
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
          ].map(([label, points]) => <div key={String(label)} className="rounded-sm bg-frost p-3"><span>{label}</span><strong className="block">{points} p</strong></div>)}
        </div>
      </section>
    </div>
  );
}

