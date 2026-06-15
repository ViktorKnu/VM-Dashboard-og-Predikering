import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { TeamBadge } from "@/components/TeamBadge";

export default async function TeamsPage() {
  const teams = await api.teams();
  return (
    <div className="space-y-5">
      <section className="surface p-5 md:p-6">
        <p className="eyebrow">Land og modellfeatures</p>
        <h1 className="mt-1 text-3xl font-bold">Lag</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/62">
          Seedet lagfelt med FIFA-rangering, Elo og enkle landnivåvariabler for prediksjonsmodellen.
        </p>
      </section>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {teams.map((team) => (
          <Link key={team.id} className="focus-ring group block rounded-lg border border-ink/10 bg-white/90 p-4 shadow-[0_14px_44px_rgba(23,33,31,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(23,33,31,0.11)]" href={`/teams/${team.id}`}>
            <div className="flex items-start justify-between gap-3">
              <TeamBadge linked={false} team={team} />
              <ArrowRight className="text-ink/35 transition group-hover:translate-x-1 group-hover:text-pine" size={18} />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-md bg-frost p-3">
                <span className="block text-ink/52">FIFA</span>
                <strong>{team.fifa_ranking}</strong>
              </div>
              <div className="rounded-md bg-frost p-3">
                <span className="block text-ink/52">Elo</span>
                <strong>{team.elo_rating}</strong>
              </div>
              <div className="rounded-md bg-frost p-3">
                <span className="block text-ink/52">Region</span>
                <strong>{team.confederation}</strong>
              </div>
              <div className="rounded-md bg-frost p-3">
                <span className="block text-ink/52">Fotball</span>
                <strong>{Math.round(team.football_popularity_score * 100)}%</strong>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
