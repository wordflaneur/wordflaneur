# Wordflaneur

Webnovel publishing platform prototype — UI-first front-end with plans for a Supabase-backed backend, coin economy, and author/scout monetization flows.

## Architecture overview

High level:
- Frontend: Static HTML/CSS/JS (current prototype). Future: React / Svelte / Vue + component library.
- Backend: Supabase (Postgres + Auth + Storage + Edge Functions) for MVP. Server-side runtime (Node/Nest/Express) for payment webhooks and service-role operations.
- Payments: Stripe (recommended) for fiat payments; map payments to in-app "coins" via a transaction ledger.
- Storage: Supabase Storage (S3-compatible) for images and chapter attachments. CDN for production.
- Background jobs: Redis + queue (e.g., BullMQ) or Supabase Edge Functions + scheduled tasks for processing, payouts, and notifications.

Core concepts:
- Ledger-based wallet: immutable `transactions` table; balances derived from transactions with periodic reconciliation.
- Roles: general user, reader (subscriber), author, scout; Role-Based Access Control and RLS policies in Supabase.
- Commitment model: authors commit to a schedule (e.g., 1–2 chapters/week) with soft incentives (badges, discoverability).

## What this scaffold adds
- README.md (this file)
- package.json (starter)
- .env.example (required environment variables)
- CONTRIBUTING.md
- CODE_OF_CONDUCT.md
- LICENSE (MIT)
- .gitignore

## Developer quick start

Prerequisites
- Node.js 18+ and npm/yarn
- Supabase CLI (optional but recommended): `npm i -g supabase` or use `npx supabase`
- A Supabase project (you mentioned you already have one)

Steps
1. Clone the repo:
   git clone https://github.com/wordflaneur/wordflaneur.git
   cd wordflaneur

2. Install dependencies:
   npm install

3. Create a local .env from the example and fill values (do NOT commit real keys):
   cp .env.example .env
   # Edit .env and paste your SUPABASE_* and STRIPE_* values

4. (Optional) Link the repo to your Supabase project with the CLI:
   supabase login
   supabase link --project-ref <your-project-ref>

5. Run migrations (when migrations exist):
   npm run migrate

6. Run the dev server (replace with your framework command when you add one):
   npm run dev

7. For payment/webhook local testing, run Stripe CLI and forward webhooks to your local server.

## Next recommended tasks
1. Add supabase/migrations for initial schema (users, profiles, wallets, transactions, stories, chapters).
2. Implement server-side functions to handle ledger writes using SUPABASE_SERVICE_ROLE_KEY.
3. Add CI (GitHub Actions) with secret storage for SERVICE_ROLE_KEY and Stripe secrets.

## Security notes
- Never commit service role keys or Stripe secrets. Use GitHub Secrets for CI and environment variables on production servers.
- Use Supabase RLS to restrict row updates and reads as appropriate.