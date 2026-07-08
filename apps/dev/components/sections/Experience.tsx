"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { experience } from "@/lib/data";
import { Reveal, SectionHeader } from "../ui/Reveal";

export function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 30%"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="experience" className="relative py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          eyebrow="Experience"
          title="Seven years building, three years AI-shaped"
          description="From TCS to founding team. A path that started in automation and ML deployment, then pivoted hard into agentic AI."
        />

        <div ref={ref} className="relative mt-16 pl-8 sm:pl-12">
          <div className="absolute left-2 sm:left-4 top-0 bottom-0 w-px bg-black/10 dark:bg-white/10" />
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-2 sm:left-4 top-0 w-px bg-gradient-to-b from-emerald-400 via-cyan-400 to-transparent"
          />

          <div className="space-y-14">
            {experience.map((e, i) => (
              <Reveal key={`${e.company}-${e.start}`} delay={i * 0.04}>
                <div className="relative">
                  <span className="absolute -left-[26px] sm:-left-[34px] top-1.5 size-3 rounded-full bg-emerald-500 ring-4 ring-emerald-500/15 dark:bg-emerald-400 dark:ring-emerald-400/15" />

                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">{e.role}</h3>
                    <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                      {e.start} – {e.end}
                    </span>
                  </div>
                  <p className="mt-1 text-emerald-700 dark:text-emerald-300/90">
                    {e.company} <span className="text-zinc-500">· {e.location}</span>
                  </p>

                  <ul className="mt-4 space-y-2">
                    {e.bullets.map((b, j) => (
                      <li
                        key={j}
                        className="text-zinc-700 dark:text-zinc-300/90 leading-relaxed text-[15px] pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[10px] before:size-1 before:rounded-full before:bg-zinc-400 dark:before:bg-zinc-600"
                      >
                        {b}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {e.stack.map((s) => (
                      <span
                        key={s}
                        className="font-mono text-[10.5px] uppercase tracking-wider text-zinc-600 bg-black/[0.04] border border-black/10 dark:text-zinc-400 dark:bg-white/[0.04] dark:border-white/10 rounded-md px-2 py-0.5"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
