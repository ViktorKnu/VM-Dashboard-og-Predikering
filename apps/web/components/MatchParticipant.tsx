import { CircleHelp } from "lucide-react";
import type { Team } from "@/lib/types";
import { TeamBadge } from "./TeamBadge";

export function MatchParticipant({
  team,
  label,
  inverted = false,
  align = "left"
}: {
  team: Team | null;
  label?: string | null;
  inverted?: boolean;
  align?: "left" | "right";
}) {
  if (team) {
    return <TeamBadge inverted={inverted} linked={false} team={team} />;
  }

  return (
    <span
      className={`inline-flex min-w-0 items-center gap-2 text-sm font-semibold ${
        inverted ? "text-white/75" : "text-ink/65"
      } ${align === "right" ? "flex-row-reverse text-right" : ""}`}
    >
      <span className={`grid size-7 shrink-0 place-items-center rounded-full ${inverted ? "bg-white/10" : "bg-ink/5"}`}>
        <CircleHelp size={15} />
      </span>
      <span>{label ?? "Ikke avgjort"}</span>
    </span>
  );
}
