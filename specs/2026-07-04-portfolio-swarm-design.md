# Portfolio v3 — "Agent Swarm" Design Spec

**Date:** 2026-07-04
**Owner:** Sreehari Pradeep Kumar
**Status:** Approved (brainstorming) → implementation

---

## 1. Goal

A standout personal portfolio for a Full Stack AI Engineer. Easy to navigate, single-page,
with an interactive 3D background that is *on-brand* (multi-agent AI), plus a live AI chat
that answers questions about Sreehari and scrolls the page to the relevant section.

Replaces the live Bootstrap/jQuery site at `sreehari59.github.io`.

## 2. Decisions (locked)

| Area | Decision |
|------|----------|
| Build | **Fresh** Vite + React 19 + TypeScript + Tailwind v4 project (not the existing Next.js `portfolio-v2`; not Vite-in-name-only — a clean project) |
| 3D background | **Agent Swarm Network** — react-three-fiber: glowing nodes = agents, edges pulse ("negotiate"), cursor repulsion, bloom |
| Layout | Single-page smooth scroll, sticky nav (active-section highlight + scroll progress), **Cmd+K** quick-jump palette |
| Section order | Hero (with AI chat) → About → Experience → Projects → 🏆 Awards → Skills → Contact |
| Palette | Electric **cyan → violet** on near-black (`#06080F`), bloom glow. Green retired as primary. |
| AI chat | Terminal-style hero chat, **live Claude Haiku via a Cloudflare Worker** (github.io is static). Canned responses as instant/fallback layer. |
| Hosting | Static export → `/docs` on the existing `sreehari59.github.io` repo; GitHub Pages serves `main` `/docs`. Keeps the URL. |
| Content | **Ported** from `portfolio-v2/lib/data.ts` (+ canned responses, system prompt) — content reuse, not framework reuse. |

### Why fresh Vite over upgrading portfolio-v2
User preference. portfolio-v2 (Next.js 16) is left committed and untouched as a reference;
its content and chat logic are ported into the new app.

## 3. Architecture

Two deployables in the one repo:

```
sreehari59.github.io/            (git repo, GitHub Pages: main /docs)
  web/                           <- NEW Vite app (source)
    index.html
    vite.config.ts               base:'/', build.outDir '../docs', emptyOutDir
    src/
      main.tsx  App.tsx  index.css
      three/                     <- swarm, fully isolated from DOM/content
        SwarmCanvas.tsx            <Canvas> fixed full-viewport, z-behind, client-only
        useSwarm.ts                pure sim: node/edge state, cursor repel, settle
        negotiation.ts             edge-pulse scheduler (agents "negotiate")
        theme.ts                   palette + bloom params
      sections/                  <- one file each, self-contained, render from data
        Hero.tsx About.tsx Experience.tsx Projects.tsx Awards.tsx Skills.tsx Contact.tsx
      chat/
        ChatTerminal.tsx           ported terminal UI (boot seq, stream, section reveal)
        useChat.ts                 SSE client → Worker; canned-first, live fallback
        MiniMarkdown.tsx           ported
      nav/
        StickyNav.tsx              active section (IntersectionObserver) + progress bar
        CommandPalette.tsx         Cmd+K fuzzy jump to sections
      data/
        resume.ts                  SINGLE source of truth (ported from portfolio-v2)
        canned.ts                  canned Q&A + suggested questions (ported)
        systemPrompt.ts            Claude system prompt (ported)
      lib/ cn.ts, useReducedMotion.ts, useInView.ts
  worker/                        <- NEW Cloudflare Worker (separate deploy)
    src/index.ts                   POST /chat: SSE stream from Claude Haiku; canned + CORS
    wrangler.toml                  ANTHROPIC_API_KEY as secret; route/name
  docs/                          <- BUILD OUTPUT (git-tracked, served by Pages). .nojekyll added.
  specs/                         <- this doc (NOT under docs/, so build won't wipe it)
  (old site files remain at root, ignored once Pages points to /docs)
```

**Hard boundaries**
- `three/` never imports from `sections/` or `data/`. Swarm is a pure visual layer.
- `data/resume.ts` is the only content source; sections are dumb renderers.
- Chat transport (`useChat`) is isolated from chat UI (`ChatTerminal`); swap Worker URL without touching UI.

## 4. The Agent Swarm (signature)

