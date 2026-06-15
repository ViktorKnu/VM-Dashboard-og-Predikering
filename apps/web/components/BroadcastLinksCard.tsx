import { ExternalLink, Tv } from "lucide-react";
import type { Broadcast } from "@/lib/types";

export function BroadcastLinksCard({ broadcasts }: { broadcasts: Broadcast[] }) {
  return (
    <section className="surface p-4">
      <div className="mb-4 flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-md bg-fjord/10 text-fjord">
          <Tv size={20} />
        </span>
        <div>
          <p className="eyebrow">TV</p>
          <h2 className="text-lg font-semibold">Norske sendinger</h2>
        </div>
      </div>
      <div className="space-y-3">
        {broadcasts.length === 0 ? <p className="rounded-md bg-frost p-3 text-sm text-ink/65">Offisiell norsk TV-lenke er ikke lagt inn ennå.</p> : null}
        {broadcasts.map((item) => (
          <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-frost p-3">
            <div>
              <div className="font-semibold">{item.broadcaster} · {item.channel}</div>
              <div className="text-sm text-ink/60">{item.requires_login ? "Krever innlogging/abonnement" : "Åpen offisiell side"}</div>
            </div>
            <div className="flex gap-2 text-sm font-semibold text-fjord">
              {item.stream_url ? <a className="focus-ring inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 transition hover:text-pine" href={item.stream_url} rel="noreferrer" target="_blank">Se <ExternalLink size={14} /></a> : null}
              {item.replay_url ? <a className="focus-ring inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 transition hover:text-pine" href={item.replay_url} rel="noreferrer" target="_blank">Reprise <ExternalLink size={14} /></a> : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
