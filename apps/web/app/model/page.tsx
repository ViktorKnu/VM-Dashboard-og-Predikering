import { api } from "@/lib/api";
import { featureLabel, metricLabel } from "@/lib/labels";

export default async function ModelPage() {
  const lab = await api.modelLab();
  const featureImportance = Array.isArray(lab.feature_importance) ? lab.feature_importance : [];
  const versions = Array.isArray(lab.version_history) ? lab.version_history : [];
  const backtesting = (lab.backtesting ?? {}) as Record<string, unknown>;
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">Modellverksted</h1>
      <section className="grid gap-4 lg:grid-cols-3">
        {["accuracy", "log_loss", "brier_score"].map((key) => (
          <div key={key} className="rounded-md border border-ink/10 bg-white/88 p-4">
            <span className="text-sm text-ink/60">{metricLabel(key)}</span>
            <strong className="block text-3xl">{String(backtesting[key] ?? "Kommer")}</strong>
          </div>
        ))}
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-md border border-ink/10 bg-white/88 p-4">
          <h2 className="mb-3 text-lg font-semibold">Variabelbetydning</h2>
          <div className="space-y-2">
            {featureImportance.map((item: any) => (
              <div key={item.feature} className="grid grid-cols-[180px_1fr_52px] items-center gap-2 text-sm">
                <span>{featureLabel(item.feature)}</span>
                <div className="h-2 rounded-sm bg-ink/10"><div className="h-2 rounded-sm bg-fjord" style={{ width: `${item.importance * 100 * 3}%` }} /></div>
                <strong>{item.importance}</strong>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-md border border-ink/10 bg-white/88 p-4">
          <h2 className="mb-3 text-lg font-semibold">Versjoner</h2>
          <div className="space-y-2">
            {versions.map((item: any) => <div key={item.version} className="rounded-sm bg-frost p-3"><strong>{item.version}</strong><p className="text-sm text-ink/65">{item.notes}</p></div>)}
          </div>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {["Kalibreringsgraf", "Forvekslingsmatrise", "SHAP-forklaring"].map((label) => <div key={label} className="grid min-h-[180px] place-items-center rounded-md border border-dashed border-ink/25 bg-white/70 text-sm font-semibold text-ink/55">{label}</div>)}
      </section>
    </div>
  );
}

