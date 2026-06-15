import { CalendarDays } from "lucide-react";
import { api } from "@/lib/api";
import { MatchCard } from "@/components/MatchCard";

export default async function MatchesPage() {
  const matches = await api.matches();
  return (
    <div className="space-y-5">
      <section className="surface p-5 md:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Terminliste</p>
            <h1 className="mt-1 text-3xl font-bold">Kamper</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/62">
              Gruppe I-kamper med tider i Europe/Oslo. Resultater og livehendelser vises først når ekte data finnes.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-md bg-frost px-3 py-2 text-sm font-semibold text-ink/68">
            <CalendarDays size={17} /> {matches.length} kamper
          </span>
        </div>
      </section>
      <div className="grid gap-4 lg:grid-cols-2">
        {matches.map((match) => <MatchCard key={match.id} match={match} />)}
      </div>
    </div>
  );
}
