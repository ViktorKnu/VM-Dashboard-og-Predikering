import { DatabaseZap } from "lucide-react";
import type { DataStatus } from "@/lib/types";

export function DataFlowStatus({ status }: { status: DataStatus }) {
  const isFallback = status.mode === "seed-fallback";
  const label = isFallback ? "Seed fallback" : status.mode === "seeded" ? "Seedet API" : "Ekstern datakilde";

  return (
    <section className="rounded-md border border-ink/10 bg-white/88 p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-sm bg-fjord/10 text-fjord">
            <DatabaseZap size={20} />
          </span>
          <div>
            <h2 className="text-lg font-semibold">Dataflyt</h2>
            <p className="text-sm text-ink/60">API, seed-data og brukerprediksjoner er koblet sammen.</p>
          </div>
        </div>
        <span className={`rounded-sm px-3 py-1 text-sm font-semibold ${isFallback ? "bg-gold/20 text-ink" : "bg-pine/10 text-pine"}`}>
          {label}
        </span>
      </div>
      <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-sm bg-frost p-3">Lag <strong className="block">{status.counts.teams}</strong></div>
        <div className="rounded-sm bg-frost p-3">Spillere <strong className="block">{status.counts.players}</strong></div>
        <div className="rounded-sm bg-frost p-3">Kamper <strong className="block">{status.counts.matches}</strong></div>
        <div className="rounded-sm bg-frost p-3">Sendinger <strong className="block">{status.counts.broadcasts}</strong></div>
        <div className="rounded-sm bg-frost p-3">Livepunkter <strong className="block">{status.counts.live_snapshots}</strong></div>
        <div className="rounded-sm bg-frost p-3">Tips <strong className="block">{status.counts.user_predictions}</strong></div>
      </div>
      <p className="mt-3 text-sm text-ink/60">
        Kilde: {status.source} · Modell: {status.model_version} · Tidssone: {status.timezone}
      </p>
    </section>
  );
}
