import { api } from "@/lib/api";

export default async function HistoricalInsightsPage() {
  const insights = await api.historical();
  const commonScorelines = Array.isArray(insights.common_scorelines) ? insights.common_scorelines : [];
  const goalTiming = Array.isArray(insights.goal_timing_patterns) ? insights.goal_timing_patterns : [];
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">Historiske innsikter</h1>
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-md border border-ink/10 bg-white/90 p-4">Scorer først <strong className="block text-3xl">{Math.round(Number(insights.winning_after_scoring_first ?? 0) * 100)}%</strong></div>
        <div className="rounded-md border border-ink/10 bg-white/90 p-4">Leder til pause <strong className="block text-3xl">{Math.round(Number(insights.winning_when_leading_at_halftime ?? 0) * 100)}%</strong></div>
        <div className="rounded-md border border-ink/10 bg-white/90 p-4">Underdog-seier <strong className="block text-3xl">{Math.round(Number(insights.underdog_win_frequency ?? 0) * 100)}%</strong></div>
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-md border border-ink/10 bg-white/90 p-4">
          <h2 className="mb-3 text-lg font-semibold">Måltidspunkt</h2>
          {goalTiming.map((item: any) => <div key={item.window} className="grid grid-cols-[80px_1fr_52px] items-center gap-2 py-2 text-sm"><span>{item.window}</span><div className="h-2 rounded-sm bg-ink/10"><div className="h-2 rounded-sm bg-pine" style={{ width: `${item.share * 100 * 3}%` }} /></div><strong>{Math.round(item.share * 100)}%</strong></div>)}
        </div>
        <div className="rounded-md border border-ink/10 bg-white/90 p-4">
          <h2 className="mb-3 text-lg font-semibold">Vanlige resultater</h2>
          {commonScorelines.map((item: any) => <div key={item.scoreline} className="flex justify-between border-b border-ink/10 py-2 text-sm"><span>{item.scoreline}</span><strong>{Math.round(item.share * 100)}%</strong></div>)}
        </div>
      </section>
    </div>
  );
}
