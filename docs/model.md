# Model

## Current Version

`wc-v0.2-norway` is a deterministic baseline for pre-match probabilities. It is intentionally simple, inspectable and safe for a portfolio first version.

## Features

- FIFA ranking, inverted and normalized.
- Elo rating, normalized.
- GDP per capita as a proxy for sports infrastructure.
- Population size as a proxy for talent pool.
- Football popularity score as a proxy for cultural importance.
- Confederation strength.
- Host nation advantage.
- Historical World Cup performance.

## Limitations

GDP, population and football popularity are proxies, not direct causal variables. They can introduce bias and should be documented carefully in the UI. The seeded popularity score should be replaced by a defensible source before serious use.

The raw model is deterministic. Randomness appears only in Monte Carlo simulation, which estimates match and tournament outcome distributions.

## Live Probability

Live probability starts from the pre-match baseline and adjusts for:

- current score,
- match minute,
- red cards,
- xG swing,
- shots on target,
- dangerous attacks,
- substitutions placeholder,
- momentum last 10 minutes placeholder,
- yellow-card risk,
- formation changes.

Significant changes create `ProbabilityEvent` records for the “What changed?” explanation system.

## Model Lab

The Model Lab page includes:

- version history,
- feature importance,
- backtesting dataset placeholder,
- accuracy,
- log loss,
- Brier score,
- calibration chart placeholder,
- confusion matrix placeholder,
- SHAP explanation placeholder.

