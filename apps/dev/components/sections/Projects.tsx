"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/data";
import { Reveal, SectionHeader } from "../ui/Reveal";

export function Projects() {
  return (
    <section id="projects" className="relative py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Projects"
          title="Things I've shipped"
          description="A mix of production work, hackathon wins and open experiments — all built on multi-agent runtimes, RAG and modern web stacks."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.05}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="group relative h-full rounded-2xl border border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02] p-6 overflow-hidden"
              >
                <div
                  className={`absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${p.accent} blur-xl -z-10`}
                  style={{ opacity: 0.0 }}
                />
                <div
                  className={`absolute inset-px rounded-2xl opacity-0 group-hover:opacity-15 transition-opacity duration-500 bg-gradient-to-br ${p.accent}`}
                />

                <div className="relative flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">{p.name}</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{p.tagline}</p>
                  </div>
                  <span
                    className={`size-8 rounded-full bg-gradient-to-br ${p.accent} grid place-items-center text-black opacity-80 group-hover:opacity-100 group-hover:rotate-45 transition`}
                  >
                    <ArrowUpRight className="size-4" />
                  </span>
                </div>
                <p className="relative text-zinc-700 dark:text-zinc-300/90 leading-relaxed text-[15px]">
                  {p.description}
                </p>
                <div className="relative mt-5 flex flex-wrap gap-1.5">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="font-mono text-[10.5px] uppercase tracking-wider text-zinc-600 bg-black/[0.04] border border-black/10 dark:text-zinc-400 dark:bg-white/[0.04] dark:border-white/10 rounded-md px-2 py-0.5"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
