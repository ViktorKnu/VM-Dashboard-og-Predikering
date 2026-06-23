# Modell

## Nåværende versjon

`wc-v0.2-norway` er en deterministisk baseline for sannsynlighet før kamp. Den er bevisst enkel, forklarbar og trygg som første portfolio-versjon.

## Features

- FIFA-rangering, invertert og normalisert.
- Elo-rating, normalisert.
- BNP per innbygger som proxy for sportsinfrastruktur.
- Befolkning som proxy for talentpool.
- Fotballpopularitet som proxy for kulturell betydning.
- Konføderasjonsstyrke.
- Vertsnasjonsfordel.
- Historisk VM-prestasjon.

## Begrensninger

BNP, befolkning og fotballpopularitet er proxyer, ikke direkte årsaksvariabler. De kan introdusere skjevheter og skal forklares tydelig i UI-et. Seedet popularitetsscore bør erstattes av en etterprøvbar kilde før seriøs bruk.

Råmodellen er deterministisk. Tilfeldighet brukes bare i Monte Carlo-simuleringer som estimerer kamp- og turneringsutfall.

## Live-sannsynlighet

Live-sannsynlighet starter fra pre-match-baseline og justeres for:

- stilling,
- kampminutt,
- røde kort,
- xG-sving,
- skudd på mål,
- farlige angrep,
- bytter når leverandøren har hendelsesdata,
- momentum siste 10 minutter når statistikk finnes,
- gulkort-risiko,
- formasjonsendringer.

Store endringer kan lagres som `ProbabilityEvent` og vises i forklaringssystemet “Hva endret seg?”.

## Modellverksted

Modellverkstedet viser:

- versjonshistorikk,
- variabelbetydning,
- struktur for backtesting mot historiske VM-kamper,
- accuracy,
- log loss,
- Brier-score,
- plass for kalibreringsgraf,
- plass for forvekslingsmatrise,
- plass for SHAP-lignende forklaringer.

