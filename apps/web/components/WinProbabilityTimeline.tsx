import { Activity } from "lucide-react";
import { probabilityEventLabel } from "@/lib/labels";
import type { LiveSnapshot, ProbabilityEvent } from "@/lib/types";

export function WinProbabilityTimeline({ timeline, changes }: { timeline: LiveSnapshot[]; changes: ProbabilityEvent[] }) {
  return (
    <section className="surface p-4">
      <div className="mb-4 flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-md bg-pine/10 text-pine">
          <Activity size={20} />
        </span>
        <div>
          <p className="eyebrow">Liveforklaring</p>
          <h2 className="text-lg font-semibold">Hva endret seg?</h2>
        </div>
      </div>
      <div className="mb-4 grid gap-2">
        {changes.length ? changes.map((change) => (
          <div key={change.id} className="rounded-md border border-ink/10 bg-frost p-3">
            <div className="text-xs font-bold uppercase tracking-[0.12em] text-ink/50">
              {change.minute} min - {probabilityEventLabel(change.event_type)} - {change.score_state}
            </div>
            <p className="mt-1 text-sm leading-6">{change.explanation}</p>
          </div>
        )) : <p className="rounded-md bg-frost p-3 text-sm text-ink/60">Ingen liveendringer ennå. Forklaringer vises når kampen er i gang og sannsynligheten flytter seg.</p>}
      </div>
      <div className="space-y-2">
        {timeline.length ? timeline.map((point) => (
          <div key={point.id} className="grid grid-cols-[44px_1fr_48px] items-center gap-3 text-sm">
            <span>{point.minute}m</span>
            <div className="h-2 rounded-sm bg-ink/10">
              <div className="h-2 rounded-sm bg-pine" style={{ width: `${point.home_win_probability * 100}%` }} />
            </div>
            <strong>{Math.round(point.home_win_probability * 100)}%</strong>
          </div>
        )) : null}
      </div>
    </section>
  );
}
