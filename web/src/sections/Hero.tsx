import { motion } from "motion/react";
import { profile } from "@/data/resume";
import { ChatTerminal } from "@/chat/ChatTerminal";

const titles = ["Full Stack AI Engineer", "Multi-Agent Systems", "RAG & LLMOps", "GenAI Product Builder"];

export function Hero() {
  const [first, ...rest] = profile.name.split(" ");
  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 pb-16 pt-28"
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/[0.06] px-3 py-1 font-mono text-xs text-cyan-300/90"
      >
        <span className="size-1.5 animate-pulse rounded-full bg-cyan-400" />
        Available for full-stack AI engineering
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.05 }}
        className="max-w-4xl text-center font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
      >
        {first} <span className="text-gradient">{rest.join(" ")}</span>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-mono text-sm text-zinc-400"
      >
        {titles.map((t, i) => (
          <span key={t} className="inline-flex items-center gap-2">
            {i > 0 && <span className="text-cyan-400/50">·</span>}
            {t}
          </span>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25 }}
        className="mt-6 max-w-2xl text-center leading-relaxed text-zinc-400"
      >
        {profile.tagline}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="mt-10 w-full"
      >
        <ChatTerminal />
      </motion.div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.7 }}
        className="mt-12 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-zinc-500 transition-colors hover:text-zinc-300"
      >
        <span className="block h-px w-8 bg-zinc-700" />
        scroll to explore
      </motion.a>
    </section>
  );
}
