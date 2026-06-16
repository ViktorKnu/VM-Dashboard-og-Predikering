import { api } from "@/lib/api";
import { LiveTopScorerTable, PlayerProfileTable, TeamLeaderboard, TopScorerPredictionTable } from "@/components/Leaderboards";

export default async function LeaderboardsPage() {
  const [players, teams, topScorers, topScorerPredictions] = await Promise.all([
    api.players(),
    api.teams(),
    api.topScorers(),
    api.topScorerPredictions()
  ]);
  return (
    <div className="space-y-5">
      <section className="surface p-5 md:p-6">
        <p className="eyebrow">Oversikt</p>
        <h1 className="mt-1 text-3xl font-bold">Tabeller</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/60">
          Live toppscorer teller faktiske mål fra kampdata. Modellprediksjonen viser hvem modellen tror ender øverst.
        </p>
      </section>
      <div className="grid gap-4 lg:grid-cols-2">
        <LiveTopScorerTable scorers={topScorers} />
        <TopScorerPredictionTable predictions={topScorerPredictions} />
        <PlayerProfileTable players={players} />
        <TeamLeaderboard teams={teams} />
      </div>
    </div>
  );
}

