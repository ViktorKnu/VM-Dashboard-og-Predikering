import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "World Cup Insights",
  description: "VM-analyse, prediksjoner og norske TV-lenker."
};

const nav = [
  ["Kamper", "/matches"],
  ["Lag", "/teams"],
  ["Spillere", "/players/1"],
  ["Tabeller", "/leaderboards"],
  ["Prediksjoner", "/predictions"],
  ["Model Lab", "/model"],
  ["Historikk", "/historical-insights"]
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nb">
      <body>
        <header className="border-b border-ink/10 bg-white/85 backdrop-blur">
          <nav className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-4">
            <Link className="mr-auto text-lg font-bold text-pine" href="/">World Cup Insights</Link>
            {nav.map(([label, href]) => (
              <Link key={href} className="focus-ring rounded-sm px-2 py-1 text-sm font-medium text-ink/75 hover:text-ink" href={href}>
                {label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}

