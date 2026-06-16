const formations: Record<string, number[]> = {
  "4-3-3": [1, 4, 3, 3],
  "4-2-3-1": [1, 4, 2, 3, 1],
  "3-4-3": [1, 3, 4, 3],
  "3-5-2": [1, 3, 5, 2],
  "5-3-2": [1, 5, 3, 2],
  "4-4-2": [1, 4, 4, 2]
};

export function FormationPitch({ formation = "4-3-3" }: { formation?: string }) {
  const rows = formations[formation] ?? formations["4-3-3"];
  return (
    <section className="surface p-4">
      <div className="mb-3">
        <p className="eyebrow">Taktikk</p>
        <h2 className="text-lg font-semibold">Formasjon {formation}</h2>
      </div>
      <div className="relative grid min-h-[360px] gap-3 rounded-lg border border-white/60 bg-[linear-gradient(135deg,#0f5d4f,#2f6f91)] p-4 shadow-inner">
        <div className="pointer-events-none absolute inset-4 rounded-md border border-white/45" />
        <div className="pointer-events-none absolute left-4 right-4 top-1/2 border-t border-white/35" />
        {rows.map((count, rowIndex) => (
          <div key={`${formation}-${rowIndex}`} className="relative z-10 flex items-center justify-around gap-2">
            {Array.from({ length: count }).map((_, index) => (
              <div key={index} className="grid h-9 w-9 place-items-center rounded-full bg-white text-sm font-bold text-pine shadow">
                {rowIndex === 0 ? "GK" : index + 1}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
