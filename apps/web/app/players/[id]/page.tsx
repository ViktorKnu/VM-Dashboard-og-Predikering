import { api } from "@/lib/api";
import { PlayerCard } from "@/components/PlayerCard";

export default async function PlayerPage({ params }: { params: { id: string } }) {
  const player = await api.player(Number(params.id));
  return <PlayerCard player={player} />;
}

