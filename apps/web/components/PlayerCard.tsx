import type { Player } from "@/lib/types";

export function PlayerCard({ player }: { player: Player }) {
  return (
    <div className="rounded-md border border-ink/10 bg-white/88 p-4">
      <div className="text-sm text-ink/55">#{player.shirt_number} · {player.position}</div>
      <h2 className="mt-1 text-xl font-semibold">{player.name}</h2>
      <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
        <div className="rounded-sm bg-frost p-2"><span className="block text-ink/55">Kamper</span><strong>{player.caps}</strong></div>
        <div className="rounded-sm bg-frost p-2"><span className="block text-ink/55">Mål</span><strong>{player.goals}</strong></div>
        <div className="rounded-sm bg-frost p-2"><span className="block text-ink/55">Rating</span><strong>{player.rating}</strong></div>
      </div>
      <p className="mt-3 text-sm text-ink/70">{player.club}</p>
    </div>
  );
}

