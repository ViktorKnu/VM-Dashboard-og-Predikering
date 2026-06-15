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
    ["Livepunkter", status.counts.live_snapshots],
    ["Tips", status.counts.user_predictions]
  ];

  return (
    <section className="surface p-4 md:p-5">
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-md bg-fjord/10 text-fjord">
            <DatabaseZap size={22} />
          </span>
          <div>
            <p className="eyebrow">Datastatus</p>
            <h2 className="mt-1 text-xl font-bold">Dataflyt</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-ink/62">
              Frontend henter primært fra API-et. Når API-et ikke svarer, brukes seed-data slik at demoen fortsatt virker.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              <span className={`rounded-sm px-3 py-1 font-semibold ${isFallback ? "bg-gold/20 text-ink" : "bg-pine/10 text-pine"}`}>
                {label}
              </span>
              <span className="rounded-sm bg-frost px-3 py-1 text-ink/65">Modell {status.model_version}</span>
              <span className="rounded-sm bg-frost px-3 py-1 text-ink/65">{status.timezone}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          {counts.map(([labelText, value]) => (
            <div key={labelText} className="rounded-md bg-frost p-3 text-sm">
              <span className="text-ink/58">{labelText}</span>
              <strong className="block text-2xl text-ink">{value}</strong>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 grid gap-2 text-sm text-ink/65 md:grid-cols-3">
        {status.data_flow.slice(0, 3).map((item) => (
          <div key={item} className="flex gap-2 rounded-md bg-white/70 p-3">
            <CheckCircle2 className="mt-0.5 shrink-0 text-pine" size={16} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
