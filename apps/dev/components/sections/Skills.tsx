"use client";

import { motion } from "motion/react";
import { skills } from "@/lib/data";
import { Reveal, SectionHeader } from "../ui/Reveal";

export function Skills() {
  return (
    <section id="skills" className="relative py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          eyebrow="Stack"
          title="Full-stack, but AI-shaped"
          description="What I reach for day-to-day, grouped by where it lives in the system."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Object.entries(skills).map(([group, items], i) => (
            <Reveal key={group} delay={i * 0.05}>
              <div className="rounded-2xl border border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02] p-6 h-full">
                <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400/80 mb-4">
                  {group}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(items as string[]).map((s, j) => (
                    <motion.span
                      key={s}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: j * 0.025 }}
                      whileHover={{ y: -2 }}
                      className="text-sm text-zinc-800 bg-black/[0.04] hover:bg-black/[0.08] hover:text-zinc-950 border border-black/10 dark:text-zinc-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:hover:text-white dark:border-white/10 rounded-lg px-3 py-1.5 transition cursor-default"
                    >
                      {s}
                    </motion.span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
