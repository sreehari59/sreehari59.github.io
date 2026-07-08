"use client";

import { motion } from "motion/react";
import { Trophy, Award as AwardIcon } from "lucide-react";
import { awards } from "@/lib/data";
import { Reveal, SectionHeader } from "../ui/Reveal";

export function Awards() {
  return (
    <section id="awards" className="relative py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          eyebrow="Hackathon record"
          title="Eight podiums across Switzerland & Germany"
          description="From the World Economic Forum in Davos to Würth Elektronik in Karlsruhe — a habit of shipping working AI in a weekend."
        />

        <div className="space-y-3">
          {awards.map((a, i) => (
            <Reveal key={`${a.date}-${a.title}`} delay={i * 0.04}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`group relative flex items-center gap-4 rounded-2xl border px-4 sm:px-6 py-4 transition ${
                  a.highlight
                    ? "border-emerald-500/40 bg-emerald-400/[0.08] dark:border-emerald-400/30 dark:bg-emerald-400/[0.04]"
                    : "border-black/10 bg-black/[0.02] hover:border-black/20 dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-white/20"
                }`}
              >
                <div
                  className={`size-10 shrink-0 rounded-xl grid place-items-center ${
                    a.highlight
                      ? "bg-gradient-to-br from-emerald-400 to-cyan-400 text-black"
                      : "bg-black/[0.05] text-zinc-700 dark:bg-white/[0.05] dark:text-zinc-300"
                  }`}
                >
                  {a.highlight ? <Trophy className="size-5" /> : <AwardIcon className="size-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-zinc-900 dark:text-white font-medium leading-snug">{a.title}</p>
                  <p className="text-sm text-zinc-500 mt-0.5">{a.location}</p>
                </div>
                <span className="font-mono text-xs uppercase tracking-widest text-zinc-500 shrink-0">
                  {a.date}
                </span>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
