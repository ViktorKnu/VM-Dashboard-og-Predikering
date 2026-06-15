import { probabilityEventLabel } from "@/lib/labels";
import type { LiveSnapshot, ProbabilityEvent } from "@/lib/types";

export function WinProbabilityTimeline({ timeline, changes }: { timeline: LiveSnapshot[]; changes: ProbabilityEvent[] }) {
  return (
    <section className="rounded-md border border-ink/10 bg-white/90 p-4">
      <h2 className="mb-3 text-lg font-semibold">Hva endret seg?</h2>
      <div className="mb-4 grid gap-2">
        {changes.length ? changes.map((change) => (
          <div key={change.id} className="rounded-sm border border-ink/10 bg-frost p-3">
            <div className="text-xs uppercase tracking-wide text-ink/55">
              {change.minute} min - {probabilityEventLabel(change.event_type)} - {change.score_state}
            </div>
            <p className="mt-1 text-sm">{change.explanation}</p>
          </div>
        )) : <p className="rounded-sm bg-frost p-3 text-sm text-ink/60">Ingen liveendringer ennå. Forklaringer vises når kampen er i gang og sannsynligheten flytter seg.</p>}
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
