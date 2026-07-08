import { Reveal, SectionHeading } from "@/components/Reveal";
import { profile, education, languages } from "@/data/resume";
import { MapPin, GraduationCap, Languages as LangIcon } from "lucide-react";

export function About() {
  return (
    <section id="about" className="relative mx-auto max-w-5xl px-6 py-24">
      <SectionHeading index="01" title="About" />
      <div className="grid gap-10 md:grid-cols-5">
        <Reveal className="md:col-span-3">
          <p className="text-lg leading-relaxed text-zinc-300">{profile.shortBio}</p>
          <p className="mt-6 leading-relaxed text-zinc-400">
            I care about shipping AI that actually reaches production — agent runtimes, retrieval
            that holds up on millions of documents, and interfaces people enjoy using. I move
            fast (the hackathon shelf is proof) but build to last.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 text-sm text-zinc-400">
            <MapPin className="size-4 text-cyan-400" />
            {profile.location}
          </div>
        </Reveal>

        <Reveal delay={0.15} className="md:col-span-2 space-y-6">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
              <GraduationCap className="size-4 text-violet-400" /> Education
            </div>
            <ul className="space-y-3">
              {education.map((e) => (
                <li key={e.school}>
                  <div className="text-sm font-medium text-zinc-200">{e.degree}</div>
                  <div className="text-xs text-zinc-400">
                    {e.school} · {e.start}–{e.end}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
              <LangIcon className="size-4 text-cyan-400" /> Languages
            </div>
            <ul className="space-y-1.5">
              {languages.map((l) => (
                <li key={l.name} className="flex justify-between text-sm">
                  <span className="text-zinc-200">{l.name}</span>
                  <span className="text-zinc-500">{l.level}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
