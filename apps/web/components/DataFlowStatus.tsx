import { CheckCircle2, DatabaseZap } from "lucide-react";
import { DataProvenance } from "@/components/DataProvenance";
import type { DataStatus } from "@/lib/types";

export function DataFlowStatus({ status }: { status: DataStatus }) {
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
          <span className="grid size-11 shrink-0 place-items-center rounded-md bg-mint/10 text-mint">
            <DatabaseZap size={22} />
          </span>
          <div>
            <p className="eyebrow">Datastatus</p>
            <h2 className="mt-1 text-xl font-bold">Dataflyt</h2>
            <p className="mt-2 text-sm leading-6 text-ink/60">
              API først, med et kilde-merket snapshot når en sanntidsleverandør ikke er koblet på.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              <span className="chip bg-white/10 text-white/70">Modell {status.model_version}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 border-t border-white/10 pt-4">
          <DataProvenance status={status} />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {counts.map(([labelText, value]) => (
            <div key={labelText} className="data-row">
              <span className="text-ink/60">{labelText}</span>
              <strong className="block text-xl text-white">{value}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-2 border-t border-white/10 bg-white/5 p-4 text-sm text-white/65">
        {status.data_flow.slice(0, 3).map((item) => (
          <div key={item} className="flex gap-2 rounded-md bg-white/10 p-3">
            <CheckCircle2 className="mt-0.5 shrink-0 text-mint" size={16} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
