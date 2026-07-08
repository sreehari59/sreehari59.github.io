"use client";

import { motion } from "motion/react";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./ui/BrandIcons";
import { ThemeToggle } from "./ui/ThemeToggle";
import { profile } from "@/lib/data";

const links = [
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#awards", label: "Awards" },
  { href: "#skills", label: "Stack" },
  { href: "#contact", label: "Contact" },
];

export function Navigation() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl"
    >
      <div className="flex items-center justify-between gap-3 rounded-full border border-black/10 bg-white/70 dark:border-white/10 dark:bg-black/40 backdrop-blur-xl px-3 sm:px-5 py-2">
        <a href="#top" className="flex items-center gap-2 shrink-0 group">
          <span className="size-7 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 text-black grid place-items-center font-semibold text-sm">
            S
          </span>
          <span className="hidden sm:block text-sm text-zinc-700 group-hover:text-zinc-950 dark:text-zinc-200 dark:group-hover:text-white transition">
            Sreehari
          </span>
        </a>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-zinc-600 hover:text-zinc-950 hover:bg-black/[0.06] dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/[0.06] px-3 py-1.5 rounded-full transition"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="size-8 grid place-items-center rounded-full text-zinc-600 hover:text-zinc-950 hover:bg-black/[0.06] dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/[0.06] transition"
          >
            <GithubIcon className="size-4" />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="size-8 grid place-items-center rounded-full text-zinc-600 hover:text-zinc-950 hover:bg-black/[0.06] dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/[0.06] transition"
          >
            <LinkedinIcon className="size-4" />
          </a>
          <a
            href={`mailto:${profile.email}`}
            aria-label="Email"
            className="size-8 grid place-items-center rounded-full text-zinc-600 hover:text-zinc-950 hover:bg-black/[0.06] dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/[0.06] transition"
          >
            <Mail className="size-4" />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </motion.nav>
  );
}
