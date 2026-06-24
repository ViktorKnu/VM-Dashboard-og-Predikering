# Modell

## Modellnivåer

Appen har nå flere valgbare deterministiske modeller:

| Modell | Versjon | Status | Bruk |
| --- | --- | --- | --- |
| Enkel modell | `wc-v0.1-simple` | Velgbar | Kontrollmodell med FIFA-rangering og Elo. |
| Landmodell | `wc-v0.2-country-features` | Standard | Landnivåmodell med ranking, Elo, økonomiske proxyer, fotballkultur og historisk VM-styrke. |
| Avansert modell | `wc-v0.3-squad-context` | Velgbar | Legger til spillerstyrke, landslagsproduksjon og tidlig turneringsform. |
| Ekspertmodell | `wc-v0.4-many-parameters` | Eksperimentell | Mange parametre, klar for historisk trening og kalibrering senere. |

Brukeren kan velge modell på kampsiden via `?modell=simple`, `?modell=country`, `?modell=advanced` eller `?modell=expert`. Backend bruker tilsvarende `GET /matches/{id}/prediction?model_id=...`.

## Features

- FIFA-rangering, invertert og normalisert.
- FIFA-rankingpoeng.
- Elo-rating, normalisert.
- BNP per innbygger som proxy for sportsinfrastruktur.
- Befolkning som proxy for talentpool.
- Fotballpopularitet som proxy for kulturell betydning.
- Konføderasjonsstyrke.
- Vertsnasjonsfordel.
- Historisk VM-prestasjon.
- Spiller-rating, toppspiller-rating og angrepsrating.
- Landskamperfaring og målsnitt i tropp.
- Nåværende gruppepoeng, nylig målforskjell og målprofil.
- Proxyer for underdog-robusthet og turneringserfaring.

Alle features normaliseres innen aktivt turneringsfelt. FIFA-rangering og mål imot per kamp inverteres slik at høyere normalisert verdi betyr sterkere signal.

## Begrensninger

BNP, befolkning og fotballpopularitet er proxyer, ikke direkte årsaksvariabler. De kan introdusere skjevheter og skal forklares tydelig i UI-et. Seedet popularitetsscore bør erstattes av en etterprøvbar kilde før seriøs bruk.

Råmodellene er deterministiske. Tilfeldighet brukes bare i Monte Carlo-simuleringer som estimerer kamp- og turneringsutfall.

## Trening

Det finnes en treningsstruktur i appen, men ekte historisk modelltrening er ikke fullført før verifiserte historiske data er importert. Planlagt treningsløp:

1. Importer historiske VM-kamper fra Fjelstul/FIFA.
2. Generer features slik de ville vært kjent før hver kampdato.
3. Tren enkel, land, avansert og ekspertmodell på samme split.
4. Evaluer accuracy, log loss, Brier-score og kalibrering.
5. Publiser bare modeller som har dokumentert datagrunnlag og leakage-sjekk.

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

