import { CalendarDays, Radio } from "lucide-react";
import { api } from "@/lib/api";

export async function LiveTicker() {
  const ticker = await api.liveTicker();
  const items = ticker.items.map((item) => item.label);
  const tickerItems = [...items, ...items];
  const isLive = ticker.mode === "live";

  return (
    <div className="live-ticker" aria-label="Live VM-oppdateringer">
      <div className="live-ticker-label">
        {isLive ? <Radio size={14} /> : <CalendarDays size={14} />}
        {isLive ? "Direkte" : "VM live"}
      </div>
      <div className="live-ticker-scroll">
        <div className="live-ticker-track">
          {tickerItems.map((item, index) => (
            <span key={`${item}-${index}`} className="live-ticker-item">
              {index % items.length === 0 ? <span className="live-dot" /> : null}
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
