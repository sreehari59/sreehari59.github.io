import { Reveal, SectionHeading } from "@/components/Reveal";
import { profile } from "@/data/resume";
import { Mail, Phone, Linkedin, Github, MapPin } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="relative mx-auto max-w-5xl px-6 py-24">
      <SectionHeading index="06" title="Contact" />
      <Reveal>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-8 sm:p-10">
          <h3 className="font-display text-2xl font-semibold text-white sm:text-3xl">
            Let's build something intelligent.
          </h3>
          <p className="mt-3 max-w-xl text-zinc-400">
            Open to full-stack AI engineering work — agent systems, RAG pipelines, and production
            apps end-to-end. Remote or hybrid across the EU.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <a
              href={`mailto:${profile.email}`}
              className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-cyan-400/40 hover:bg-cyan-400/[0.05]"
            >
              <Mail className="size-5 text-cyan-300" />
              <span className="truncate text-sm text-zinc-200">{profile.email}</span>
            </a>
            <a
              href={`tel:${profile.phone.replace(/\s/g, "")}`}
              className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-cyan-400/40 hover:bg-cyan-400/[0.05]"
            >
              <Phone className="size-5 text-violet-300" />
              <span className="text-sm text-zinc-200">{profile.phone}</span>
            </a>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-200 transition-colors hover:border-white/25 hover:text-white"
            >
              <Linkedin className="size-4" /> LinkedIn
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-200 transition-colors hover:border-white/25 hover:text-white"
            >
              <Github className="size-4" /> GitHub
            </a>
            <span className="inline-flex items-center gap-2 text-sm text-zinc-500">
              <MapPin className="size-4" /> {profile.location}
            </span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
