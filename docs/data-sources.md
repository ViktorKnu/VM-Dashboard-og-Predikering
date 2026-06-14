# Data Sources

The first version ships with seeded data so the app works without paid APIs.

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

