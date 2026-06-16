import { api } from "@/lib/api";
import { PlayerProfileTable, TeamLeaderboard } from "@/components/Leaderboards";

export default async function LeaderboardsPage() {
  const [players, teams] = await Promise.all([api.players(), api.teams()]);
  return (
    <div className="space-y-5">
      <section className="surface p-5 md:p-6">
        <p className="eyebrow">Oversikt</p>
        <h1 className="mt-1 text-3xl font-bold">Tabeller</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/62">
          En rask oversikt over spillerprofiler og modellstyrke i seedet demo-data.
        </p>
      </section>
      <div className="grid gap-4 lg:grid-cols-2">
        <PlayerProfileTable players={players} />
        <TeamLeaderboard teams={teams} />
      </div>
    </div>
  );
}

