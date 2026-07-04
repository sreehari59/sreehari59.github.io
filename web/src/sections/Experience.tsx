import { Reveal, SectionHeading } from "@/components/Reveal";
import { experience } from "@/data/resume";
import { Chip } from "@/components/Chip";

export function Experience() {
  return (
    <section id="experience" className="relative mx-auto max-w-5xl px-6 py-24">
      <SectionHeading index="02" title="Experience" />
      <div className="relative">
        {/* timeline spine */}
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-cyan-400/40 via-white/10 to-transparent md:left-[9px]" />
        <div className="space-y-10">
          {experience.map((e, i) => (
            <Reveal key={e.company} delay={i * 0.05}>
              <div className="relative pl-8 md:pl-10">
                <span className="absolute left-0 top-1.5 size-3.5 rounded-full border-2 border-cyan-400 bg-[#06080f] shadow-[0_0_12px_rgba(34,211,238,0.6)] md:size-[18px]" />
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="text-lg font-semibold text-white">{e.role}</h3>
                  <span className="font-mono text-xs text-zinc-500">
                    {e.start} — {e.end}
                  </span>
                </div>
                <div className="mt-0.5 text-sm text-cyan-300/90">{e.company}</div>
                <div className="text-xs text-zinc-500">{e.location}</div>
                <ul className="mt-3 space-y-1.5">
                  {e.bullets.map((b, j) => (
                    <li key={j} className="flex gap-2 text-sm leading-relaxed text-zinc-400">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-violet-400/70" />
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {e.stack.map((s) => (
                    <Chip key={s}>{s}</Chip>
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
