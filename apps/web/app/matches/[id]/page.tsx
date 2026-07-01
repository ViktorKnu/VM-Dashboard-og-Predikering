import { Activity, ArrowLeft, MapPin } from "lucide-react";
import Link from "next/link";
import { api, formatOsloTime } from "@/lib/api";
import { matchStageLabel, matchStatusLabel } from "@/lib/labels";
import { BroadcastLinksCard } from "@/components/BroadcastLinksCard";
import { FormationPitch } from "@/components/FormationPitch";
import { MatchEventTimeline } from "@/components/MatchEventTimeline";
import { MatchParticipant } from "@/components/MatchParticipant";
import { ModelExplanationCard } from "@/components/ModelExplanationCard";
import { PredictionForm } from "@/components/PredictionForm";
import { PossessionComparison } from "@/components/PossessionComparison";
import { TeamBadge } from "@/components/TeamBadge";
import { WinProbabilityTimeline } from "@/components/WinProbabilityTimeline";

export default async function MatchDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams?: Promise<{ modell?: string }> }) {
  const { id: rawId } = await params;
  const query = searchParams ? await searchParams : {};
  const id = Number(rawId);
  const selectedModelId = query.modell ?? "country";
  const match = await api.match(id);

  if (!match.home_team || !match.away_team) {
    return (
      <div className="space-y-5">
        <Link className="focus-ring inline-flex items-center gap-2 text-sm font-semibold text-ink/60 hover:text-pine" href="/matches">
          <ArrowLeft size={16} /> Tilbake til alle kamper
        </Link>
        <section className="surface overflow-hidden">
          <div className="border-b border-ink/10 bg-ink px-5 py-4 text-white md:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/60">
                  {matchStageLabel(match.stage)}{match.match_number ? ` · Kamp ${match.match_number}` : ""}
                </p>
                <div className="mt-2 flex items-center gap-2 text-sm text-white/70">
                  <MapPin size={16} /> {match.stadium}, {match.city}
                </div>
              </div>
              <span className="rounded-md bg-white/10 px-3 py-2 text-sm font-bold">{matchStatusLabel(match.status)}</span>
            </div>
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 p-5 md:p-8">
            <MatchParticipant label={match.home_team_label} team={match.home_team} />
            <span className="rounded-md bg-ink px-4 py-3 text-sm font-black uppercase text-white">mot</span>
            <div className="justify-self-end">
              <MatchParticipant align="right" label={match.away_team_label} team={match.away_team} />
            </div>
          </div>
          <div className="border-t border-ink/10 bg-frost px-5 py-4 text-sm text-ink/65 md:px-6">
            <strong className="block text-ink">{formatOsloTime(match.kickoff_at)} · Europe/Oslo</strong>
            <span>Lagene fylles inn automatisk når de tidligere utslagskampene er avgjort.</span>
          </div>
        </section>
      </div>
    );
  }

  const [events, prediction, live, lineups, players, teams, lab] = await Promise.all([
    api.matchEvents(id),
    api.prediction(id, selectedModelId),
    api.live(id),
    api.lineups(id),
    api.players(),
    api.teams(),
    api.modelLab()
  ]);
  const models = Array.isArray(lab.models) ? lab.models as Array<{ id: string; name: string; version: string; features: string[] }> : [];
  const hasLiveData = live.timeline.length > 0;
  const liveStat = (value: number | undefined) => hasLiveData ? value ?? 0 : "Ikke startet";

  return (
    <div className="space-y-5">
      <section className="surface overflow-hidden">
        <div className="border-b border-ink/10 bg-ink px-5 py-4 text-white md:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/60">
                {matchStageLabel(match.stage)}{match.group_name ? ` - Gruppe ${match.group_name}` : ""}
              </p>
              <div className="mt-2 flex items-center gap-2 text-sm text-white/70">
                <MapPin size={16} /> {match.stadium}, {match.city}
              </div>
            </div>
            <span className="rounded-md bg-white/10 px-3 py-2 text-sm font-bold">{matchStatusLabel(match.status)}</span>
          </div>
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 p-5 md:p-6">
          <TeamBadge team={match.home_team} />
          <div className="rounded-md bg-ink px-5 py-3 text-2xl font-bold text-white shadow-sm">
            {match.home_score ?? "-"} : {match.away_score ?? "-"}
          </div>
          <div className="justify-self-end text-right">
            <TeamBadge team={match.away_team} />
          </div>
        </div>
        <div className="border-t border-ink/10 bg-frost px-5 py-3 text-sm text-ink/65 md:px-6">
          {formatOsloTime(match.kickoff_at)} - Europe/Oslo
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <MatchEventTimeline events={events} match={match} />
          <section className="surface p-4">
            <div className="mb-3">
              <p className="eyebrow">Modellvalg</p>
              <h2 className="text-lg font-semibold">Velg prediksjonsmodell</h2>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {models.map((model) => {
                const isSelected = prediction.model_id === model.id;
                return (
                  <Link
                    key={model.id}
                    className={`focus-ring rounded-md border px-3 py-2 text-sm font-semibold transition ${isSelected ? "border-fjord bg-fjord/10 text-fjord" : "border-ink/10 bg-frost text-ink/70 hover:border-fjord/50"}`}
                    href={`/matches/${id}?modell=${model.id}`}
                  >
                    <span className="block">{model.name}</span>
                    <span className="text-xs font-medium text-ink/50">{model.features.length} parametre</span>
                  </Link>
                );
              })}
            </div>
          </section>
          <ModelExplanationCard prediction={prediction} />
          <WinProbabilityTimeline changes={live.what_changed} timeline={live.timeline} />
          <FormationPitch lineups={lineups} match={match} />
        </div>
        <div className="space-y-5">
          <PredictionForm match={match} players={players} teams={teams} />
          <BroadcastLinksCard broadcasts={match.broadcasts ?? []} />
          <section className="surface p-4">
            <div className="mb-3 flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-md bg-fjord/10 text-fjord">
                <Activity size={20} />
              </span>
              <div>
                <p className="eyebrow">Live</p>
                <h2 className="text-lg font-semibold">xG og kampdata</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <PossessionComparison
                awayPossession={live.current.away_possession}
                homePossession={live.current.home_possession}
                match={match}
              />
              <div className="rounded-md bg-frost p-3">xG hjemme <strong className="block">{liveStat(live.current.home_xg)}</strong></div>
              <div className="rounded-md bg-frost p-3">xG borte <strong className="block">{liveStat(live.current.away_xg)}</strong></div>
              <div className="rounded-md bg-frost p-3">Skudd på mål hjemme <strong className="block">{liveStat(live.current.home_shots_on_target)}</strong></div>
              <div className="rounded-md bg-frost p-3">Skudd på mål borte <strong className="block">{liveStat(live.current.away_shots_on_target)}</strong></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
