"use client";

import { useCallback, useRef, useState } from "react";
import {
  X,
  RotateCcw,
  ArrowLeftRight,
  Plus,
  ArrowUp,
  Sun,
  Moon,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useIDE } from "../IDEContext";
import { MiniMarkdown } from "@/components/chat/MiniMarkdown";
import { suggestedQuestions, findCanned } from "@/lib/canned-responses";
import { FILES, type FileId } from "../fileConfig";
import { cn } from "@/lib/cn";
import { useBreakpoint } from "@/lib/useMediaQuery";

// ─── constants ────────────────────────────────────────────────────────────────

const DEFAULT_W = 340;
const EXPANDED_W = 600;
const MIN_W = 240;

// External chat backend (shared Cloudflare Worker). Unset → canned-only mode.
const CHAT_URL = process.env.NEXT_PUBLIC_CHAT_URL;

// ─── theme tokens ─────────────────────────────────────────────────────────────

const THEMES = {
  dark: {
    panel:        "bg-[#12151b] border-l border-white/[0.06]",
    panelMobile:  "bg-[#12151b]",
    header:       "border-b border-white/[0.06] bg-[#12151b]",
    title:        "text-white/90",
    iconBtn:      "text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.06]",
    // empty state
    mascotRing:   "bg-[#e87052]/10",
    suggestLabel: "text-zinc-600",
    suggestion:   "border border-white/[0.07] bg-white/[0.02] text-zinc-400 hover:border-[#e87052]/40 hover:text-zinc-100 hover:bg-white/[0.05]",
    // messages
    userBubble:   "bg-white/[0.07] border border-white/[0.06] text-zinc-200",
    userLabel:    "text-zinc-500",
    userAvatar:   "bg-zinc-700 text-zinc-300",
    assistLabel:  "text-zinc-500",
    assistText:   "text-zinc-300",
    divider:      "bg-white/[0.04]",
    // input
    inputSection: "border-t border-white/[0.06] bg-[#0e111a]",
    inputOuter:   "border border-white/[0.10] bg-[#1c2029] focus-within:border-[#e87052]/50",
    inputText:    "text-zinc-200 placeholder:text-zinc-600 caret-[#e87052]",
    toolbarSep:   "border-t border-white/[0.06]",
    toolBtn:      "text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.06]",
    slashHint:    "border border-white/[0.08] text-zinc-600",
    fileChip:     "bg-white/[0.06] border border-white/[0.07] text-zinc-500",
    fileChipX:    "text-zinc-700",
    editLabel:    "text-zinc-700",
    sendActive:   "bg-[#e87052] text-black hover:brightness-110",
    sendDisabled: "bg-zinc-800 text-zinc-600 opacity-50",
    cursor:       "bg-[#e87052]/75",
    dragLine:     "group-hover:bg-[#e87052]/50",
    dragLineOn:   "bg-[#e87052]",
  },
  light: {
    panel:        "bg-[#f6f7f9] border-l border-black/[0.08]",
    panelMobile:  "bg-[#f6f7f9]",
    header:       "border-b border-black/[0.08] bg-white",
    title:        "text-gray-900",
    iconBtn:      "text-gray-400 hover:text-gray-700 hover:bg-black/[0.05]",
    // empty state
    mascotRing:   "bg-[#e87052]/08",
    suggestLabel: "text-gray-400",
    suggestion:   "border border-gray-200 bg-white text-gray-600 hover:border-[#e87052]/50 hover:text-gray-900 hover:bg-orange-50 shadow-sm",
    // messages
    userBubble:   "bg-[#e87052]/10 border border-[#e87052]/20 text-gray-800",
    userLabel:    "text-gray-400",
    userAvatar:   "bg-gray-200 text-gray-600",
    assistLabel:  "text-gray-400",
    assistText:   "text-gray-700",
    divider:      "bg-black/[0.06]",
    // input
    inputSection: "border-t border-black/[0.08] bg-white",
    inputOuter:   "border border-gray-200 bg-white focus-within:border-[#e87052]/60 shadow-sm",
    inputText:    "text-gray-800 placeholder:text-gray-400 caret-[#e87052]",
    toolbarSep:   "border-t border-gray-100",
    toolBtn:      "text-gray-400 hover:text-gray-600 hover:bg-gray-100",
    slashHint:    "border border-gray-200 text-gray-400",
    fileChip:     "bg-gray-100 border border-gray-200 text-gray-500",
    fileChipX:    "text-gray-300",
    editLabel:    "text-gray-300",
    sendActive:   "bg-[#e87052] text-white hover:brightness-105",
    sendDisabled: "bg-gray-200 text-gray-400 opacity-60",
    cursor:       "bg-[#e87052]/75",
    dragLine:     "group-hover:bg-[#e87052]/50",
    dragLineOn:   "bg-[#e87052]",
  },
} as const;

