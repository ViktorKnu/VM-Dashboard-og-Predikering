export function WinProbabilityBar({
  home,
  draw,
  away
}: {
  home: number;
  draw: number;
  away: number;
}) {
  const values = [
    { label: "Hjemme", value: home, className: "bg-pine" },
    { label: "Uavgjort", value: draw, className: "bg-gold" },
    { label: "Borte", value: away, className: "bg-coral" }
  ];
  return (
    <div className="space-y-2">
      <div className="flex h-3 overflow-hidden rounded-sm bg-ink/10">
        {values.map((item) => (
          <div key={item.label} className={item.className} style={{ width: `${Math.max(item.value * 100, 2)}%` }} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs text-ink/70">
        {values.map((item) => (
          <div key={item.label} className="flex justify-between gap-2">
            <span>{item.label}</span>
            <strong>{Math.round(item.value * 100)}%</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

