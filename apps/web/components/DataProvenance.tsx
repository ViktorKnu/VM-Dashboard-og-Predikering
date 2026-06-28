import { Clock3, ExternalLink, Radio, RefreshCw } from "lucide-react";
import type { DataStatus } from "@/lib/types";

function formatUpdatedAt(value?: string | null): string | null {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("nb-NO", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Oslo"
  }).format(date);
}

export function DataProvenance({ status, compact = false }: { status: DataStatus; compact?: boolean }) {
  const updatedAt = formatUpdatedAt(status.last_updated ?? status.processed_at);
  const statusLabel = status.is_live_data ? "Sanntidsdata" : "Importert snapshot";
  const StatusIcon = status.is_live_data ? Radio : RefreshCw;

  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 ${compact ? "text-xs" : "text-sm"}`}>
      <span className={`chip ${status.is_live_data ? "bg-mint/15 text-mint" : "bg-gold/15 text-gold"}`}>
        <StatusIcon size={14} /> {statusLabel}
      </span>
      <span className="text-ink/60">
        Kilde:{" "}
        {status.source_url ? (
          <a
            className="focus-ring inline-flex items-center gap-1 rounded-sm font-semibold text-white/80 hover:text-mint"
            href={status.source_url}
            rel="noreferrer"
            target="_blank"
          >
            {status.source} <ExternalLink size={13} />
          </a>
        ) : (
          <strong className="text-white/80">{status.source}</strong>
        )}
      </span>
      {updatedAt ? (
        <span className="inline-flex items-center gap-1.5 text-ink/60">
          <Clock3 size={14} /> Oppdatert {updatedAt}
        </span>
      ) : null}
      <span className="text-ink/60">Tider: {status.timezone}</span>
    </div>
  );
}
