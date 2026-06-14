import { api } from "@/lib/api";
import { PlayerCard } from "@/components/PlayerCard";
import { TeamBadge } from "@/components/TeamBadge";

export default async function TeamPage({ params }: { params: { id: string } }) {
  const team = await api.team(Number(params.id));
  return (
    <div className="space-y-5">
      <section className="rounded-md border border-ink/10 bg-white/88 p-5">
        <TeamBadge team={team} />
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          <div className="rounded-sm bg-frost p-3">FIFA <strong className="block">{team.fifa_ranking}</strong></div>
          <div className="rounded-sm bg-frost p-3">Elo <strong className="block">{team.elo_rating}</strong></div>
          <div className="rounded-sm bg-frost p-3">Befolkning <strong className="block">{team.population.toLocaleString("nb-NO")}</strong></div>
          <div className="rounded-sm bg-frost p-3">GDP/cap <strong className="block">{team.gdp_per_capita.toLocaleString("nb-NO")}</strong></div>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(team.players ?? []).map((player) => <PlayerCard key={player.id} player={player} />)}
      </section>
    </div>
  );
}

