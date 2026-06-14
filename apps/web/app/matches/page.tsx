import { api } from "@/lib/api";
import { MatchCard } from "@/components/MatchCard";

export default async function MatchesPage() {
  const matches = await api.matches();
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Kamper</h1>
      <div className="grid gap-4 lg:grid-cols-2">
        {matches.map((match) => <MatchCard key={match.id} match={match} />)}
      </div>
    </div>
  );
}