type ChatTheme = keyof typeof THEMES;

// ─── tiny SVG components ───────────────────────────────────────────────────────

function AnthropicMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <g transform="translate(12,12)">
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <rect
            key={a}
            x="-1.15" y="-8.5" width="2.3" height="8.5" rx="1.15"
            transform={`rotate(${a})`}
          />
        ))}
        <circle r="1.7" />
      </g>
    </svg>
  );
}

function ClaudeMascot({ theme }: { theme: ChatTheme }) {
  const S = 5;
  // 0 = transparent · 1 = salmon · 2 = dark (visor/eyes)
  const G = [
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,2,2,1,1,2,2,1,1],
    [1,1,2,2,1,1,2,2,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,0],
    [0,0,1,1,0,0,1,1,0,0],
    [0,0,1,1,0,0,1,1,0,0],
    [0,1,1,1,0,0,1,1,1,0],
  ];
  const W = G[0].length * S;
  const H = G.length * S;
  const eyeColor = theme === "light" ? "#1f2937" : "#111318";
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden>
      {G.map((row, y) =>
        row.map((cell, x) =>
          cell ? (
            <rect
              key={`${x}-${y}`}
              x={x * S} y={y * S} width={S} height={S}
              fill={cell === 2 ? eyeColor : "#e87052"}
            />
          ) : null
        )
      )}
    </svg>
  );
}

// ─── types ────────────────────────────────────────────────────────────────────

type Msg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
};

const SECTION_MAP: Record<string, FileId> = {
  projects: "projects",
  experience: "experience",
  awards: "awards",
  skills: "skills",
  contact: "contact",
  readme: "readme",
};

// ─── ChatPanel ────────────────────────────────────────────────────────────────

