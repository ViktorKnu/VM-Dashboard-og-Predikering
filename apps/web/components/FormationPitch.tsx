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
    <section className="rounded-md border border-ink/10 bg-white/88 p-4">
      <h2 className="mb-3 text-lg font-semibold">Formasjon {formation}</h2>
      <div className="relative grid min-h-[360px] gap-3 rounded-md border-2 border-white bg-pine p-4 shadow-inner">
        {rows.map((count, rowIndex) => (
          <div key={`${formation}-${rowIndex}`} className="flex items-center justify-around gap-2">
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

