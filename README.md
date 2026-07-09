# WordFlaneur — Deploy to Render

Quick steps to deploy this app to Render (Web Service):

1. Push this repository to GitHub (branch `main`).

2. On Render, create a new **Web Service** and connect your GitHub repo. Select branch `main`.

3. Render will read `render.yaml` in the repo. Build and start commands are:

```
npm install
npm start
```

4. In the Render service settings add these environment variables (mark as secret):
- `SUPABASE_URL` — your Supabase project URL (e.g. https://xyz.supabase.co)
- `SUPABASE_ANON_KEY` — your Supabase anon/public key

Notes
- `server.js` listens on `process.env.PORT` so Render's automatic port works.
- `render.yaml` contains service settings and secret placeholders — update if needed.

Local test

Run locally to verify before deploying:

```bash
npm install
npm start
# then visit http://localhost:3000
```

If you want, I can open a pull request with this README and help create the Render service next.