export function ChatPanel() {
  const { toggleChat, jumpToFile, activeFile } = useIDE();

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [width, setWidth] = useState(DEFAULT_W);
  const [expanded, setExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [chatTheme, setChatTheme] = useState<ChatTheme>("dark");

  const t = THEMES[chatTheme];
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const activeFileMeta = FILES.find((f) => f.id === activeFile);

  // On phones the panel is a full-screen sheet; on sm+ it's the resizable dock.
  const isDesktop = useBreakpoint("sm");

  // ── resize drag ─────────────────────────────────────────────────────────────

  const startResize = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      const x0 = e.clientX;
      const w0 = width;
      setIsDragging(true);
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";

      function onMove(ev: PointerEvent) {
        const maxW = Math.floor(window.innerWidth * 0.65);
        setWidth(Math.min(Math.max(w0 + (x0 - ev.clientX), MIN_W), maxW));
      }
      function onUp() {
        setIsDragging(false);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
      }
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    },
    [width]
  );

  function toggleExpand() {
    const next = !expanded;
    setExpanded(next);
    setWidth(next ? EXPANDED_W : DEFAULT_W);
  }

  // ── chat logic ───────────────────────────────────────────────────────────────

  function reset() {
    setMessages([]);
    setInput("");
    setBusy(false);
  }

  function growInput(el: HTMLTextAreaElement) {
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;

    const uid = `u-${crypto.randomUUID()}`;
    const aid = `a-${crypto.randomUUID()}`;
    const history = [
      ...messages,
      { id: uid, role: "user" as const, content: q },
    ];

    setMessages([
      ...history,
      { id: aid, role: "assistant", content: "", streaming: true },
    ]);
    setInput("");
    setBusy(true);
    if (inputRef.current) inputRef.current.style.height = "auto";

    // scroll to bottom after state flush
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 60);

    // Instant, offline-capable canned answers streamed word-by-word locally.
    const streamCannedLocal = async (
      paragraphs: string[],
      reveal?: string | null
    ) => {
      let acc = "";
      for (let p = 0; p < paragraphs.length; p++) {
        const words = paragraphs[p].match(/\S+\s*/g) ?? [paragraphs[p]];
        for (const w of words) {
          acc += w;
          const snap = acc;
          setMessages((pr) =>
            pr.map((m) => (m.id === aid ? { ...m, content: snap } : m))
          );
          scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth",
          });
          await new Promise((r) => setTimeout(r, 16));
        }
        if (p < paragraphs.length - 1) {
          acc += "\n\n";
          await new Promise((r) => setTimeout(r, 60));
        }
      }
      setMessages((pr) =>
        pr.map((m) => (m.id === aid ? { ...m, streaming: false } : m))
      );
      if (reveal) {
        const fid = SECTION_MAP[reveal];
        if (fid) setTimeout(() => jumpToFile(fid), 400);
      }
    };

    // Live answers via the shared Cloudflare Worker (SSE: delta/reveal/done/error).
    const streamFromWorker = async () => {
      const res = await fetch(CHAT_URL as string, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });
      if (!res.ok || !res.body) throw new Error();

      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      let acc = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const evts = buf.split("\n\n");
        buf = evts.pop() ?? "";

        for (const evt of evts) {
          const lines = evt.split("\n");
          const name = lines
            .find((l) => l.startsWith("event:"))
            ?.slice(6)
            .trim();
          const raw = lines
            .find((l) => l.startsWith("data:"))
            ?.slice(5)
            .trim();
          if (!name || !raw) continue;
          try {
            const d = JSON.parse(raw);
            if (name === "delta" && d.text) {
              acc = acc + d.text;
              const snap = acc;
              setMessages((p) =>
                p.map((m) => (m.id === aid ? { ...m, content: snap } : m))
              );
              scrollRef.current?.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
              });
            } else if (name === "reveal" && d.section) {
              const fid = SECTION_MAP[d.section as string];
              if (fid) setTimeout(() => jumpToFile(fid), 400);
            } else if (name === "done") {
              setMessages((p) =>
                p.map((m) =>
                  m.id === aid ? { ...m, streaming: false } : m
                )
              );
            }
          } catch {
            /* skip malformed SSE */
          }
        }
      }
      setMessages((p) =>
        p.map((m) => (m.id === aid ? { ...m, streaming: false } : m))
      );
    };

    try {
      const canned = findCanned(q);
      if (canned) {
        await streamCannedLocal(canned.paragraphs, canned.reveal);
      } else if (CHAT_URL) {
        await streamFromWorker();
      } else {
        await streamCannedLocal(
          [
            "I can only answer from a fixed set of topics on this deployment — the live model isn't wired up here.",
            "Try a suggested question below, or reach Sreehari directly at **sreeharipradeepkumar1996@gmail.com**.",
          ],
          "contact"
        );
      }
    } catch {
      setMessages((p) =>
        p.map((m) =>
          m.id === aid
            ? {
                ...m,
                streaming: false,
                content:
                  "Something went wrong. Try again or email **sreeharipradeepkumar1996@gmail.com**.",
              }
            : m
        )
      );
    } finally {
      setBusy(false);
    }
  }

  const isEmpty = messages.length === 0;

  return (
    <motion.div
      initial={isDesktop ? { opacity: 0, x: 24 } : { opacity: 0, y: "100%" }}
      animate={isDesktop ? { opacity: 1, x: 0 } : { opacity: 1, y: 0 }}
      exit={isDesktop ? { opacity: 0, x: 24 } : { opacity: 0, y: "100%" }}
      transition={{
        duration: isDesktop ? 0.2 : 0.28,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        "flex flex-col overflow-hidden",
        isDesktop
          ? cn("shrink-0 relative", t.panel)
          : cn("fixed inset-0 z-50 w-full", t.panelMobile)
      )}
      style={
        isDesktop
          ? {
              width,
              minWidth: MIN_W,
              transition: isDragging ? "none" : "width 0.18s ease",
            }
          : undefined
      }
    >
      {/* ── left-edge drag handle (desktop only) ─────────────────────────────── */}
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize chat panel"
        onPointerDown={startResize}
        className="hidden sm:block absolute left-0 top-0 bottom-0 w-2 z-30 cursor-ew-resize group"
        style={{ touchAction: "none" }}
      >
        <div
          className={cn(
            "absolute left-0.5 top-0 bottom-0 w-px transition-colors",
            isDragging ? t.dragLineOn : t.dragLine
          )}
        />
      </div>

      {/* ── header ───────────────────────────────────────────────────────────── */}
      <div
        className={cn(
          "h-10 shrink-0 flex items-center justify-between px-3 select-none",
          t.header
        )}
      >
        {/* brand */}
        <div className="flex items-center gap-2">
          <div className="size-7 grid place-items-center rounded-lg bg-[#e87052]">
            <AnthropicMark className="size-4 text-white" />
          </div>
          <span className={cn("text-[13px] font-semibold tracking-tight", t.title)}>
            Claude Code
          </span>
        </div>

        {/* actions */}
        <div className="flex items-center gap-0.5">
          {/* theme toggle */}
          <button
            type="button"
            onClick={() => setChatTheme((th) => (th === "dark" ? "light" : "dark"))}
            title={chatTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            aria-label={chatTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className={cn("size-7 grid place-items-center rounded transition", t.iconBtn)}
          >
            {chatTheme === "dark" ? (
              <Sun className="size-[14px]" />
            ) : (
              <Moon className="size-[14px]" />
            )}
          </button>

          {/* expand (desktop only) */}
          <button
            type="button"
            onClick={toggleExpand}
            title={expanded ? "Collapse" : "Expand panel"}
            aria-label={expanded ? "Collapse panel" : "Expand panel"}
            className={cn(
              "hidden sm:grid size-7 place-items-center rounded transition",
              t.iconBtn
            )}
          >
            <ArrowLeftRight className="size-[13px]" />
          </button>

          {/* new conversation */}
          <button
            type="button"
            onClick={reset}
            title="New conversation"
            aria-label="New conversation"
            className={cn("size-7 grid place-items-center rounded transition", t.iconBtn)}
          >
            <RotateCcw className="size-[13px]" />
          </button>

          {/* close */}
          <button
            type="button"
            onClick={toggleChat}
            title="Close chat"
            aria-label="Close chat"
            className={cn("size-7 grid place-items-center rounded transition", t.iconBtn)}
          >
            <X className="size-[14px]" />
          </button>
        </div>
      </div>

      {/* ── body ─────────────────────────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto scrollbar-thin"
      >
        {isEmpty ? (
          /* ── empty state ── */
          <div className="h-full flex flex-col items-center justify-center px-5 pb-4 gap-6">
            {/* mascot with subtle halo */}
            <div className={cn(
              "size-20 rounded-2xl grid place-items-center",
              t.mascotRing
            )}>
              <ClaudeMascot theme={chatTheme} />
            </div>

            {/* suggested prompts */}
            <div className="w-full space-y-1.5">
              <p className={cn(
                "text-[10px] font-mono text-center mb-2 uppercase tracking-[0.22em]",
                t.suggestLabel
              )}>
                Suggested
              </p>
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  type="button"
                  disabled={busy}
                  onClick={() => send(q)}
                  className={cn(
                    "w-full text-left text-[11.5px] px-3 py-1.5 rounded-lg transition-all disabled:opacity-40 active:scale-[0.98]",
                    t.suggestion
                  )}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* ── conversation ── */
          <div className="px-4 py-5 space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.16 }}
                >
                  {m.role === "user" ? (
                    /* user message */
                    <div className="flex flex-col gap-1.5 items-end">
                      <div className="flex items-center gap-1.5">
                        <span className={cn(
                          "text-[10px] uppercase tracking-[0.14em] font-mono",
                          t.userLabel
                        )}>
                          You
                        </span>
                        <div className={cn(
                          "size-5 rounded-full grid place-items-center shrink-0 text-[9px] font-bold",
                          t.userAvatar
                        )}>
                          U
                        </div>
                      </div>
                      <p className={cn(
                        "max-w-full text-[13px] leading-relaxed px-3.5 py-2.5 rounded-2xl rounded-br-sm",
                        t.userBubble
                      )}>
                        {m.content}
                      </p>
                    </div>
                  ) : (
                    /* assistant message */
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <AnthropicMark className="size-3.5 text-[#e87052] shrink-0" />
                        <span className={cn(
                          "text-[10px] uppercase tracking-[0.14em] font-mono",
                          t.assistLabel
                        )}>
                          Claude
                        </span>
                      </div>
                      <div className={cn("pl-5 text-[13px] leading-relaxed", t.assistText)}>
                        {m.content ? (
                          <MiniMarkdown text={m.content} theme={chatTheme} />
                        ) : null}
                        {m.streaming && (
                          <span
                            className={cn(
                              "inline-block w-[6px] h-[14px] -mb-[2px] ml-0.5 rounded-sm animate-pulse",
                              t.cursor
                            )}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── input area ───────────────────────────────────────────────────────── */}
      <div className={cn("shrink-0 px-3 py-3", t.inputSection)}>
        <div
          className={cn(
            "rounded-xl overflow-hidden transition-colors",
            t.inputOuter
          )}
        >
          {/* textarea */}
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              growInput(e.target);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder={
              busy
                ? "Thinking…"
                : isDesktop
                ? "Ask me anything…"
                : "Ask me anything…"
            }
            disabled={busy}
            className={cn(
              "w-full resize-none bg-transparent text-[13px] outline-none leading-relaxed disabled:opacity-60 px-4 pt-3 pb-2",
              t.inputText
            )}
            style={{ maxHeight: 140 }}
            autoComplete="off"
            spellCheck={false}
          />

          {/* toolbar */}
          <div className={cn("flex items-center gap-1.5 px-3 pb-2.5 pt-2", t.toolbarSep)}>
            {/* new chat */}
            <button
              type="button"
              onClick={reset}
              title="New chat"
              aria-label="New chat"
              className={cn(
                "size-6 grid place-items-center rounded transition shrink-0",
                t.toolBtn
              )}
            >
              <Plus className="size-3.5" />
            </button>

            {/* slash hint */}
            <div
              aria-hidden
              className={cn(
                "h-6 px-1.5 grid place-items-center rounded text-[10px] font-mono shrink-0",
                t.slashHint
              )}
            >
              /
            </div>

            {/* active file chip */}
            {activeFileMeta && (
              <div
                className={cn(
                  "flex items-center gap-1 h-5 pl-2 pr-1.5 rounded text-[10.5px] font-mono shrink-0 max-w-[110px]",
                  t.fileChip
                )}
              >
                <span className="truncate">{activeFileMeta.filename}</span>
                <X className={cn("size-2.5 shrink-0", t.fileChipX)} />
              </div>
            )}

            <div className="flex-1" />

            {/* "Edit automatically" — only at very wide panels */}
            <span
              className={cn(
                "hidden xl:block text-[10.5px] font-mono shrink-0 mr-1",
                t.editLabel
              )}
            >
              Edit automatically
            </span>

            {/* send */}
            <button
              type="button"
              onClick={() => send(input)}
              disabled={busy || !input.trim()}
              aria-label="Send message"
              className={cn(
                "size-7 grid place-items-center rounded-lg font-bold transition shrink-0",
                busy || !input.trim() ? t.sendDisabled : t.sendActive
              )}
            >
              <ArrowUp className="size-3.5" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
