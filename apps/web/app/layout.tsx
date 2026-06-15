import type { Metadata } from "next";
import { BarChart3 } from "lucide-react";
import Link from "next/link";
import { APP_NAME } from "@/lib/labels";
import "./globals.css";

export const metadata: Metadata = {
  title: APP_NAME,
  description: "VM-analyse, prediksjoner og norske TV-lenker."
};

const nav = [
  ["Kamper", "/matches"],
  ["Lag", "/teams"],
  ["Spillere", "/players/1"],
  ["Tabeller", "/leaderboards"],
  ["Prediksjoner", "/predictions"],
  ["Modellverksted", "/model"],
  ["Historikk", "/historical-insights"]
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nb">
      <body>
        <header className="sticky top-0 z-40 border-b border-white/70 bg-white/85 backdrop-blur-xl">
          <nav className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3">
            <Link className="focus-ring mr-auto inline-flex items-center gap-2 rounded-md pr-3 text-base font-bold text-ink" href="/">
              <span className="grid size-9 place-items-center rounded-md bg-pine text-white shadow-sm">
                <BarChart3 size={19} />
              </span>
              <span className="leading-tight">{APP_NAME}</span>
            </Link>
            {nav.map(([label, href]) => (
              <Link key={href} className="focus-ring rounded-md px-3 py-2 text-sm font-semibold text-ink/68 transition hover:bg-frost hover:text-ink" href={href}>
                {label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 md:py-8">{children}</main>
      </body>
    </html>
  );
}

