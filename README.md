# Portfolio — two sites behind one audience gate

**Live:** [sreehari59.github.io](https://sreehari59.github.io)

Visitors land on a lightweight **gate** that asks *"are you a developer?"* and routes them to one of two full portfolios:

| Choice | Serves | Source | Tech |
| --- | --- | --- | --- |
| **I'm a developer** | `/dev/` | `apps/dev/` | Next.js 16 static export — VS Code–style IDE |
| **Just browsing** | `/portfolio/` | `apps/web/` | Vite + React 19 — "Agent Swarm" (WebGL) |

Both sites share one AI chat backend (`apps/worker/`, a Cloudflare Worker) and one content source (`packages/content/`). The audience choice is remembered in `localStorage`; a "switch view" link in each site's nav returns to the gate (`/?gate=1`).

Everything is one static site served from `/docs` on GitHub Pages — there is no server.

```
/
├─ apps/
│  ├─ web/              v3 "Agent Swarm" — Vite, base '/portfolio/'   → builds to docs/portfolio
│  ├─ dev/               v2 "developer" — Next.js, basePath '/dev'    → exports to docs/dev
│  ├─ worker/            Cloudflare Worker backing the chat (shared by both)
│  └─ gate/index.html    Front-door gate (plain HTML, no framework)
├─ packages/
│  └─ content/           Shared, typed content: resume, canned Q&A, chat system prompt
├─ scripts/assemble.mjs  Copies the builds + gate into /docs
├─ docs/                 ← committed build output GitHub Pages serves
└─ package.json          npm workspaces root + orchestration scripts
```

This is an **npm workspaces** monorepo — one `npm install` at the root installs every app and the shared content package, and one root `package-lock.json` covers all of them.

## Quick start (clone → run → replicate)

```bash
# 1. install everything (root + all apps/packages, one lockfile)
npm install

# 2. build everything into /docs
npm run build

# 3. preview the assembled site locally
npx serve docs          # then open http://localhost:3000
```

`npm run build` runs, in order: the Vite build (→ `docs/portfolio`), the Next static export (→ `docs/dev`), then `scripts/assemble.mjs`, which copies the export into `docs/dev`, drops the gate at `docs/index.html`, and writes `docs/.nojekyll`.

### Developing a single site
- **Portfolio (v3):** `npm run dev -w @portfolio/web` (Vite dev server)
- **Developer (v2):** `npm run dev -w @portfolio/dev` (Next dev server, http://localhost:3000/dev)
- **Worker:** `npm run dev -w @portfolio/worker` (`wrangler dev`)
- **Gate:** open `apps/gate/index.html` directly, or preview the assembled `docs/`.

## Making it yours (fork checklist)

1. **Content — one place to edit.** All resume data, canned chat Q&A, and the chat system prompt live in [`packages/content`](packages/content):
   - `packages/content/src/resume.ts` — profile, experience, projects, awards, education, skills, languages.
   - `packages/content/src/canned.ts` — canned Q&A the chat answers instantly, with no API call.
   - `packages/content/src/systemPrompt.ts` — assembled automatically from the above; edit tone/rules here.
   - Each app adds only what's specific to it on top: `apps/web/src/data/resume.ts` and `apps/dev/lib/data.ts` each compose their own résumé-PDF path and project accent colors — see the comments in `packages/content/src/resume.ts`.
2. **Gate copy & links.** Edit `apps/gate/index.html` (name, tagline, the two card descriptions).
3. **Repo name / base paths.** If you rename the repo or host elsewhere, the base paths must match the served subpaths: `apps/web/vite.config.ts` (`base`), `apps/dev/next.config.ts` (`basePath`). The gate redirects to `/dev/` and `/portfolio/`.
4. **Chat backend** (optional — the site works canned-only without it):
   - `cd apps/worker && npx wrangler login`
   - `npx wrangler secret put ANTHROPIC_API_KEY`
   - `npm run deploy -w @portfolio/worker` → copy the deployed Worker URL
   - Put it in `apps/dev/.env.local` as `NEXT_PUBLIC_CHAT_URL=<url>` **and** `apps/web/.env` as `VITE_CHAT_URL=<url>`, then rebuild.
   - Update `ALLOWED_ORIGINS` in `apps/worker/wrangler.toml` if your site URL changes.
5. **Deploy.** Commit `/docs`, then in GitHub → Settings → Pages set **Source = `main` branch, `/docs` folder**.

## Notes
- `docs/` is committed on purpose — GitHub Pages serves it directly. `docs/.nojekyll` is required so Next's `_next/` folder is served.
- Without a chat URL configured, both sites answer from their built-in canned Q&A — fully functional, zero API cost.
- Model used by the chat: `claude-haiku-4-5-20251001` (see `apps/worker/src/index.ts`).
