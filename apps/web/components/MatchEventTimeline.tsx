import { ArrowRightLeft, BadgeAlert, CircleDot, Goal, ShieldAlert, Video } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { probabilityEventLabel, teamName } from "@/lib/labels";
import type { Match, MatchEvent } from "@/lib/types";

const eventStyles: Record<string, { Icon: LucideIcon; iconClass: string; surfaceClass: string }> = {
  goal: { Icon: Goal, iconClass: "text-mint", surfaceClass: "bg-mint/10" },
  own_goal: { Icon: Goal, iconClass: "text-coral", surfaceClass: "bg-coral/10" },
  yellow_card: { Icon: BadgeAlert, iconClass: "text-gold", surfaceClass: "bg-gold/15" },
  red_card: { Icon: ShieldAlert, iconClass: "text-coral", surfaceClass: "bg-coral/15" },
  substitution: { Icon: ArrowRightLeft, iconClass: "text-fjord", surfaceClass: "bg-fjord/10" },
  var: { Icon: Video, iconClass: "text-fjord", surfaceClass: "bg-fjord/10" },
  penalty_missed: { Icon: CircleDot, iconClass: "text-coral", surfaceClass: "bg-coral/10" }
};

function eventMinute(event: MatchEvent): string {
  return `${event.minute}${event.extra_minute ? `+${event.extra_minute}` : ""}'`;
}

export function MatchEventTimeline({ events, match }: { events: MatchEvent[]; match: Match }) {
  const counts = events.reduce<Record<string, number>>((result, event) => {
    result[event.event_type] = (result[event.event_type] ?? 0) + 1;
    return result;
  }, {});

  return (
    <section className="surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow">Kampforløp</p>
          <h2 className="text-lg font-semibold">Hendelser underveis</h2>
          <p className="mt-1 text-sm text-ink/60">Mål, kort, bytter og andre registrerte kamphendelser.</p>
        </div>
        {events.length ? (
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            {counts.goal ? <span className="chip bg-mint/10 text-mint">{counts.goal} mål</span> : null}
            {counts.yellow_card ? <span className="chip bg-gold/15 text-gold">{counts.yellow_card} gule</span> : null}
            {counts.red_card ? <span className="chip bg-coral/15 text-coral">{counts.red_card} røde</span> : null}
            {counts.substitution ? <span className="chip bg-fjord/10 text-fjord">{counts.substitution} bytter</span> : null}
          </div>
        ) : null}
      </div>

      {events.length ? (
        <div className="relative mt-5 space-y-2 before:absolute before:bottom-5 before:left-[25px] before:top-5 before:w-px before:bg-white/10">
          {events.map((event) => {
            const style = eventStyles[event.event_type] ?? {
              Icon: CircleDot,
              iconClass: "text-fjord",
              surfaceClass: "bg-fjord/10"
            };
            const isHome = event.team_id === match.home_team_id;
            const team = event.team ?? (isHome ? match.home_team : match.away_team);

            return (
              <div key={event.id} className="relative grid grid-cols-[52px_minmax(0,1fr)] gap-3">
                <div className="relative z-10 grid size-[50px] place-items-center rounded-md border border-white/10 bg-card">
                  <strong className="text-sm">{eventMinute(event)}</strong>
                </div>
                <div className={`rounded-md border border-white/10 p-3 ${style.surfaceClass}`}>
                  <div className="flex items-start gap-3">
                    <style.Icon className={`mt-0.5 shrink-0 ${style.iconClass}`} size={19} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <strong>{event.player?.name ?? probabilityEventLabel(event.event_type)}</strong>
                        <span className="text-xs font-bold text-white/50">{team ? teamName(team) : "Ukjent lag"}</span>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-white/65">{event.description}</p>
                      {event.assist_player ? (
                        <span className="mt-1 block text-xs text-white/50">Assist: {event.assist_player.name}</span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-5 rounded-md border border-dashed border-white/20 bg-white/5 p-5 text-center">
          <CircleDot className="mx-auto text-white/35" size={28} />
          <h3 className="mt-3 font-semibold">
            {match.status === "scheduled" ? "Kampen har ikke startet" : "Ingen hendelser er registrert"}
          </h3>
          <p className="mt-1 text-sm text-white/55">
            Hendelser vises her når de finnes i den bekreftede kampdataen.
          </p>
        </div>
      )}
    </section>
  );
}
