import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Activity, BarChart3, BrainCircuit, CalendarDays, ClipboardCheck, History, Table2, Trophy, type LucideIcon } from "lucide-react";
import "./globals.css";
import { APP_NAME } from "@/lib/labels";

export const metadata: Metadata = {
  title: APP_NAME,
  description: "Norsk VM-dashboard for prediksjoner, kamper og modellinnsikt"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1
};

const nav: Array<[string, string, LucideIcon]> = [
  ["Kamper", "/matches", CalendarDays],
  ["Lag", "/teams", Trophy],
  ["Tabeller", "/leaderboards", Table2],
  ["Prediksjoner", "/predictions", ClipboardCheck],
  ["Modellverksted", "/model", BrainCircuit],
  ["Historikk", "/historical-insights", History]
];

function NavLinks({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "grid grid-cols-2 gap-1 px-3 pb-3" : "grid gap-1"}>
      {nav.map(([label, href, Icon]) => (
        <Link
          key={href}
          className={`focus-ring inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white ${compact ? "justify-center px-2 text-xs" : ""}`}
          href={href}
        >
          <Icon size={16} />
          {label}
        </Link>
      ))}
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nb">
      <body>
        <div className="min-h-screen lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="hidden bg-ink px-4 py-5 text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
            <Link className="focus-ring flex items-center gap-3 rounded-md p-2 font-bold" href="/">
              <span className="grid size-10 place-items-center rounded-md bg-white text-pine shadow-sm">
                <BarChart3 size={20} />
              </span>
              <span className="leading-tight">{APP_NAME}</span>
            </Link>
            <nav className="mt-7">
              <NavLinks />
            </nav>
            <div className="mt-auto rounded-lg border border-white/10 bg-white/10 p-3 text-sm text-white/65">
              <div className="mb-2 flex items-center gap-2 font-bold text-white">
                <Activity size={16} /> Deployklar demo
              </div>
              Norsk tid, offisielle TV-lenker og seed fallback uten betalte API-er.
            </div>
          </aside>

          <div className="min-w-0">
            <header className="sticky top-0 z-40 border-b border-ink/10 bg-ink text-white shadow-sm lg:hidden">
              <div className="flex items-center gap-3 px-4 py-3">
                <Link className="focus-ring mr-auto inline-flex items-center gap-2 rounded-md font-bold" href="/">
                  <span className="grid size-9 place-items-center rounded-md bg-white text-pine">
                    <BarChart3 size={18} />
                  </span>
                  {APP_NAME}
                </Link>
              </div>
              <NavLinks compact />
            </header>
            <main className="mx-auto max-w-[1500px] px-4 py-5 md:px-6 md:py-7 lg:px-8">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
