import { Reveal, SectionHeading } from "@/components/Reveal";
import { projects } from "@/data/resume";
import { Chip } from "@/components/Chip";
import { ArrowUpRight } from "lucide-react";

export function Projects() {
  return (
    <section id="projects" className="relative mx-auto max-w-6xl px-6 py-24">
      <SectionHeading index="03" title="Projects" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <Reveal key={p.name} delay={(i % 3) * 0.08}>
            <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/20">
              <div
                className={`absolute inset-x-0 -top-px h-px bg-gradient-to-r ${p.accent} opacity-60`}
              />
              <div
                className={`pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-gradient-to-br ${p.accent} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20`}
              />
              <div className="flex items-start justify-between">
                <h3 className="font-display text-xl font-semibold text-white">{p.name}</h3>
                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-zinc-500 transition-colors hover:text-cyan-300"
                    aria-label={`Open ${p.name}`}
                  >
                    <ArrowUpRight className="size-5" />
                  </a>
                )}
              </div>
              <p
                className={`mt-1 bg-gradient-to-r ${p.accent} bg-clip-text text-sm font-medium text-transparent`}
              >
                {p.tagline}
              </p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400">{p.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.stack.map((s) => (
                  <Chip key={s}>{s}</Chip>
                ))}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
