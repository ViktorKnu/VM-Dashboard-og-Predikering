# Deploy

Prosjektet er klargjort for offentlig demo uten betalte live-data-API-er.

- Frontend: Vercel fra `apps/web`
- API: Render fra `apps/api`
- Prediksjoner: lagres i SQL-database når `DATABASE_URL` er satt
- Fallback: frontend bruker seed-data hvis API-et ikke svarer

## 1. Deploy frontend på Vercel

1. Gå til [vercel.com/new](https://vercel.com/new).
2. Importer GitHub-repoet `ViktorKnu/VM-Dashboard-og-Predikering`.
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

5. Deploy.

Frontend fungerer selv uten API fordi den faller tilbake til seed-data. Når API-et er deployet, legg inn denne miljøvariabelen i Vercel:

```text
NEXT_PUBLIC_API_BASE_URL=https://<render-api-url>
```

## 2. Deploy API på Render

1. Gå til Render og velg **New Blueprint**.
2. Koble til GitHub-repoet `ViktorKnu/VM-Dashboard-og-Predikering`.
3. Render leser `render.yaml` fra rotmappen.
4. Bruk gratis plan der det er tilgjengelig.
5. Ikke aktiver betalte add-ons hvis Render ber om kort.

API-et har health check her:

```text
https://<render-api-url>/health
```

API-et lager nødvendige tabeller ved oppstart. `POST /predictions` skriver til databasen når `DATABASE_URL` finnes. Hvis databasen ikke er tilgjengelig, faller API-et tilbake til minnelagring slik at demoen fortsatt virker, men da overlever ikke prediksjoner restart.

## 3. Koble frontend og API

Sett CORS i Render:

```text
ALLOWED_ORIGINS=https://vm-dashboard-og-predikering.vercel.app
```

For både lokal utvikling og deploy:

```text
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,https://vm-dashboard-og-predikering.vercel.app
```

Sett API-base i Vercel:

```text
NEXT_PUBLIC_API_BASE_URL=https://<render-api-url>
```

Etterpå kan du teste:

```text
https://<render-api-url>/predictions
```

## Lokal kontroll før deploy

Backend:

```bash
cd apps/api
python -m pytest
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
- `NEXT_PUBLIC_API_BASE_URL` er offentlig klientkonfig og kan vises i frontend.
- Brukerprediksjoner er offentlig demo-data, ikke private brukerkontoer.
- Demo-API-et har enkel in-memory rate limiting på prediksjoner og simuleringer.
- For produksjon med mer trafikk bør rate limiting flyttes til Redis, WAF eller en gateway.
