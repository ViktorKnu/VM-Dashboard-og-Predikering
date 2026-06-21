"use client";

import { CalendarDays, ChevronRight, Clock3, Filter, MapPin } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { formatOsloTime } from "@/lib/api";
import type { Match } from "@/lib/types";
import { MatchCard } from "./MatchCard";
import { TeamBadge } from "./TeamBadge";

type StatusFilter = "upcoming" | "finished" | "all";

const dateKeyFormatter = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Europe/Oslo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
});

const dateHeadingFormatter = new Intl.DateTimeFormat("nb-NO", {
  timeZone: "Europe/Oslo",
  weekday: "long",
  day: "numeric",
  month: "long"
});

function osloDateKey(value: string): string {
  return dateKeyFormatter.format(new Date(value));
}

function osloDateHeading(value: string): string {
  const label = dateHeadingFormatter.format(new Date(value));
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function MatchSchedule({ matches }: { matches: Match[] }) {
  const groups = [...new Set(matches.map((match) => match.group_name).filter(Boolean))].sort() as string[];
  const dates = [...new Map(matches.map((match) => [osloDateKey(match.kickoff_at), match.kickoff_at])).entries()]
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([value, kickoff]) => ({ value, label: osloDateHeading(kickoff) }));

  const [group, setGroup] = useState("all");
  const [status, setStatus] = useState<StatusFilter>("upcoming");
  const [date, setDate] = useState("all");

  const nextNorwayMatch = matches.find(
    (match) =>
      match.status !== "finished" &&
      (match.home_team.fifa_code === "NOR" || match.away_team.fifa_code === "NOR")
  );

  const filteredMatches = matches.filter((match) => {
    const groupMatches = group === "all" || match.group_name === group;
    const dateMatches = date === "all" || osloDateKey(match.kickoff_at) === date;
    const statusMatches =
      status === "all" ||
      (status === "upcoming" ? match.status !== "finished" : match.status === "finished");
    return groupMatches && dateMatches && statusMatches;
  });

  const groupedMatches = new Map<string, Match[]>();
  for (const match of filteredMatches) {
    const key = osloDateKey(match.kickoff_at);
    groupedMatches.set(key, [...(groupedMatches.get(key) ?? []), match]);
  }
  const matchesByDate = [...groupedMatches.entries()];

  return (
    <div className="space-y-6">
      {nextNorwayMatch ? (
        <section className="dashboard-card overflow-hidden p-0">
          <div className="grid lg:grid-cols-[220px_minmax(0,1fr)_auto]">
            <div className="flex items-center gap-3 border-b border-white/10 bg-mint/10 px-5 py-4 lg:border-b-0 lg:border-r">
              <CalendarDays className="text-mint" size={22} />
              <div>
                <p className="eyebrow">Neste Norge-kamp</p>
                <strong className="block">{formatOsloTime(nextNorwayMatch.kickoff_at)}</strong>
              </div>
            </div>
            <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 px-5 py-4">
              <div className="min-w-0 justify-self-end">
                <TeamBadge inverted linked={false} team={nextNorwayMatch.home_team} />
              </div>
              <span className="text-xs font-black uppercase text-white/45">mot</span>
              <div className="min-w-0">
                <TeamBadge inverted linked={false} team={nextNorwayMatch.away_team} />
              </div>
            </div>
            <Link className="primary-action m-4 self-center" href={`/matches/${nextNorwayMatch.id}`}>
              Kampdetaljer <ChevronRight size={17} />
            </Link>
          </div>
        </section>
      ) : null}

      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
          <span className="mr-1 inline-flex items-center gap-2 text-sm font-bold text-white/60">
            <Filter size={16} /> Gruppe
          </span>
          {["all", ...groups].map((item) => (
            <button
              key={item}
              className={`focus-ring h-9 rounded-md px-3 text-sm font-bold transition ${
                group === item ? "bg-mint text-night" : "border border-white/10 bg-white/5 text-white/65 hover:border-mint/40"
              }`}
              onClick={() => setGroup(item)}
              type="button"
            >
              {item === "all" ? "Alle" : `Gruppe ${item}`}
            </button>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_250px]">
          <div className="grid grid-cols-3 rounded-md border border-white/10 bg-white/5 p-1">
            {([
              ["upcoming", "Kommende"],
              ["finished", "Ferdige"],
              ["all", "Alle"]
            ] as const).map(([value, label]) => (
              <button
                key={value}
                className={`focus-ring h-9 rounded-md text-sm font-bold transition ${
                  status === value ? "bg-mint text-night shadow-sm" : "text-white/60 hover:text-white"
                }`}
                onClick={() => setStatus(value)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>

          <label className="relative">
            <span className="sr-only">Filtrer på dato</span>
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mint" size={17} />
            <select
              className="field mt-0 h-[46px] appearance-none pl-10"
              onChange={(event) => setDate(event.target.value)}
              value={date}
            >
              <option value="all">Alle datoer</option>
              {dates.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-white/60">
          <strong className="text-white">{filteredMatches.length}</strong> kamper vises
        </p>
        <span className="inline-flex items-center gap-2 text-xs font-semibold text-white/50">
          <Clock3 size={14} /> Europe/Oslo
        </span>
      </div>

      {matchesByDate.length ? (
        <div className="space-y-8">
          {matchesByDate.map(([dateKey, dateMatches]) => (
            <section key={dateKey} className="space-y-3">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-black">{osloDateHeading(dateMatches[0].kickoff_at)}</h2>
                <span className="h-px flex-1 bg-white/10" />
                <span className="text-xs font-semibold text-white/50">{dateMatches.length} kamper</span>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {dateMatches.map((match) => <MatchCard key={match.id} match={match} />)}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="surface grid min-h-48 place-items-center p-6 text-center">
          <div>
            <CalendarDays className="mx-auto text-mint" size={30} />
            <h2 className="mt-3 text-lg font-bold">Ingen kamper matcher filtrene</h2>
            <p className="mt-1 text-sm text-white/60">Velg en annen gruppe, status eller dato.</p>
          </div>
        </div>
      )}

      <p className="inline-flex items-center gap-2 text-xs text-white/45">
        <MapPin size={14} /> Kampsted vises i hvert kampkort. Alle klokkeslett er norsk tid.
      </p>
    </div>
  );
}
