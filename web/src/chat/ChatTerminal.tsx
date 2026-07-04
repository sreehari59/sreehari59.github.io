import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { suggestedQuestions } from "@/data/canned";
import { useChat } from "./useChat";
import { MiniMarkdown } from "./MiniMarkdown";

const bootLines = [
  "Last login: Fri Jul 04 09:42:11 on ttys001",
  "sreehari@portfolio:~$ ollama run sreehari.assistant",
  "pulling manifest",
  "pulling f1cd752815fc... 100% ▕████████████████▏ 4.7 GB",
  "verifying sha256 digest",
  "writing manifest",
  "success",
];

export function ChatTerminal() {
  const { messages, busy, send } = useChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        onClick={() => inputRef.current?.focus()}
        className="overflow-hidden rounded-xl border border-white/10 bg-black/80 font-mono shadow-[0_25px_80px_-30px_rgba(34,211,238,0.4)] backdrop-blur-sm"
      >
        {/* title bar */}
        <div className="flex select-none items-center gap-2 border-b border-white/10 bg-zinc-900/90 px-3 py-2">
          <div className="flex items-center gap-1.5">
            <span className="size-3 rounded-full bg-red-500/90" />
            <span className="size-3 rounded-full bg-yellow-500/90" />
            <span className="size-3 rounded-full bg-emerald-500/90" />
          </div>
          <div className="flex-1 text-center text-[11px] tracking-wide text-zinc-400">
            sreehari@portfolio: ~ — ollama run sreehari.assistant
          </div>
          <div className="w-12" />
        </div>

        {/* body */}
        <div
          ref={scrollRef}
          className="scrollbar-thin max-h-[380px] min-h-[280px] overflow-y-auto px-4 py-3 text-[13px] leading-relaxed text-zinc-200"
        >
          <div className="space-y-0.5 text-zinc-500">
            {bootLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15, delay: i * 0.06 }}
                className="whitespace-pre-wrap"
              >
                {line || " "}
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
                    <span className="mr-2 shrink-0 text-cyan-400">&gt;&gt;&gt;</span>
                    <span className="text-zinc-100">{m.content}</span>
                  </div>
                ) : (
                  <div className="text-zinc-200">
                    <MiniMarkdown text={m.content} />
                    {m.streaming && (
                      <span className="ml-0.5 -mb-[2px] inline-block h-[14px] w-[8px] animate-pulse bg-cyan-400" />
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
              setInput("");
            }}
            className="mt-3 flex items-center"
          >
            <span className="mr-2 shrink-0 text-cyan-400">&gt;&gt;&gt;</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={busy ? "" : "Ask about Sreehari…"}
              className="flex-1 border-none bg-transparent font-mono text-[13px] text-zinc-100 caret-cyan-400 outline-none placeholder:text-zinc-600"
              disabled={busy}
              autoComplete="off"
              spellCheck={false}
              aria-label="Ask the portfolio assistant a question"
            />
          </form>
        </div>

        {/* quick commands */}
        <div className="flex flex-wrap items-center gap-2 border-t border-white/10 bg-zinc-950/60 px-4 py-2">
          <span className="mr-1 text-[10px] uppercase tracking-[0.2em] text-zinc-600">/ask</span>
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              type="button"
              disabled={busy}
              onClick={() => send(q)}
              className="rounded border border-white/10 bg-black/40 px-2 py-1 font-mono text-[11px] text-zinc-300 transition-colors hover:border-cyan-400/40 hover:bg-cyan-400/[0.05] hover:text-cyan-300 disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
