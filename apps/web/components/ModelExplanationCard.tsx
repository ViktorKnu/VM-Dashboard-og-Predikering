import { BrainCircuit } from "lucide-react";
import { featureLabel } from "@/lib/labels";
import type { ModelPrediction } from "@/lib/types";
import { WinProbabilityBar } from "./WinProbabilityBar";

export function ModelExplanationCard({ prediction }: { prediction: ModelPrediction }) {
  const featuresUsed = prediction.explanation_json.features_used ?? [];

  return (
    <section className="surface p-4">
      <div className="mb-4 flex items-start gap-3">
        <span className="grid size-10 place-items-center rounded-md bg-fjord/10 text-fjord">
          <BrainCircuit size={20} />
        </span>
        <div>
          <p className="eyebrow">Modell</p>
          <h2 className="text-lg font-semibold">{prediction.model_name ?? prediction.model_version}</h2>
          <p className="text-xs text-ink/50">{prediction.model_version}</p>
        </div>
      </div>
      <WinProbabilityBar home={prediction.home_win_probability} draw={prediction.draw_probability} away={prediction.away_win_probability} />
      <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
        <div className="rounded-md bg-frost p-3"><span className="text-ink/60">xG hjem</span><strong className="block text-lg">{prediction.expected_home_goals}</strong></div>
        <div className="rounded-md bg-frost p-3"><span className="text-ink/60">Tips</span><strong className="block text-lg">{prediction.predicted_score}</strong></div>
        <div className="rounded-md bg-frost p-3"><span className="text-ink/60">xG borte</span><strong className="block text-lg">{prediction.expected_away_goals}</strong></div>
      </div>
      <p className="mt-3 text-sm leading-6 text-ink/70">{prediction.explanation_json.summary}</p>
      {prediction.explanation_json.training_status ? (
        <p className="mt-2 rounded-md bg-frost p-3 text-sm text-ink/65">
          Treningsstatus: <strong>{prediction.explanation_json.training_status}</strong>
        </p>
      ) : null}
      {featuresUsed.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {featuresUsed.slice(0, 10).map((feature) => (
            <span key={feature} className="chip bg-frost text-ink/65">{featureLabel(feature)}</span>
          ))}
          {featuresUsed.length > 10 ? (
            <span className="chip bg-frost text-ink/65">+{featuresUsed.length - 10} flere</span>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
