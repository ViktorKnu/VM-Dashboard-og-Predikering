import { Activity, ArrowRight, BarChart3, CalendarDays, Radio, ShieldCheck, Trophy, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { api, formatOsloTime } from "@/lib/api";
import { APP_NAME, matchStageLabel, matchStatusLabel, teamName } from "@/lib/labels";
import { DataFlowStatus } from "@/components/DataFlowStatus";
import { MatchCard } from "@/components/MatchCard";
import { TeamBadge } from "@/components/TeamBadge";
import { TeamLeaderboard, TopScorerTable } from "@/components/Leaderboards";

export default async function HomePage() {
  const [matches, teams, players, tournament, dataStatus] = await Promise.all([
    api.matches(),
    api.teams(),
    api.players(),
    api.tournament(),
    api.dataStatus()
  ]);

  const liveMatch = matches.find((match) => match.status === "live") ?? null;
  const featuredMatch = liveMatch ?? matches[0];
  const upcomingMatches = matches.filter((match) => match.id !== featuredMatch.id).slice(0, 3);
  const tournamentTeams = Array.isArray(tournament.teams) ? tournament.teams.slice(0, 5) : [];
  const officialBroadcasts = matches.reduce((count, match) => count + (match.broadcasts?.length ?? 0), 0);

  const stats: Array<[string, string | number, string, LucideIcon]> = [
    ["Kamper", matches.length, "Gruppe I", CalendarDays],
    ["Lag", teams.length, "Demo-felt", BarChart3],
    ["Sendinger", officialBroadcasts, "Offisielle lenker", ShieldCheck],
    ["Direkte", liveMatch ? "1 kamp" : "Ingen", "Liveklar", Activity]
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="relative min-h-[430px] overflow-hidden rounded-lg bg-ink text-white shadow-[0_24px_80px_rgba(23,33,31,0.18)]">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center opacity-40" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,30,30,0.96),rgba(13,30,30,0.78)_48%,rgba(15,93,79,0.48))]" />
          <div className="relative flex min-h-[430px] flex-col justify-between p-5 md:p-8">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-white/78">
              <span className="rounded-sm bg-white/10 px-2.5 py-1">Norsk VM-dashboard</span>
              <span className="rounded-sm bg-white/10 px-2.5 py-1">Oslo-tid</span>
              <span className="rounded-sm bg-gold px-2.5 py-1 text-ink">Gratis demo-data</span>
            </div>

            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-gold">Portfolio-prosjekt for VM 2026</p>
              <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">{APP_NAME}</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/78">
                Følg gruppe I, sammenlign tipsene dine mot modellen og se hvordan kampdata flyter fra API til frontend.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link className="primary-action" href="/matches">
                  Se kampene <ArrowRight size={18} />
                </Link>
                <Link className="secondary-action" href="/predictions">
                  Legg inn tips
                </Link>
              </div>
            </div>
          </div>
        </div>

        <Link className="focus-ring group flex min-h-[430px] flex-col justify-between overflow-hidden rounded-lg border border-ink/10 bg-ink p-5 text-white shadow-[0_24px_80px_rgba(23,33,31,0.16)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_90px_rgba(23,33,31,0.2)] md:p-6" href={`/matches/${featuredMatch.id}`}>
          <div>
            <div className="flex items-center justify-between gap-3 text-sm text-white/70">
              <span>{matchStageLabel(featuredMatch.stage)}{featuredMatch.group_name ? ` · Gruppe ${featuredMatch.group_name}` : ""}</span>
              <span className="inline-flex items-center gap-1 rounded-sm bg-white/10 px-2 py-1">
                <Radio size={15} /> {matchStatusLabel(featuredMatch.status)}
              </span>
            </div>
            <h2 className="mt-5 text-2xl font-bold">Neste kamp</h2>
            <p className="mt-1 text-sm text-white/58">Tid vises i Europe/Oslo.</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <TeamBadge inverted linked={false} team={featuredMatch.home_team} />
              <div className="rounded-md bg-white px-4 py-3 text-center text-2xl font-bold text-ink shadow-sm">
                {featuredMatch.home_score ?? "-"} : {featuredMatch.away_score ?? "-"}
              </div>
              <div className="justify-self-end">
                <TeamBadge inverted linked={false} team={featuredMatch.away_team} />
              </div>
            </div>
            <div className="grid gap-3 text-sm text-white/75">
              <div className="rounded-md bg-white/10 p-3">
                <span className="block text-white/50">Avspark</span>
                <strong className="text-white">{formatOsloTime(featuredMatch.kickoff_at)}</strong>
              </div>
              <div className="rounded-md bg-white/10 p-3">
                <span className="block text-white/50">Arena</span>
                <strong className="text-white">{featuredMatch.stadium}</strong>
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 text-sm font-semibold text-white">
            Åpne kampdetaljer <ArrowRight className="transition group-hover:translate-x-1" size={17} />
          </div>
        </Link>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value, helper, Icon]) => (
          <div key={label} className="metric-tile">
            <div className="flex items-center justify-between gap-3">
              <span className="grid size-10 place-items-center rounded-md bg-fjord/10 text-fjord">
                <Icon size={20} />
              </span>
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-ink/42">{helper}</span>
            </div>
            <div className="mt-4 text-sm font-medium text-ink/58">{label}</div>
            <strong className="text-3xl text-ink">{value}</strong>
          </div>
        ))}
      </section>

      <DataFlowStatus status={dataStatus} />

      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Terminliste</p>
            <h2 className="mt-1 text-2xl font-bold">Neste kamper</h2>
            <p className="text-sm text-ink/60">Alle tider vises i norsk tid, med offisielle norske sendelenker der de finnes.</p>
          </div>
          <Link className="secondary-action py-2" href="/matches">
            Alle kamper <ArrowRight size={17} />
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {upcomingMatches.map((match) => <MatchCard key={match.id} match={match} />)}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr_1.1fr]">
        <TopScorerTable players={players} />
        <TeamLeaderboard teams={teams} />
        <div className="surface p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Simulering</p>
              <h2 className="text-lg font-semibold">Turneringsmodell</h2>
            </div>
            <Trophy className="text-gold" size={22} />
          </div>
          <div className="space-y-3">
            {tournamentTeams.map((item: any) => {
              const winnerProbability = Math.round(item.winner * 100);
              return (
                <div key={item.team_id} className="space-y-1">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium">{teamName(item.team)}</span>
                    <strong>{winnerProbability}%</strong>
                  </div>
                  <div className="h-2 rounded-sm bg-ink/10">
                    <div className="h-2 rounded-sm bg-pine" style={{ width: `${Math.max(winnerProbability, 2)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-sm text-ink/60">Basert på seedet modellfelt og Monte Carlo-simuleringer.</p>
        </div>
      </section>
    </div>
  );
}
