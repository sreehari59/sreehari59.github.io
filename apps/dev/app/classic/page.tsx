import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { NeuralBackdrop } from "@/components/ui/NeuralBackdrop";
import { ChatHero } from "@/components/chat/ChatHero";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Awards } from "@/components/sections/Awards";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";
import { profile } from "@/lib/data";
import { Reveal } from "@/components/ui/Reveal";

export default function ClassicHome() {
  return (
    <main id="top" className="relative flex-1 overflow-x-hidden">
      <Navigation />

      <Link
        href="/"
        className="fixed bottom-5 right-5 z-50 rounded-full border border-emerald-500/30 dark:border-emerald-400/30 bg-emerald-400/[0.08] backdrop-blur-xl px-4 py-2 text-xs font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-300 hover:bg-emerald-400/20 transition"
      >
        ← back to 3D world
      </Link>

      <section className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-20 px-6">
        <NeuralBackdrop />

        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-400/[0.08] dark:border-emerald-400/20 dark:bg-emerald-400/[0.04] px-3 py-1 text-xs font-mono text-emerald-700 dark:text-emerald-300/90 mb-7">
            <span className="size-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
            Available for full-stack AI engineering
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h1 className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-zinc-900 dark:text-white max-w-4xl leading-[1.05]">
            {profile.name.split(" ")[0]}{" "}
            <span className="bg-gradient-to-br from-emerald-500 via-cyan-500 to-violet-500 dark:from-emerald-300 dark:via-cyan-300 dark:to-violet-300 bg-clip-text text-transparent">
              Pradeep Kumar
            </span>
          </h1>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-6 text-center text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
            {profile.tagline}
          </p>
        </Reveal>

        <Reveal delay={0.35} className="mt-12 w-full">
          <ChatHero />
        </Reveal>

        <Reveal delay={0.6}>
          <a
            href="#projects"
            className="mt-12 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition"
          >
            <span className="block w-8 h-px bg-zinc-400 dark:bg-zinc-700" />
            scroll to explore
          </a>
        </Reveal>
      </section>

      <Projects />
      <Experience />
      <Awards />
      <Skills />
      <Contact />

      <footer className="border-t border-black/5 dark:border-white/5 py-10 px-6 text-center text-sm text-zinc-500">
        <p>Built with Next.js, Motion, Tailwind & a sprinkle of Claude.</p>
        <p className="mt-1">
          © {new Date().getFullYear()} {profile.name}
        </p>
      </footer>
    </main>
  );
}
