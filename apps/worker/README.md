# Portfolio chat worker

Cloudflare Worker backing the terminal AI chat on the portfolio. Streams answers
from Claude Haiku over SSE, with instant canned responses for common questions and
CORS locked to the site origin.

## Deploy

```bash
cd worker
npm install
npx wrangler login
npx wrangler secret put ANTHROPIC_API_KEY   # paste your Anthropic API key
npm run deploy
```

Copy the deployed URL (e.g. `https://sreehari-portfolio-chat.<subdomain>.workers.dev`)
into the web app's `.env`:

```
VITE_CHAT_URL=https://sreehari-portfolio-chat.<subdomain>.workers.dev
```

Then rebuild the site (`cd ../web && npm run build`) and commit `/docs`.

## Local dev

```bash
echo "ANTHROPIC_API_KEY=sk-ant-..." > .dev.vars
npm run dev          # serves on http://localhost:8787
```

Point the web app at it during dev: `web/.env` → `VITE_CHAT_URL=http://localhost:8787`.

## Notes

- Without `VITE_CHAT_URL` set, the site runs **canned-only** and is fully functional.
- History is capped to the last 12 messages; `max_tokens` is 600. Model: `claude-haiku-4-5-20251001`.
- Allowed origins live in `wrangler.toml` (`ALLOWED_ORIGINS`). Update if the site URL changes.
