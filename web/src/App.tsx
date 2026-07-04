import { Backdrop } from "@/three/Backdrop";
import { StickyNav } from "@/nav/StickyNav";
import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { Experience } from "@/sections/Experience";
import { Projects } from "@/sections/Projects";
import { Awards } from "@/sections/Awards";
import { Skills } from "@/sections/Skills";
import { Contact } from "@/sections/Contact";
import { profile } from "@/data/resume";

export default function App() {
  return (
    <>
      <Backdrop />
      <StickyNav />
      <main className="relative">
        <Hero />
        <div className="relative">
          {/* soft veil so text stays readable over the swarm */}
          <div className="pointer-events-none absolute inset-0 -z-[1] bg-gradient-to-b from-transparent via-[#06080f]/70 to-[#06080f]" />
          <About />
          <Experience />
          <Projects />
          <Awards />
          <Skills />
          <Contact />
        </div>
      </main>
      <footer className="border-t border-white/5 px-6 py-10 text-center text-sm text-zinc-500">
        <p>Built with React, Three.js, Tailwind & a live Claude assistant.</p>
        <p className="mt-1">
          © {new Date().getFullYear()} {profile.name}
        </p>
      </footer>
    </>
  );
}
