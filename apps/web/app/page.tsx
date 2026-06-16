import { Activity, ArrowRight, BarChart3, CalendarDays, Radio, ShieldCheck, Trophy, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { api, formatOsloTime } from "@/lib/api";
import { APP_NAME, matchStageLabel, matchStatusLabel, teamName } from "@/lib/labels";
import { DataFlowStatus } from "@/components/DataFlowStatus";
import { MatchCard } from "@/components/MatchCard";
import { TeamBadge } from "@/components/TeamBadge";
import { LiveTopScorerTable, TeamLeaderboard, TopScorerPredictionTable } from "@/components/Leaderboards";

export default async function HomePage() {
  const [matches, teams, tournament, dataStatus, topScorers, topScorerPredictions] = await Promise.all([
    api.matches(),
    api.teams(),
    api.tournament(),
    api.dataStatus(),
    api.topScorers(),
    api.topScorerPredictions()
  ]);

  const liveMatch = matches.find((match) => match.status === "live") ?? null;
  const featuredMatch = liveMatch ?? matches[0];
  const upcomingMatches = matches.filter((match) => match.id !== featuredMatch.id).slice(0, 4);
  const tournamentTeams = Array.isArray(tournament.teams) ? tournament.teams.slice(0, 5) : [];
  const officialBroadcasts = matches.reduce((count, match) => count + (match.broadcasts?.length ?? 0), 0);

  const stats: Array<[string, string | number, string, LucideIcon]> = [
    ["Kamper", matches.length, "Terminliste", CalendarDays],
    ["Lag", teams.length, "Modellfelt", BarChart3],
    ["TV-lenker", officialBroadcasts, "Offisielle", ShieldCheck],
    ["Direkte", liveMatch ? "1 kamp" : "Ingen", "SSE klar", Activity]
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="panel overflow-hidden">
          <div className="grid min-w-0 gap-6 p-5 md:p-6 xl:grid-cols-[minmax(0,1fr)_300px]">
            <div className="min-w-0">
              <p className="eyebrow">Norsk VM-dashboard</p>
              <h1 className="mt-2 max-w-3xl text-4xl font-bold tracking-normal md:text-5xl">{APP_NAME}</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-ink/65">
                Kampoversikt, prediksjoner, modellforklaringer og offisielle norske sendelenker i ett deployklart portfolio-produkt.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link className="primary-action" href="/matches">
                  Se kamper <ArrowRight size={16} />
                </Link>
                <Link className="secondary-action" href="/model">
                  Åpne modellverksted
                </Link>
              </div>
            </div>

            <div className="min-w-0 rounded-lg bg-ink p-4 text-white">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/50">Neste kamp</p>
                  <h2 className="mt-1 text-xl font-bold">{matchStageLabel(featuredMatch.stage)}</h2>
                </div>
                <span className="chip bg-white/10 text-white">
                  <Radio size={14} /> {matchStatusLabel(featuredMatch.status)}
                </span>
              </div>
              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between gap-3 rounded-md bg-white/10 px-3 py-2">
                  <TeamBadge inverted linked={false} team={featuredMatch.home_team} />
                  <strong>{featuredMatch.home_score ?? "-"}</strong>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-md bg-white/10 px-3 py-2">
                  <TeamBadge inverted linked={false} team={featuredMatch.away_team} />
                  <strong>{featuredMatch.away_score ?? "-"}</strong>
                </div>
              </div>
              <div className="mt-5 rounded-md bg-white/10 p-3 text-sm text-white/70">
                <strong className="block text-white">{formatOsloTime(featuredMatch.kickoff_at)}</strong>
                {featuredMatch.stadium}, {featuredMatch.city}
              </div>
              <Link className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-white hover:text-gold" href={`/matches/${featuredMatch.id}`}>
                Kampdetaljer <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          <div className="grid border-t border-ink/10 bg-frost/70 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map(([label, value, helper, Icon]) => (
              <div key={label} className="border-b border-ink/10 p-4 sm:border-r xl:border-b-0">
                <div className="flex items-center justify-between gap-3">
                  <span className="grid size-9 place-items-center rounded-md bg-white text-fjord shadow-sm">
                    <Icon size={18} />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-[0.12em] text-ink/40">{helper}</span>
                </div>
                <div className="mt-3 text-sm font-semibold text-ink/55">{label}</div>
                <strong className="text-3xl text-ink">{value}</strong>
              </div>
            ))}
          </div>
        </div>

        <DataFlowStatus status={dataStatus} />
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
        <div className="space-y-3">
          <div className="section-head">
            <div>
              <p className="eyebrow">Terminliste</p>
              <h2 className="mt-1 text-2xl font-bold">Kampoversikt</h2>
              <p className="muted-copy">Alle tider vises i norsk tid. Resultater vises først når ekte data finnes.</p>
            </div>
            <Link className="secondary-action" href="/matches">
              Alle kamper <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid gap-3 lg:grid-cols-2 2xl:grid-cols-4">
            {upcomingMatches.map((match) => <MatchCard key={match.id} match={match} />)}
          </div>
        </div>

        <div className="panel p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Simulering</p>
              <h2 className="text-lg font-semibold">VM-vinner</h2>
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

      <section className="grid gap-5 lg:grid-cols-3">
        <LiveTopScorerTable scorers={topScorers} />
        <TopScorerPredictionTable predictions={topScorerPredictions} />
        <TeamLeaderboard teams={teams} />
      </section>
    </div>
  );
}
