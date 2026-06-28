import { CalendarDays } from "lucide-react";
import { DataProvenance } from "@/components/DataProvenance";
import { MatchSchedule } from "@/components/MatchSchedule";
import { api } from "@/lib/api";

export default async function MatchesPage() {
  const [matches, dataStatus] = await Promise.all([api.matches(), api.dataStatus()]);

  return (
    <div className="space-y-5">
      <section className="surface p-5 md:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Terminliste</p>
            <h1 className="mt-1 text-3xl font-bold">Kamper</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/60">
              Finn kommende og ferdige kamper etter gruppe og dato. Alle klokkeslett vises i Europe/Oslo.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-md bg-frost px-3 py-2 text-sm font-semibold text-ink/70">
            <CalendarDays size={17} /> {matches.length} kamper
          </span>
        </div>
        <div className="mt-5 border-t border-white/10 pt-4">
          <DataProvenance compact status={dataStatus} />
        </div>
      </section>

      <MatchSchedule matches={matches} />
    </div>
  );
}
