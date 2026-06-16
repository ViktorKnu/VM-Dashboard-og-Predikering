import { BarChart3, BrainCircuit, History } from "lucide-react";
import { api } from "@/lib/api";
import { featureLabel, metricLabel } from "@/lib/labels";

export default async function ModelPage() {
  const lab = await api.modelLab();
  const featureImportance = Array.isArray(lab.feature_importance) ? lab.feature_importance : [];
  const versions = Array.isArray(lab.version_history) ? lab.version_history : [];
  const backtesting = (lab.backtesting ?? {}) as Record<string, unknown>;
  return (
    <div className="space-y-5">
      <section className="surface p-5 md:p-6">
        <div className="flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-md bg-fjord/10 text-fjord">
            <BrainCircuit size={22} />
          </span>
          <div>
            <p className="eyebrow">Modellinnsikt</p>
            <h1 className="mt-1 text-3xl font-bold">Modellverksted</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/62">
              Modellversjoner, forklarbarhet og backtesting samlet på ett sted. Tallene er seedet for portfolio-demoen.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {["accuracy", "log_loss", "brier_score"].map((key) => (
          <div key={key} className="metric-tile">
            <span className="text-sm text-ink/60">{metricLabel(key)}</span>
            <strong className="block text-3xl">{String(backtesting[key] ?? "Kommer")}</strong>
          </div>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="surface p-4">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-md bg-fjord/10 text-fjord">
              <BarChart3 size={20} />
            </span>
            <div>
              <p className="eyebrow">Forklaring</p>
              <h2 className="text-lg font-semibold">Variabelbetydning</h2>
            </div>
          </div>
          <div className="space-y-3">
            {featureImportance.map((item: any) => (
              <div key={item.feature} className="grid grid-cols-[150px_minmax(0,1fr)_52px] items-center gap-3 text-sm">
                <span className="truncate">{featureLabel(item.feature)}</span>
                <div className="h-2 rounded-sm bg-ink/10"><div className="h-2 rounded-sm bg-fjord" style={{ width: `${Math.min(item.importance * 100 * 3, 100)}%` }} /></div>
                <strong className="text-right">{item.importance}</strong>
              </div>
            ))}
          </div>
        </div>
        <div className="surface p-4">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-md bg-pine/10 text-pine">
              <History size={20} />
            </span>
            <div>
              <p className="eyebrow">Historikk</p>
              <h2 className="text-lg font-semibold">Versjoner</h2>
            </div>
          </div>
          <div className="space-y-2">
            {versions.map((item: any) => <div key={item.version} className="rounded-md bg-frost p-3"><strong>{item.version}</strong><p className="text-sm text-ink/65">{item.notes}</p></div>)}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {["Kalibreringsgraf", "Forvekslingsmatrise", "SHAP-forklaring"].map((label) => <div key={label} className="grid min-h-[180px] place-items-center rounded-lg border border-dashed border-ink/25 bg-white text-sm font-semibold text-ink/55">{label}</div>)}
      </section>
    </div>
  );
}
