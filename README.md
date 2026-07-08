# Portfolio — two sites behind one audience gate

**Live:** [sreehari59.github.io](https://sreehari59.github.io)

Visitors land on a lightweight **gate** that asks *"are you a developer?"* and routes them to one of two full portfolios:

| Choice | Serves | Source | Tech |
| --- | --- | --- | --- |
| **I'm a developer** | `/dev/` | `portfolio-v2/` | Next.js 16 static export — VS Code–style IDE |
| **Just browsing** | `/portfolio/` | `web/` | Vite + React 19 — "Agent Swarm" (WebGL) |

Both sites share one AI chat backend (`worker/`, a Cloudflare Worker). The choice is remembered in `localStorage`; a "switch view" link in each site's nav returns to the gate (`/?gate=1`).

Everything is one static site served from `/docs` on GitHub Pages — there is no server.

```
/
├─ gate/index.html      Front-door gate (plain HTML, no framework)
├─ web/                 v3 "Agent Swarm" — Vite, base '/portfolio/'  → builds to docs/portfolio
├─ portfolio-v2/        v2 "developer" — Next.js, basePath '/dev'     → exports to docs/dev
├─ worker/              Cloudflare Worker backing the chat (shared by both)
├─ scripts/assemble.mjs Copies the builds + gate into /docs
├─ docs/                ← committed build output GitHub Pages serves
└─ package.json         Root orchestration scripts
```

## Quick start (clone → run → replicate)

```bash
# 1. install all three subprojects
npm run install:all

# 2. build everything into /docs
npm run build

# 3. preview the assembled site locally
npx serve docs          # then open http://localhost:3000
```

`npm run build` runs, in order: the Vite build (→ `docs/portfolio`), the Next static export (→ `docs/dev`), then `scripts/assemble.mjs`, which copies the export into `docs/dev`, drops the gate at `docs/index.html`, and writes `docs/.nojekyll`.

### Developing a single site
- **Portfolio (v3):** `npm --prefix web run dev` (Vite dev server)
- **Developer (v2):** `npm --prefix portfolio-v2 run dev` (Next dev server, http://localhost:3000/dev)
- **Gate:** open `gate/index.html` directly, or preview the assembled `docs/`.

## Making it yours (fork checklist)

1. **Content.** Resume data lives in three files — update all three:
   - `web/src/data/resume.ts` (portfolio UI)
   - `portfolio-v2/lib/data.ts` (developer UI)
   - `worker/src/resume.ts` + `worker/src/systemPrompt.ts` (what the chat AI knows)
   - Canned chat answers: `web/src/data/canned.ts`, `portfolio-v2/lib/canned-responses.ts`, `worker/src/canned.ts`.
2. **Gate copy & links.** Edit `gate/index.html` (name, tagline, the two card descriptions).
3. **Repo name / base paths.** If you rename the repo or host elsewhere, the base paths must match the served subpaths: `web/vite.config.ts` (`base`), `portfolio-v2/next.config.ts` (`basePath`). The gate redirects to `/dev/` and `/portfolio/`.
4. **Chat backend** (optional — the site works canned-only without it):
   - `cd worker && npm i && npx wrangler login`
   - `npx wrangler secret put ANTHROPIC_API_KEY`
   - `npm run deploy` → copy the deployed Worker URL
   - Put it in `portfolio-v2/.env.local` as `NEXT_PUBLIC_CHAT_URL=<url>` **and** `web/.env` as `VITE_CHAT_URL=<url>`, then rebuild.
   - Update `ALLOWED_ORIGINS` in `worker/wrangler.toml` if your site URL changes.
5. **Deploy.** Commit `/docs`, then in GitHub → Settings → Pages set **Source = `main` branch, `/docs` folder**.

## Notes
- `docs/` is committed on purpose — GitHub Pages serves it directly. `docs/.nojekyll` is required so Next's `_next/` folder is served.
- Without a chat URL configured, both sites answer from their built-in canned Q&A — fully functional, zero API cost.
- Model used by the chat: `claude-haiku-4-5-20251001` (see `worker/src/index.ts`).
- The old Bootstrap v1 site files (`index.html`, `projects/`, root `assets/`) are legacy and not served once Pages points at `/docs`.
