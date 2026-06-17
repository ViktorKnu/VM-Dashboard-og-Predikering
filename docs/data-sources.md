# Data Sources

The first version ships with seeded data so the app works without paid APIs.

## Live API Readiness

The backend is now wired for real provider data without requiring it for the public demo.

- `GET /data/sources` shows which external sources are configured and whether raw cache exists.
- `GET /data/status` reports whether the frontend is using seed fallback or configured external sources.
- `GET /live/ticker` gives the frontend a single API payload for the scrolling top ticker.
- `worldcup-ingest import-matches` can fetch `FIFA_SCHEDULE_URL` and write the raw response to `data/raw`.
- `worldcup-ingest import-rankings` can fetch `FIFA_RANKINGS_URL` and `WORLD_FOOTBALL_ELO_URL`.
- `worldcup-ingest import-country-indicators` can hit the configured World Bank base URL.
- `worldcup-ingest import-players` is reserved for a live provider such as API-Football.

Configured provider responses are cached before normalization. If a provider fails, the API can keep serving seed fallback or the last cached payload.

## Environment Variables

| Variable | Purpose |
| --- | --- |
| `LIVE_DATA_PROVIDER` | `seeded` for demo mode, or a provider label such as `api-football`. |
| `FIFA_SCHEDULE_URL` | JSON endpoint for official schedule/results import. |
| `FIFA_RANKINGS_URL` | JSON endpoint for FIFA rankings import. |
| `WORLD_FOOTBALL_ELO_URL` | JSON endpoint/file URL for Elo import. |
| `WORLD_BANK_BASE_URL` | World Bank API base URL. Defaults to `https://api.worldbank.org/v2`. |
| `API_FOOTBALL_BASE_URL` | Live football provider endpoint. |
| `API_FOOTBALL_KEY` | Optional provider key. Keep this only in Render/local `.env`, never in git. |
| `EXTERNAL_DATA_CACHE_DIR` | Raw response cache directory. |
| `EXTERNAL_DATA_CACHE_TTL_SECONDS` | Cache TTL before the importer tries a fresh provider fetch. |

## Planned Sources

| Source | Purpose | Notes |
| --- | --- | --- |
| FIFA official schedule/results | Fixtures, venues, results | Prefer official IDs when available. |
| Fjelstul World Cup Database | Historical World Cup data | Useful for backtesting and historical insights. |
| international_results | Wider national-team history | Useful for recent form and calibration. |
| World Football Elo Ratings | Team strength | Import snapshots by date. |
| FIFA rankings | Ranking and ranking points | Store ranking date. |
| World Bank | GDP per capita and population | Normalize by tournament field. |
| StatsBomb Open Data | Events and xG examples | Open data coverage is limited. |
| API-Football or similar | Live events and stats | Must cache, rate-limit and store raw payloads. |
| NRK / TV 2 pages | Norwegian broadcasts | Link only to official pages. |

## Engineering Concerns

- Cache external API responses.
- Store raw API responses in `data/raw` or object storage.
- Respect provider rate limits.
- Support seeded/mock live mode.
- Make polling interval configurable.
- Push updates to frontend through SSE or WebSockets.
- Keep provider-specific code behind adapters.

