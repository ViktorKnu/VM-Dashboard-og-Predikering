import type { Player, Team } from "@/lib/types";
import { TeamBadge } from "./TeamBadge";

export function TopScorerTable({ players }: { players: Player[] }) {
  return (
    <section className="surface p-4">
      <div className="mb-4">
        <p className="eyebrow">Form</p>
        <h2 className="text-lg font-semibold">Toppscorere</h2>
      </div>
      <div className="space-y-2">
        {players.slice(0, 8).map((player, index) => (
          <div key={player.id} className="grid grid-cols-[34px_minmax(0,1fr)_64px] items-center gap-3 rounded-md bg-frost px-3 py-2 text-sm">
            <span className="grid size-7 place-items-center rounded-sm bg-white font-bold text-ink/70">{index + 1}</span>
            <span className="truncate font-medium">{player.name}</span>
            <strong className="text-right">{player.goals} mål</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

export function TeamLeaderboard({ teams }: { teams: Team[] }) {
  return (
    <section className="surface p-4">
      <div className="mb-4">
        <p className="eyebrow">Modellfelt</p>
        <h2 className="text-lg font-semibold">Lagstyrke</h2>
      </div>
      <div className="space-y-2">
        {teams.slice(0, 8).map((team) => (
          <div key={team.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md bg-frost px-3 py-2 text-sm">
            <TeamBadge compact team={team} />
            <div className="text-right">
              <span className="block text-xs text-ink/52">FIFA {team.fifa_ranking}</span>
              <strong>{team.elo_rating}</strong>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
