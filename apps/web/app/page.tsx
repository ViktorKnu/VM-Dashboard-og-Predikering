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
    ["Direkte", liveMatch ? "1 kamp" : "Ingen", "SSE klar", Activity]
  ];

  return (
    <div className="space-y-5">
      <section className="grid gap-4 lg:grid-cols-[1fr_380px]">
        <div className="surface overflow-hidden">
          <div className="border-b border-ink/10 bg-ink px-5 py-4 text-white md:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/56">VM 2026 · Norge · Gruppe I</p>
                <h1 className="mt-2 text-3xl font-bold md:text-5xl">{APP_NAME}</h1>
              </div>
              <span className="rounded-md bg-gold px-3 py-2 text-sm font-bold text-ink">Gratis demo</span>
            </div>
          </div>

          <div className="grid gap-5 p-5 md:grid-cols-[1fr_280px] md:p-6">
            <div>
              <p className="max-w-2xl text-base leading-7 text-ink/70">
                Et norsk VM-dashboard for kampoversikt, prediksjoner, modellforklaringer og offisielle TV-lenker. Dataene er seedet i demoen, men flyten er bygget som en fullstack-app.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link className="primary-action" href="/matches">
                  Se kamper <ArrowRight size={17} />
                </Link>
                <Link className="secondary-action" href="/predictions">
                  Legg inn tips
                </Link>
              </div>
            </div>

            <div className="surface-muted p-4">
              <p className="eyebrow">Neste kamp</p>
              <div className="mt-3 flex items-center justify-between gap-2 text-sm text-ink/60">
                <span>{matchStageLabel(featuredMatch.stage)} · Gruppe {featuredMatch.group_name}</span>
                <span className="inline-flex items-center gap-1 rounded-sm bg-white px-2 py-1 font-semibold text-fjord">
                  <Radio size={14} /> {matchStatusLabel(featuredMatch.status)}
                </span>
              </div>
              <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <TeamBadge linked={false} team={featuredMatch.home_team} />
                <div className="rounded-md bg-ink px-3 py-2 text-center font-bold text-white">
                  {featuredMatch.home_score ?? "-"} : {featuredMatch.away_score ?? "-"}
                </div>
                <div className="justify-self-end text-right">
                  <TeamBadge linked={false} team={featuredMatch.away_team} />
                </div>
              </div>
              <div className="mt-5 rounded-md bg-white p-3 text-sm text-ink/68">
                <strong className="block text-ink">{formatOsloTime(featuredMatch.kickoff_at)}</strong>
                {featuredMatch.stadium}
              </div>
              <Link className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-fjord hover:text-pine" href={`/matches/${featuredMatch.id}`}>
                Åpne kampdetaljer <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {stats.map(([label, value, helper, Icon]) => (
            <div key={label} className="metric-tile">
              <div className="flex items-center justify-between gap-3">
                <span className="grid size-9 place-items-center rounded-md bg-frost text-fjord">
                  <Icon size={19} />
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.12em] text-ink/40">{helper}</span>
              </div>
              <div className="mt-3 text-sm font-semibold text-ink/56">{label}</div>
              <strong className="text-3xl text-ink">{value}</strong>
            </div>
          ))}
        </div>
      </section>

      <DataFlowStatus status={dataStatus} />

      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Terminliste</p>
            <h2 className="mt-1 text-2xl font-bold">Neste kamper</h2>
            <p className="text-sm text-ink/60">Alle tider vises i norsk tid. Offisielle norske sendelenker vises der de finnes.</p>
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
