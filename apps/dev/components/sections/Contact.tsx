"use client";

import { motion } from "motion/react";
import { Mail, MapPin } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../ui/BrandIcons";
import { profile } from "@/lib/data";
import { Reveal } from "../ui/Reveal";

export function Contact() {
  return (
    <section id="contact" className="relative py-28 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400/80 mb-4">
            Let&apos;s build something
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-zinc-900 dark:text-white tracking-tight">
            Available for full-stack <br className="hidden sm:block" />
            <span className="bg-gradient-to-br from-emerald-500 to-cyan-500 dark:from-emerald-300 dark:to-cyan-300 bg-clip-text text-transparent">
              AI engineering work.
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed max-w-xl mx-auto">
            Multi-agent systems, RAG pipelines, voice agents, full-stack apps — solo or as part of your AI team.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <motion.a
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 text-black px-6 py-3 font-medium hover:brightness-110 transition"
            >
              <Mail className="size-4" />
              {profile.email}
            </motion.a>

            <motion.a
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-black/[0.03] text-zinc-800 hover:border-black/30 hover:bg-black/[0.06] dark:border-white/15 dark:bg-white/[0.03] dark:text-zinc-200 dark:hover:border-white/30 dark:hover:bg-white/[0.06] px-5 py-3 transition"
            >
              <LinkedinIcon className="size-4" />
              LinkedIn
            </motion.a>

            <motion.a
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-black/[0.03] text-zinc-800 hover:border-black/30 hover:bg-black/[0.06] dark:border-white/15 dark:bg-white/[0.03] dark:text-zinc-200 dark:hover:border-white/30 dark:hover:bg-white/[0.06] px-5 py-3 transition"
            >
              <GithubIcon className="size-4" />
              GitHub
            </motion.a>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-10 inline-flex items-center gap-2 text-sm text-zinc-500">
            <MapPin className="size-4" />
            {profile.location}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
