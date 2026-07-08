"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../../ui/BrandIcons";
import { H1, H2, P, A, Strong } from "../editor/md";
import { profile } from "@/lib/data";

const channels = [
  {
    icon: Mail,
    label: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
    color: "#f472b6",
  },
  {
    icon: GithubIcon,
    label: "GitHub",
    value: "github.com/sreehari59",
    href: profile.github,
    color: "#a78bfa",
  },
  {
    icon: LinkedinIcon,
    label: "LinkedIn",
    value: "linkedin.com/in/sreeharipradeep",
    href: profile.linkedin,
    color: "#60a5fa",
  },
  {
    icon: Phone,
    label: "Phone",
    value: profile.phone,
    href: `tel:${profile.phone.replace(/\s/g, "")}`,
    color: "#34d399",
  },
];

export function Contact() {
  return (
    <>
      <H1 id="contact">Contact</H1>
      <P>
        I&apos;m currently available for full-stack AI engineering work —
        contract or full time, remote or hybrid in Mannheim. If you&apos;re
        building something with agents, retrieval, voice, or you just want a
        second pair of eyes on a system, I&apos;d love to hear from you.
      </P>

      <H2 id="channels">Channels</H2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-4">
        {channels.map(({ icon: Icon, label, value, href, color }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noreferrer" : undefined}
            className="group flex items-center gap-3 rounded-md border border-white/[0.06] bg-white/[0.015] hover:bg-white/[0.04] hover:border-white/[0.12] p-3 transition"
          >
            <div
              className="size-9 rounded-md grid place-items-center shrink-0"
              style={{ background: `${color}15`, color }}
            >
              <Icon className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-zinc-500">
                {label}
              </p>
              <p className="text-[13.5px] text-zinc-100 truncate group-hover:text-white">
                {value}
              </p>
            </div>
          </a>
        ))}
      </div>

      <H2 id="based-in">Based in</H2>
      <P>
        <span className="inline-flex items-center gap-2">
          <MapPin className="size-4 text-zinc-500" />
          <Strong>{profile.location}</Strong>
        </span>
        {" — "}
        comfortable working with teams across CET, GMT and IST.
      </P>

      <p className="text-[13px] text-zinc-500 mt-12 mb-8 text-center">
        Thanks for scrolling all the way down.{" "}
        <A href={`mailto:${profile.email}`}>Say hi</A>.
      </p>
    </>
  );
}
