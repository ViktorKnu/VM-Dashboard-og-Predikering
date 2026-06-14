import { BrainCircuit } from "lucide-react";
import type { ModelPrediction } from "@/lib/types";
import { WinProbabilityBar } from "./WinProbabilityBar";

export function ModelExplanationCard({ prediction }: { prediction: ModelPrediction }) {
  return (
    <section className="rounded-md border border-ink/10 bg-white/88 p-4">
      <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold"><BrainCircuit size={18} /> Modell {prediction.model_version}</h2>
      <WinProbabilityBar home={prediction.home_win_probability} draw={prediction.draw_probability} away={prediction.away_win_probability} />
      <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
        <div className="rounded-sm bg-frost p-3"><span className="text-ink/60">xG hjem</span><strong className="block text-lg">{prediction.expected_home_goals}</strong></div>
        <div className="rounded-sm bg-frost p-3"><span className="text-ink/60">Tips</span><strong className="block text-lg">{prediction.predicted_score}</strong></div>
        <div className="rounded-sm bg-frost p-3"><span className="text-ink/60">xG borte</span><strong className="block text-lg">{prediction.expected_away_goals}</strong></div>
      </div>
      <p className="mt-3 text-sm text-ink/70">{prediction.explanation_json.summary}</p>
    </section>
  );
}

