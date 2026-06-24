# Modelltrening

Denne mappen beskriver treningsløpet som skal brukes når historiske VM-data er importert.

## Modeller

- `simple`: FIFA-rangering og Elo.
- `country`: landnivå-features, økonomiske proxyer, fotballkultur og historisk VM-score.
- `advanced`: landmodell + spillerstyrke, landslagsproduksjon og tidlig turneringsform.
- `expert`: mange-parameter-modell med alle tilgjengelige features og senere kalibrering.

## Treningsløp

1. Importer historiske VM-kamper fra Fjelstul/FIFA.
2. Bygg features slik de ville vært kjent før kampstart.
3. Del data kronologisk, ikke tilfeldig, for å redusere lekkasje.
4. Tren alle modellnivåer på samme split.
5. Evaluer accuracy, log loss, Brier-score og kalibrering.
6. Publiser bare modeller som har dokumentert datagrunnlag, leakage-sjekk og tydelige begrensninger.

Foreløpig bruker API-et deterministiske modeller i `apps/api/app/services/prediction.py`. Tall som ikke er historisk backtestet skal merkes som seedet eller eksperimentelle.
