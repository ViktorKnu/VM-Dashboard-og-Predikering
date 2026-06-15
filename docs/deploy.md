# Deploy

Prosjektet er klargjort for gratis/offentlig demo uten betalte API-er.

- Frontend: Vercel fra `apps/web`
- API: Render fra `apps/api`
- Data: seed/mock-data som fungerer uten database, Redis eller betalte leverandører

## 1. Deploy frontend på Vercel

1. Gå til [vercel.com/new](https://vercel.com/new).
2. Importer GitHub-repoet `h678128/VM-Dashboard-og-Predikering`.
3. Sett **Root Directory** til:

```text
apps/web
```

4. La Vercel bruke innstillingene fra `apps/web/vercel.json`:

```text
Install Command: npm ci
Build Command: npm run build
Framework: Next.js
```

5. Ikke legg inn betalingskort eller betalte integrasjoner.
6. Deploy.

Frontend fungerer selv uten API fordi den faller tilbake til seed-data. Når API-et senere er deployet, legg inn:

```text
NEXT_PUBLIC_API_BASE_URL=https://<render-api-url>
```

## 2. Deploy API på Render

1. Gå til Render og velg **New Blueprint**.
2. Koble til GitHub-repoet `h678128/VM-Dashboard-og-Predikering`.
3. Render leser `render.yaml` fra rotmappen.
4. Bruk gratis plan der det er tilgjengelig.
5. Ikke aktiver betalt PostgreSQL, Redis eller add-ons hvis Render ber om kort.

API-et har health check her:

```text
https://<render-api-url>/health
```

## 3. Koble frontend og API

Når Vercel-URL-en er klar, sett CORS i Render:

```text
ALLOWED_ORIGINS=https://<vercel-url>
```

Når Render-URL-en er klar, sett API-base i Vercel:

```text
NEXT_PUBLIC_API_BASE_URL=https://<render-api-url>
```

Hvis du vil støtte både lokal utvikling og deploy:

```text
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,https://<vercel-url>
```

## Lokal kontroll før deploy

Backend:

```bash
cd apps/api
python -m pytest tests
python -m ruff check app tests
```

Frontend:

```bash
cd apps/web
npm run lint
npm run build
npm audit --audit-level=moderate
```

## Viktig

- Ikke legg ekte secrets i repoet.
- `.env` og `.env.local` er ignorert.
- `.env.example` og `apps/web/.env.example` inneholder bare lokale demo-verdier.
- Frontend bruker seed fallback hvis API-et ikke svarer.
- Ikke bruk betalte API-er, databaseplaner eller deploy-addons for denne demoen.
