import { Activity, BarChart3, CalendarDays, Radio, ShieldCheck, Trophy, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { api, formatOsloTime } from "@/lib/api";
import { APP_NAME, matchStageLabel, matchStatusLabel, teamName } from "@/lib/labels";
import { MatchCard } from "@/components/MatchCard";
import { TeamBadge } from "@/components/TeamBadge";
import { TeamLeaderboard, TopScorerTable } from "@/components/Leaderboards";

export default async function HomePage() {
  const [matches, teams, players, tournament] = await Promise.all([
    api.matches(),
    api.teams(),
    api.players(),
    api.tournament()
  ]);

  const liveMatch = matches.find((match) => match.status === "live") ?? matches[0];
  const upcomingMatches = matches.filter((match) => match.id !== liveMatch.id).slice(0, 3);
  const tournamentTeams = Array.isArray(tournament.teams) ? tournament.teams.slice(0, 5) : [];
  const officialBroadcasts = matches.reduce((count, match) => count + (match.broadcasts?.length ?? 0), 0);

  const stats: Array<[string, string | number, string, LucideIcon]> = [
    ["Kamper", matches.length, "Seedet terminliste", CalendarDays],
    ["Lag", teams.length, "VM-felt i demoen", BarChart3],
    ["Sendinger", officialBroadcasts, "Kun offisielle lenker", ShieldCheck],
    ["Direkte", liveMatch ? "1 kamp" : "Ingen", "SSE-klargjort", Activity]
  ];

  return (
    <div className="space-y-7">
      <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="min-h-[360px] rounded-md border border-ink/10 bg-white/90 p-5 shadow-sm md:p-7">
          <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-pine">
            <span className="rounded-sm bg-pine/10 px-2 py-1">Norsk VM-verktøy</span>
            <span className="rounded-sm bg-coral/10 px-2 py-1 text-coral">Oslo-tid</span>
            <span className="rounded-sm bg-gold/15 px-2 py-1 text-ink/75">Offisielle sendinger</span>
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold text-ink md:text-6xl">{APP_NAME}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-ink/72">
            Følg kamper, sammenlign egne tips mot modellen og se hvorfor sannsynligheten endrer seg underveis.
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <Link className="focus-ring rounded-md bg-pine px-4 py-3 text-center font-semibold text-white shadow-sm transition hover:bg-pine/90" href="/matches">
              Se kampene
            </Link>
            <Link className="focus-ring rounded-md border border-ink/15 bg-white px-4 py-3 text-center font-semibold text-ink transition hover:bg-frost" href="/predictions">
              Legg inn tips
            </Link>
          </div>
        </div>

        <Link className="focus-ring rounded-md border border-ink/10 bg-ink p-5 text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:p-6" href={`/matches/${liveMatch.id}`}>
          <div className="flex items-center justify-between gap-3 text-sm text-white/70">
            <span>{matchStageLabel(liveMatch.stage)}{liveMatch.group_name ? ` - Gruppe ${liveMatch.group_name}` : ""}</span>
            <span className="inline-flex items-center gap-1 rounded-sm bg-white/10 px-2 py-1">
              <Radio size={15} /> {matchStatusLabel(liveMatch.status)}
            </span>
          </div>
          <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <TeamBadge inverted linked={false} team={liveMatch.home_team} />
            <div className="rounded-sm bg-white px-4 py-3 text-center text-2xl font-bold text-ink">
              {liveMatch.home_score ?? "-"} : {liveMatch.away_score ?? "-"}
            </div>
            <div className="justify-self-end">
              <TeamBadge inverted linked={false} team={liveMatch.away_team} />
            </div>
          </div>
          <div className="mt-8 grid gap-3 text-sm text-white/75 sm:grid-cols-2">
            <div className="rounded-sm bg-white/10 p-3">
              <span className="block text-white/55">Avspark</span>
              <strong className="text-white">{formatOsloTime(liveMatch.kickoff_at)}</strong>
            </div>
            <div className="rounded-sm bg-white/10 p-3">
              <span className="block text-white/55">Sted</span>
              <strong className="text-white">{liveMatch.city}</strong>
            </div>
          </div>
          <div className="mt-5 text-sm font-semibold text-white">Åpne kampdetaljer</div>
        </Link>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value, helper, Icon]) => (
          <div key={label} className="rounded-md border border-ink/10 bg-white/88 p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <Icon className="text-pine" size={20} />
              <span className="text-xs font-semibold uppercase tracking-wide text-ink/45">{helper}</span>
            </div>
            <div className="mt-3 text-sm text-ink/60">{label}</div>
            <strong className="text-2xl text-ink">{value}</strong>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">Neste kamper</h2>
            <p className="text-sm text-ink/60">Alle tider vises i norsk tid.</p>
          </div>
          <Link className="focus-ring rounded-sm px-2 py-1 text-sm font-semibold text-fjord hover:text-pine" href="/matches">
            Alle kamper
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {upcomingMatches.map((match) => <MatchCard key={match.id} match={match} />)}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr_1.1fr]">
        <TopScorerTable players={players} />
        <TeamLeaderboard teams={teams} />
        <div className="rounded-md border border-ink/10 bg-white/88 p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Turneringssimulator</h2>
            <Trophy className="text-gold" size={20} />
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
