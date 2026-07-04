import { Reveal, SectionHeading } from "@/components/Reveal";
import { awards } from "@/data/resume";
import { Trophy, MapPin } from "lucide-react";
import { cn } from "@/lib/cn";

export function Awards() {
  return (
    <section id="awards" className="relative mx-auto max-w-5xl px-6 py-24">
      <SectionHeading index="04" title="Hackathon Wins" />
      <Reveal className="mb-8">
        <p className="text-zinc-400">
          <span className="font-semibold text-white">8 podiums</span> across Germany &
          Switzerland — including a headline finish at the{" "}
          <span className="text-cyan-300">World Economic Forum, Davos</span>.
        </p>
      </Reveal>
      <div className="grid gap-3 sm:grid-cols-2">
        {awards.map((a, i) => (
          <Reveal key={`${a.date}-${a.title}`} delay={(i % 2) * 0.06}>
            <div
              className={cn(
                "group flex h-full items-start gap-3 rounded-xl border p-4 transition-colors",
                a.highlight
                  ? "border-cyan-400/40 bg-gradient-to-br from-cyan-400/[0.08] to-violet-500/[0.06] shadow-[0_0_30px_-12px_rgba(34,211,238,0.5)]"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20",
              )}
            >
              <Trophy
                className={cn(
                  "mt-0.5 size-5 shrink-0",
                  a.highlight ? "text-cyan-300" : "text-violet-400/80",
                )}
              />
              <div>
                <div className="text-sm font-medium leading-snug text-zinc-100">{a.title}</div>
                <div className="mt-1 flex items-center gap-3 text-xs text-zinc-500">
                  <span className="font-mono">{a.date}</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3" />
                    {a.location}
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
