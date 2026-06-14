import Link from "next/link";
import { api } from "@/lib/api";
import { TeamBadge } from "@/components/TeamBadge";

export default async function TeamsPage() {
  const teams = await api.teams();
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Lag</h1>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {teams.map((team) => (
          <Link key={team.id} className="rounded-md border border-ink/10 bg-white/88 p-4" href={`/teams/${team.id}`}>
            <TeamBadge team={team} />
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <span>FIFA {team.fifa_ranking}</span>
              <span>Elo {team.elo_rating}</span>
              <span>{team.confederation}</span>
              <span>{Math.round(team.football_popularity_score * 100)}% fotball</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

