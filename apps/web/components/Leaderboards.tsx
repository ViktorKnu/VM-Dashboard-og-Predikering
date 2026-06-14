import type { Player, Team } from "@/lib/types";
import { TeamBadge } from "./TeamBadge";

export function TopScorerTable({ players }: { players: Player[] }) {
  return (
    <section className="rounded-md border border-ink/10 bg-white/88 p-4">
      <h2 className="mb-3 text-lg font-semibold">Toppscorere</h2>
      <div className="divide-y divide-ink/10">
        {players.slice(0, 8).map((player, index) => (
          <div key={player.id} className="grid grid-cols-[32px_1fr_52px] py-2 text-sm">
            <span>{index + 1}</span>
            <span>{player.name}</span>
            <strong>{player.goals}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

export function TeamLeaderboard({ teams }: { teams: Team[] }) {
  return (
    <section className="rounded-md border border-ink/10 bg-white/88 p-4">
      <h2 className="mb-3 text-lg font-semibold">Lagstyrke</h2>
      <div className="divide-y divide-ink/10">
        {teams.slice(0, 8).map((team) => (
          <div key={team.id} className="grid grid-cols-[1fr_70px_70px] items-center gap-2 py-2 text-sm">
            <TeamBadge compact team={team} />
            <span>FIFA {team.fifa_ranking}</span>
            <strong>{team.elo_rating}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

