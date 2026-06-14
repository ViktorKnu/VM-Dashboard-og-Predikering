# World Cup Insights

![Tests](https://img.shields.io/badge/tests-pytest-2f6f91)
![Lint](https://img.shields.io/badge/lint-ruff%20%2F%20eslint-d5a021)
![Build](https://img.shields.io/badge/build-docker%20compose-0f5d4f)

Portfolio-grade FIFA World Cup analytics and prediction platform built for Norwegian users. The app shows fixtures, results, teams, players, formations, official Norwegian broadcast links, user-vs-model predictions, live win probability explanations, historical insights and tournament simulation.

The first version runs on seeded/mock data so it does not depend on paid APIs. The architecture is ready for FIFA schedules/results, Fjelstul World Cup Database, international_results, World Football Elo Ratings, FIFA rankings, World Bank indicators, StatsBomb Open Data and API-Football-style live providers.

## Screenshots

- `docs/screenshots/home.png` placeholder
- `docs/screenshots/match-detail.png` placeholder
- `docs/screenshots/model-lab.png` placeholder

## What This Project Demonstrates

- Fullstack monorepo architecture with Next.js, FastAPI, SQLAlchemy and Alembic.
- Typed API contracts, deterministic model logic and testable prediction scoring.
- Product thinking for Norway: Europe/Oslo kickoff times and official NRK/TV 2 links only.
- ML engineering hygiene: feature normalization, model versioning, backtesting placeholders and calibration surface.
- Live-data engineering plan: raw response storage, caching, rate limits, seeded live mode, polling config and SSE updates.

## Architecture

```text
apps/web (Next.js)
  -> API fetch with seeded fallback
  -> match pages, predictions, Model Lab, historical insights

apps/api (FastAPI)
  -> REST + SSE endpoints
  -> SQLAlchemy models + Alembic schema
  -> seeded repository layer for first portfolio version
  -> prediction, live probability and tournament simulation services

ml/
  -> feature engineering, training, inference and evaluation modules

data/
  -> raw provider payloads, processed datasets, seed data

PostgreSQL + Redis
  -> configured in docker-compose for production-like local development
```

## Features

- Fixtures and results with all kickoff times displayed in `Europe/Oslo`.
- Match detail page with score, venue, xG, events, lineups, formation and live win probability.
- Official Norwegian broadcast links for NRK, NRK TV, TV 2, TV 2 Play, TV 2 Direkte and TV 2 Sport 1.
- User-vs-model predictions for score, winner, first goalscorer, group winners, tournament winner and top scorer.
- Prediction points: winner 3, goal difference 2, exact score 5, first goalscorer 4, tournament top scorer 10.
- “What changed?” explanations for probability swings caused by goals, cards, xG, shot momentum, substitutions, formations, yellow-card risk and score state.
- Formation viewer for `4-3-3`, `4-2-3-1`, `3-4-3`, `3-5-2`, `5-3-2` and `4-4-2`.
- Tournament simulator estimating advancing, round of 32, round of 16, quarterfinal, semifinal, final and champion probability.
- Model Lab with version history, feature importance, backtesting metrics, calibration/chart placeholders and SHAP placeholder.
- Strong seed data for Norway, France, Senegal, Iraq, Netherlands, Spain, Portugal and Brazil.

## Tech Stack

- Frontend: Next.js, TypeScript, Tailwind CSS, Recharts-ready components, lucide-react icons.
- Backend: FastAPI, Python, Pydantic-compatible schemas.
- Database: PostgreSQL.
- ORM/migrations: SQLAlchemy + Alembic.
- ML: deterministic Python baseline, extensible `ml/` folders for pandas/scikit-learn/XGBoost or LightGBM.
- Live updates: FastAPI Server-Sent Events starter.
- Background jobs: Redis configured; APScheduler/Celery can be added behind ingestion commands.
- Testing: pytest for backend prediction logic.
- Linting/formatting: ruff/black and ESLint/Prettier-ready package scripts.

## Run Locally

### Backend

```bash
cd apps/api
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -e ".[dev]"
uvicorn app.main:app --reload
```

API docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### Frontend

```bash
cd apps/web
npm install
npm run dev
```

App: [http://localhost:3000](http://localhost:3000)

### Docker Compose

```bash
docker compose up --build
```

The default Compose credentials are local demo placeholders only. PostgreSQL and Redis are bound to `127.0.0.1` by default; set real secrets and deployment-specific ports through environment variables before using any shared environment.

## Useful Commands

```bash
cd apps/api
pytest
ruff check .
alembic upgrade head
worldcup-ingest import-teams
worldcup-ingest import-broadcast-links
```

```bash
cd apps/web
npm run lint
npm run build
```

## Example API Responses

`GET /matches/1/prediction`

```json
{
  "match_id": 1,
  "model_version": "wc-v0.2-norway",
  "home_win_probability": 0.47,
  "draw_probability": 0.27,
  "away_win_probability": 0.26,
  "expected_home_goals": 1.34,
  "expected_away_goals": 1.02,
  "predicted_score": "1-1"
}
```

`GET /matches/1/live-probability`

```json
{
  "current": { "minute": 64, "home_score": 1, "away_score": 0 },
  "what_changed": [
    {
      "event_type": "goal",
      "minute": 24,
      "score_state": "1-0",
      "probability_delta": 0.21
    }
  ]
}
```

## ML Model

Model `wc-v0.2-norway` is a deterministic baseline using normalized FIFA ranking, Elo, GDP per capita, population, football popularity, confederation strength, host advantage and historical World Cup performance. GDP and population are proxies only and are documented as limitations. Randomness is used only inside Monte Carlo simulation, never in raw deterministic probabilities.

## Data Sources

Planned adapters:

- FIFA official schedule/results.
- Fjelstul World Cup Database.
- international_results dataset.
- World Football Elo Ratings.
- FIFA rankings.
- World Bank GDP per capita and population.
- StatsBomb Open Data.
- API-Football or similar live provider.
- NRK and TV 2 official broadcaster pages.

The initial repository uses seed data and mock live snapshots. No illegal streams are embedded or linked.

## Roadmap

- [ ] Replace seeded repository with PostgreSQL-backed service layer.
- [ ] Add provider clients with caching, raw response storage and rate-limit handling.
- [ ] Add WebSocket fanout in addition to SSE.
- [ ] Expand historical backtesting across Fjelstul/FIFA datasets.
- [ ] Add frontend chart implementations for calibration, confusion matrix and SHAP-style explanations.
- [ ] Add auth and persistent user prediction leagues.
- [ ] Add CI workflow for backend tests, frontend lint and Docker build.
