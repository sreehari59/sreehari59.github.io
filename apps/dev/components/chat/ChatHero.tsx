"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { suggestedQuestions, findCanned } from "@/lib/canned-responses";
import { MiniMarkdown } from "./MiniMarkdown";
import { cn } from "@/lib/cn";

// External chat backend (shared Cloudflare Worker). Unset → canned-only mode.
const CHAT_URL = process.env.NEXT_PUBLIC_CHAT_URL;

type Msg = { id: string; role: "user" | "assistant"; content: string; streaming?: boolean };

const bootLines = [
  "Last login: Fri May 23 09:42:11 on ttys001",
  "sreehari@portfolio:~$ ollama run sreehari.assistant",
  "pulling manifest",
  "pulling f1cd752815fc... 100% ▕████████████████▏ 4.7 GB",
  "verifying sha256 digest",
  "writing manifest",
  "success",
];

const initialAssistantMessage: Msg = {
  id: "boot",
  role: "assistant",
  content:
    "Hi — I'm the AI assistant on Sreehari's portfolio. Ask me anything about his work, projects or hackathon record, and the relevant sections of the page will scroll into view as I answer.",
};

export function ChatHero() {
  const [messages, setMessages] = useState<Msg[]>([initialAssistantMessage]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function focusInput() {
    inputRef.current?.focus();
  }

  async function send(text: string) {
    if (!text.trim() || busy) return;
    const userMsg: Msg = { id: `u-${Date.now()}`, role: "user", content: text };
    const assistantId = `a-${Date.now()}`;
    const placeholder: Msg = { id: assistantId, role: "assistant", content: "", streaming: true };

    const history: Msg[] = [...messages, userMsg];
    setMessages([...history, placeholder]);
    setInput("");
    setBusy(true);

    const revealSection = (section: string) => {
      const el = document.getElementById(section);
      if (el) {
        setTimeout(
          () => el.scrollIntoView({ behavior: "smooth", block: "start" }),
          500,
        );
      }
    };

    // Instant, offline-capable canned answers streamed word-by-word locally.
    const streamCannedLocal = async (paragraphs: string[], reveal?: string | null) => {
      let acc = "";
      for (let p = 0; p < paragraphs.length; p++) {
        const words = paragraphs[p].match(/\S+\s*/g) ?? [paragraphs[p]];
        for (const w of words) {
          acc += w;
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: acc } : m)),
          );
          await new Promise((r) => setTimeout(r, 16));
        }
        if (p < paragraphs.length - 1) {
          acc += "\n\n";
          await new Promise((r) => setTimeout(r, 60));
        }
      }
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, streaming: false } : m)),
      );
      if (reveal) revealSection(reveal);
    };

    // Live answers via the shared Cloudflare Worker (SSE: delta/reveal/done/error).
    const streamFromWorker = async () => {
      const res = await fetch(CHAT_URL as string, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok || !res.body) throw new Error("chat request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let acc = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const evt of events) {
          const lines = evt.split("\n");
          const eventName = lines.find((l) => l.startsWith("event:"))?.slice(6).trim();
          const dataLine = lines.find((l) => l.startsWith("data:"))?.slice(5).trim();
          if (!eventName || !dataLine) continue;
          try {
            const data = JSON.parse(dataLine);
            if (eventName === "delta" && data.text) {
              acc += data.text;
              setMessages((prev) =>
                prev.map((m) => (m.id === assistantId ? { ...m, content: acc } : m)),
              );
            } else if (eventName === "reveal" && data.section) {
              revealSection(data.section);
            } else if (eventName === "done") {
              setMessages((prev) =>
                prev.map((m) => (m.id === assistantId ? { ...m, streaming: false } : m)),
              );
            }
          } catch {
            /* ignore parse errors */
          }
        }
      }
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, streaming: false } : m)),
      );
    };

    try {
      const canned = findCanned(text);
      if (canned) {
        await streamCannedLocal(canned.paragraphs, canned.reveal);
      } else if (CHAT_URL) {
        await streamFromWorker();
      } else {
        await streamCannedLocal(
          [
            "I can only answer from a fixed set of topics on this deployment — the live model isn't wired up here.",
            "Try a suggested question, or reach Sreehari directly at **sreeharipradeepkumar1996@gmail.com**.",
          ],
          "contact",
        );
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                streaming: false,
                content:
                  "Something went wrong reaching the assistant. You can still browse the page below, or email **sreeharipradeepkumar1996@gmail.com**.",
              }
            : m,
        ),
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        onClick={focusInput}
        className="rounded-lg border border-black/20 dark:border-white/10 bg-black shadow-[0_20px_60px_-20px_rgba(16,185,129,0.35)] dark:shadow-[0_20px_80px_-20px_rgba(16,185,129,0.25)] overflow-hidden font-mono"
      >
        {/* Title bar — command prompt style */}
        <div className="flex items-center gap-2 px-3 py-2 bg-zinc-900/90 border-b border-white/10 select-none">
          <div className="flex items-center gap-1.5">
            <span className="size-3 rounded-full bg-red-500/90" />
            <span className="size-3 rounded-full bg-yellow-500/90" />
            <span className="size-3 rounded-full bg-emerald-500/90" />
          </div>
          <div className="flex-1 text-center text-[11px] text-zinc-400 tracking-wide">
            sreehari@portfolio: ~ — ollama run sreehari.assistant
          </div>
          <div className="w-12" />
        </div>

        {/* Terminal body */}
        <div
          ref={scrollRef}
          className="px-4 py-3 max-h-[420px] min-h-[300px] overflow-y-auto scrollbar-thin text-[13px] leading-relaxed text-zinc-200"
        >
          {/* Boot sequence */}
          <div className="space-y-0.5 text-zinc-400">
            {bootLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15, delay: i * 0.06 }}
                className="whitespace-pre-wrap"
              >
                {line || " "}
              </motion.div>
            ))}
          </div>

          <div className="mt-3 space-y-3">
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="whitespace-pre-wrap break-words"
              >
                {m.role === "user" ? (
                  <div className="flex">
                    <span className="text-emerald-400 mr-2 shrink-0">&gt;&gt;&gt;</span>
                    <span className="text-zinc-100">{m.content}</span>
                  </div>
                ) : (
                  <div className={cn("text-zinc-200", "pl-0")}>
                    <MiniMarkdown text={m.content} />
                    {m.streaming && (
                      <span className="inline-block w-[8px] h-[14px] -mb-[2px] ml-0.5 bg-emerald-400 animate-pulse" />
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Prompt + input line */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="mt-3 flex items-center"
          >
            <span className="text-emerald-400 mr-2 shrink-0">&gt;&gt;&gt;</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={busy ? "" : "Send a message (/? for help)"}
              className="flex-1 bg-transparent outline-none border-none text-[13px] text-zinc-100 placeholder:text-zinc-600 font-mono caret-emerald-400"
              disabled={busy}
              autoComplete="off"
              spellCheck={false}
            />
            {!busy && !input && (
              <span className="inline-block w-[8px] h-[14px] -ml-[8px] bg-emerald-400 animate-pulse pointer-events-none" />
            )}
            <button type="submit" className="sr-only" disabled={busy || !input.trim()}>
              send
            </button>
          </form>
        </div>

        {/* Quick commands bar */}
        <div className="px-4 py-2 border-t border-white/10 bg-zinc-950/60 flex flex-wrap gap-2 items-center">
          <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 mr-1">
            /shortcuts
          </span>
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              type="button"
              disabled={busy}
              onClick={() => send(q)}
              className="text-[11px] font-mono rounded border border-white/10 bg-black/40 px-2 py-1 text-zinc-300 hover:border-emerald-400/40 hover:text-emerald-300 hover:bg-emerald-400/[0.05] transition disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
