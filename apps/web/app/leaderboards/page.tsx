import { api } from "@/lib/api";
import { TeamLeaderboard, TopScorerTable } from "@/components/Leaderboards";

export default async function LeaderboardsPage() {
  const [players, teams] = await Promise.all([api.players(), api.teams()]);
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Tabeller</h1>
      <div className="grid gap-4 lg:grid-cols-2">
        <TopScorerTable players={players} />
        <TeamLeaderboard teams={teams} />
      </div>
    </div>
  );
}

