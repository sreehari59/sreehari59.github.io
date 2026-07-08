# Sreehari · Portfolio v2 ("dev" site)

An AI-native personal site for a full-stack AI engineer. The landing page is a VS Code–style IDE — visitors browse the work as if it were an open project (files, tabs, sidebar), with an AI assistant in a side panel that answers questions and reveals the relevant "file" as it talks.

Built with Next.js 16 (App Router, **static export**) · React 19 · TypeScript · Tailwind v4 · Motion (Framer Motion).

This is one of two sites behind the audience gate at the repo root — see the [root README](../../README.md) for how it fits together. It's served at `/dev/` (this app's `basePath`).

## Highlights

- **VS Code–style IDE shell.** Activity bar, file-tree sidebar, editor tabs and status bar; an AI chat panel streams responses over SSE with suggestion pills.
- **Hybrid AI backend.** A pre-canned response layer answers common questions instantly with zero API cost; novel questions POST to the shared Cloudflare Worker (`apps/worker`), which calls Claude Haiku 4.5.
- **Live section reveals.** When the AI talks about projects/experience/awards, the page smoothly scrolls to that section.
- **Animated neural backdrop.** Procedural SVG nodes + edges that breathe behind the hero.
- **Scroll-driven timeline.** The experience section has a scroll-linked progress line (`useScroll` + `useTransform`).
- **Motion everywhere, but quietly.** Reveal-on-scroll, magnetic hover, layout animations on chat messages.

## Project structure

```
app/
├─ layout.tsx              Geist fonts + global metadata
├─ page.tsx                IDE landing page composition
└─ classic/page.tsx        Terminal-style chat hero (alternate landing)
components/
├─ Navigation.tsx
├─ chat/
│  ├─ ChatHero.tsx         Streaming chat UI (classic route)
│  └─ MiniMarkdown.tsx     Tiny bold + link markdown renderer
├─ ide/                    IDE shell: chrome, editor, file tree, chat panel
├─ sections/               Projects · Experience · Awards · Skills · Contact
└─ ui/
   ├─ NeuralBackdrop.tsx
   ├─ Reveal.tsx           Reveal + SectionHeader primitives
   └─ BrandIcons.tsx
lib/
├─ data.ts                 Re-exports content from @portfolio/content, adds this
│                          site's own project accent colors
├─ canned-responses.ts     Re-exports the shared canned Q&A from @portfolio/content
└─ cn.ts                   tailwind-merge helper
```

Resume data, canned Q&A and the chat system prompt themselves live in `packages/content` at the repo root (shared with `apps/web` and `apps/worker`) — see [`packages/content`](../../packages/content).

## Setup

From the **repo root** (this app is an npm workspace, not a standalone project):

```bash
npm install
cp apps/dev/.env.local.example apps/dev/.env.local
# add NEXT_PUBLIC_CHAT_URL (optional — site still works on canned answers without it)
npm run dev -w @portfolio/dev
```

Open http://localhost:3000/dev.

## How the chat works

This app is a **static export** — there is no Next.js server route. Chat is client-side:

1. `ChatPanel` / `ChatHero` checks the last user message against the canned Q&A (from `@portfolio/content/canned`). If one matches, it streams the canned paragraphs as fake-typed deltas — zero API calls — and reveals the matching section.
2. Otherwise, if `NEXT_PUBLIC_CHAT_URL` is set, it POSTs to the shared Cloudflare Worker (`apps/worker`), which calls `claude-haiku-4-5-20251001` with the system prompt (built from the same shared content) and streams the response back over SSE.
3. If no chat URL is configured, or the Worker errors, it falls back to a canned message pointing at email/LinkedIn.

## Adding / editing content

- **Resume content:** edit `packages/content/src/resume.ts` at the repo root — it's shared by this site, `apps/web`, and `apps/worker`.
- **Canned answers:** edit `packages/content/src/canned.ts`. Each entry has a `match` predicate, response paragraphs, and an optional `reveal` section ID.
- **This site's own accent colors:** `lib/data.ts` (`projectAccents`).
- **Colors / theme:** `app/globals.css` (Tailwind v4 `@theme` tokens) and the gradient definitions in section components.

## Build / deploy

```bash
npm run build -w @portfolio/dev   # static export -> apps/dev/out
```

This app is built as part of the repo-root `npm run build`, which also runs `apps/web` and assembles both into `/docs` for GitHub Pages. See the [root README](../../README.md) for the full deploy flow.

## Notes

- Built against Next.js 16.2 — async request APIs, Turbopack by default.
- `output: "export"` + `basePath: "/dev"` in `next.config.ts` — no server runtime, so no Node API routes here.
- Motion is imported from `motion/react` (the rebranded `framer-motion`).
- `lucide-react@1` removed brand icons, so GitHub and LinkedIn marks live in `components/ui/BrandIcons.tsx`.
