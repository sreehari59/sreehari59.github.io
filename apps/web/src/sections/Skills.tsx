import { Reveal, SectionHeading } from "@/components/Reveal";
import { skills } from "@/data/resume";

export function Skills() {
  return (
    <section id="skills" className="relative mx-auto max-w-5xl px-6 py-24">
      <SectionHeading index="05" title="Skills" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(skills).map(([group, items], i) => (
          <Reveal key={group} delay={(i % 3) * 0.07}>
            <div className="h-full rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-cyan-400/80">
                {group}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {items.map((s) => (
                  <span
                    key={s}
                    className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-sm text-zinc-200 transition-colors hover:border-cyan-400/30 hover:text-cyan-200"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
