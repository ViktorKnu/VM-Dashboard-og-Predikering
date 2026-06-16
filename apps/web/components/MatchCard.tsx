import { CalendarClock, Radio, Trophy } from "lucide-react";
import Link from "next/link";
import { formatOsloTime } from "@/lib/api";
import { matchStageLabel, matchStatusLabel } from "@/lib/labels";
import type { Match } from "@/lib/types";
import { TeamBadge } from "./TeamBadge";

export function MatchCard({ match }: { match: Match }) {
  const isLive = match.status === "live";
  const statusClassName = isLive ? "bg-coral/10 text-coral" : "bg-fjord/10 text-fjord";

  return (
    <Link className="focus-ring group block h-full rounded-lg border border-ink/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-fjord/35 hover:shadow-[0_18px_48px_rgba(23,33,31,0.11)]" href={`/matches/${match.id}`}>
      <div className="mb-5 flex items-center justify-between gap-3 text-sm text-ink/60">
        <span className="font-semibold">
          {matchStageLabel(match.stage)}
          {match.group_name ? ` - Gruppe ${match.group_name}` : ""}
        </span>
        <span className={`chip ${statusClassName}`}>
          {isLive ? <Radio size={14} /> : <Trophy size={14} />} {matchStatusLabel(match.status)}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3 rounded-md bg-frost px-3 py-2">
          <TeamBadge linked={false} team={match.home_team} />
          <strong className="text-lg">{match.home_score ?? "-"}</strong>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-md bg-frost px-3 py-2">
          <TeamBadge linked={false} team={match.away_team} />
          <strong className="text-lg">{match.away_score ?? "-"}</strong>
        </div>
      </div>

      <div className="mt-5 flex items-start gap-2 rounded-md bg-frost p-3 text-sm text-ink/70">
        <CalendarClock className="mt-0.5 shrink-0 text-fjord" size={17} />
        <span>
          <strong className="block text-ink">{formatOsloTime(match.kickoff_at)}</strong>
          {match.stadium}, {match.city}
        </span>
      </div>
    </Link>
  );
}