- **Model:** ~70–110 nodes in 3D space. Instanced mesh (1 draw call) for node spheres;
  `LineSegments` for edges. Edge set precomputed by proximity (like portfolio-v2's SVG version, but 3D + live).
- **Motion:** idle slow drift (curl-ish noise). Cursor within radius repels nodes; spring back to home.
- **"Negotiation":** `negotiation.ts` periodically fires a pulse that travels an edge cyan→violet
  (emissive lerp) — the literal multi-agent metaphor.
- **Post:** `@react-three/postprocessing` Bloom for glow. Tone-mapped near-black bg.
- **Scroll coupling:** swarm dims / recedes on scroll so section text stays readable (opacity + fog by scrollY).
- **Perf:** capped node count, instancing, `frameloop="demand"`-style throttling where possible,
  pause on `document.hidden`, DPR clamp (max 2).
- **Fallbacks (content works with zero 3D):**
  - `prefers-reduced-motion` → static dim node field (no animation).
  - No WebGL / mobile-low → CSS radial-gradient + optional static SVG constellation (port the SVG backdrop as the fallback).

## 5. AI Chat

- **UI (ported):** terminal card in hero — boot sequence, `>>>` prompt, streaming cursor,
  suggested-question chips, auto-scroll of the page to a revealed section.
- **Transport (`useChat`):**
  1. On submit, check `canned.ts` for a match → stream it instantly client-side (no network). Fast, free, always works.
  2. Otherwise POST to the **Worker** `/chat` (SSE). Stream `delta` tokens; honor `reveal` (scrollIntoView) and `done` events.
  3. On Worker error / offline → graceful message + suggested chips + email.
- **Worker (`worker/src/index.ts`):**
  - `POST /chat`, body `{ messages }`. Streams Server-Sent Events: `delta`, `reveal`, `done`, `error`.
  - Calls Claude **`claude-haiku-4-5-20251001`**, `max_tokens` ~600, system = ported `systemPrompt`
    (with `cache_control` ephemeral). Same SSE shape the ported route already used.
  - `ANTHROPIC_API_KEY` stored via `wrangler secret` — never in the static site.
  - CORS: allow `https://sreehari59.github.io` (+ localhost dev origin). Handle preflight `OPTIONS`.
  - Canned matching also server-side as a cheap short-circuit.
- **Config:** Worker base URL injected at build via `VITE_CHAT_URL` env (falls back to canned-only if unset,
  so the site is fully functional even before the Worker is deployed).

## 6. Navigation

- **StickyNav:** top bar, links = sections, active state via IntersectionObserver, thin scroll-progress bar.
  Social + résumé (PDF) buttons. Mobile: condensed / menu.
- **Cmd+K palette:** fuzzy list of sections (+ "Download résumé", "Email"). Enter = smooth-scroll. Esc closes.
- Smooth scroll respects reduced-motion.

## 7. Content (ported, from resume + portfolio-v2/lib/data.ts)

- **Hero:** name, gradient surname, tagline, availability pill, the AI chat terminal, scroll cue.
- **About:** shortBio + quick facts (location, focus), languages (EN C1, DE B1, Malayalam native), education.
- **Experience:** vertical timeline — Self-employed/SartechLabs, DPS-UnternehmerTUM/DRK, Marburg&ZEW, Würth, TCS.
  Each: role, company, dates, bullets, tech chips.
- **Projects:** ForgeAlign, AlphaGuide, ProjectDebAIt, Hemy, SeaPulse, InsightDesk. Cards, accent gradients, stack chips.
- **🏆 Awards:** all 8 hackathon wins, WEF Davos highlighted. Strong visual band — the differentiator.
- **Skills:** grouped text chips (Languages / AI & ML / Data & Cloud / Frontend / Tools). No hotlinked logos.
- **Contact:** email, phone, LinkedIn, GitHub, location, résumé PDF.

## 8. Accessibility & quality

- Semantic landmarks (`header/nav/main/section/footer`), keyboard nav, visible focus rings, aria on nav + palette.
- Contrast checked vs `#06080F`. Reduced-motion + no-WebGL paths (§4). Content fully usable without the canvas.
- Light/dark: **dark-first** (primary, tuned for the swarm). Port the theme toggle for a light variant; if the light variant fights the bloom/palette, ship dark-only for v1 and defer light.

## 9. Testing

- **Vitest + React Testing Library:**
  - `useSwarm` pure math (repel vector, settle toward home) — unit tests.
  - Nav active-state, Cmd+K opens/jumps, every section renders from `resume.ts`.
  - Chat: canned match streams without network (mock); Worker error → fallback message.
  - Reduced-motion → canvas swapped for static fallback.
- **Build smoke:** `vite build` succeeds; `/docs/index.html` + `.nojekyll` emitted; base paths correct.
- **Worker:** unit test SSE framing + CORS headers + canned short-circuit (Vitest / Miniflare).

## 10. Deployment

1. `web/` builds to repo `/docs` (`base:'/'` — user page served at domain root). `.nojekyll` committed in `/docs`.
2. GitHub Pages: set source = `main` branch, `/docs` folder (one-time repo setting — user action, noted in README).
3. Worker: `cd worker && wrangler deploy`; `wrangler secret put ANTHROPIC_API_KEY`. Copy the Worker URL into
   `web/.env` as `VITE_CHAT_URL`, rebuild, commit `/docs`.
4. Old root site files remain as backup; Pages ignores them once pointed at `/docs`.

## 11. Out of scope (YAGNI)

Blog, CMS, i18n, contact-form backend, analytics rework (GTM can be re-added later), rebuilding portfolio-v2's
Next.js API. No custom domain (keeps `sreehari59.github.io`).

## 12. Risks / notes

- **Static + live chat:** solved by the Worker; site degrades to canned-only if Worker down or `VITE_CHAT_URL` unset.
- **API cost/abuse:** Haiku is cheap; add a light rate-limit / max_tokens cap in the Worker. Key only in Worker secret.
- **3D perf on low-end/mobile:** capped nodes + DPR clamp + fallback path.
- **R3F in a fresh Vite app:** client-only, no SSR concerns (Vite SPA). Simpler than Next dynamic-import dance.
