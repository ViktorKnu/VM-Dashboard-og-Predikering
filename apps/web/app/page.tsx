import { Activity, BarChart3, CalendarDays, type LucideIcon } from "lucide-react";
import { api } from "@/lib/api";
import { APP_NAME, teamName } from "@/lib/labels";
import { MatchCard } from "@/components/MatchCard";
import { TeamLeaderboard, TopScorerTable } from "@/components/Leaderboards";

export default async function HomePage() {
  const [matches, teams, players, tournament] = await Promise.all([api.matches(), api.teams(), api.players(), api.tournament()]);
  const tournamentTeams = Array.isArray(tournament.teams) ? tournament.teams.slice(0, 4) : [];
  const stats: Array<[string, string | number, LucideIcon]> = [
    ["Kamper", matches.length, CalendarDays],
    ["Lag", teams.length, BarChart3],
    ["Direkte", "SSE klar", Activity]
  ];
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-[1.5fr_1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-coral">Norsk VM-verktøy</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-bold text-ink md:text-5xl">{APP_NAME}</h1>
          <p className="mt-3 max-w-2xl text-lg text-ink/72">Kamper, prediksjoner, direkte sannsynlighet, offisielle norske sendelenker og modellinnsikt samlet i ett norsk VM-verktøy.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1">
          {stats.map(([label, value, Icon]) => (
            <div key={String(label)} className="rounded-md border border-ink/10 bg-white/88 p-4">
              <Icon className="text-pine" size={20} />
              <div className="mt-2 text-sm text-ink/60">{String(label)}</div>
              <strong className="text-2xl">{String(value)}</strong>
            </div>
          ))}
        </div>
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        {matches.slice(0, 4).map((match) => <MatchCard key={match.id} match={match} />)}
      </section>
      <section className="grid gap-4 lg:grid-cols-3">
        <TopScorerTable players={players} />
        <TeamLeaderboard teams={teams} />
        <div className="rounded-md border border-ink/10 bg-white/88 p-4">
          <h2 className="mb-3 text-lg font-semibold">Turneringssimulator</h2>
          <div className="space-y-2">
            {tournamentTeams.map((item: any) => (
              <div key={item.team_id} className="grid grid-cols-[1fr_70px] rounded-sm bg-frost p-2 text-sm">
                <span>{teamName(item.team)}</span>
                <strong>{Math.round(item.winner * 100)}%</strong>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
