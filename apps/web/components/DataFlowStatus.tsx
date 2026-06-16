import { CheckCircle2, DatabaseZap } from "lucide-react";
import type { DataStatus } from "@/lib/types";

export function DataFlowStatus({ status }: { status: DataStatus }) {
  const isFallback = status.mode === "seed-fallback";
  const label = isFallback ? "Seed fallback" : status.mode === "seeded" ? "Seedet API" : "Ekstern datakilde";
  const counts = [
    ["Lag", status.counts.teams],
    ["Spillere", status.counts.players],
    ["Kamper", status.counts.matches],
    ["Sendinger", status.counts.broadcasts],
    ["Live", status.counts.live_snapshots],
    ["Tips", status.counts.user_predictions]
  ];

  return (
    <section className="panel h-full overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-md bg-fjord/10 text-fjord">
            <DatabaseZap size={22} />
          </span>
          <div>
            <p className="eyebrow">Datastatus</p>
            <h2 className="mt-1 text-xl font-bold">Dataflyt</h2>
            <p className="mt-2 text-sm leading-6 text-ink/60">
              API først, seed fallback når eksterne datakilder ikke er koblet på.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              <span className={`chip ${isFallback ? "bg-gold/20 text-ink" : "bg-pine/10 text-pine"}`}>{label}</span>
              <span className="chip bg-frost text-ink/65">Modell {status.model_version}</span>
              <span className="chip bg-frost text-ink/65">{status.timezone}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {counts.map(([labelText, value]) => (
            <div key={labelText} className="data-row">
              <span className="text-ink/60">{labelText}</span>
              <strong className="block text-xl text-ink">{value}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-2 border-t border-ink/10 bg-frost/65 p-4 text-sm text-ink/65">
        {status.data_flow.slice(0, 3).map((item) => (
          <div key={item} className="flex gap-2 rounded-md bg-white p-3">
            <CheckCircle2 className="mt-0.5 shrink-0 text-pine" size={16} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
