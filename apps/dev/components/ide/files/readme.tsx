"use client";

import { H1, H2, P, UL, LI, A, Strong, Em, Code } from "../editor/md";
import { profile } from "@/lib/data";

export function Readme() {
  return (
    <>
      <H1 id="hi">Hi, I&apos;m Sreehari ✦</H1>
      <P>
        I&apos;m a <Strong>Full-Stack AI Engineer</Strong> based in {profile.location}.
        I design, ship, and orchestrate multi-agent AI systems end-to-end — from
        retrieval and graph search, through agent runtimes, voice & email,
        all the way to the React frontend you&apos;re reading right now.
      </P>
      <P>
        Currently a founding AI team member at{" "}
        <Em>SartechLabs</Em>, building products for clients in the UK,
        Switzerland, India and Germany.
      </P>

      <H2 id="what-i-work-on">What I work on</H2>
      <UL>
        <LI>
          <Strong>Multi-agent runtimes</Strong> — orchestrating teams of AI agents
          that call tools, talk to each other, and coordinate work.
        </LI>
        <LI>
          <Strong>Retrieval systems</Strong> — RAG, graph retrieval, vector
          stores (<Code>Qdrant</Code>, <Code>Neo4j</Code>) at million-doc scale.
        </LI>
        <LI>
          <Strong>Voice & email agents</Strong> — diarization, speaker
          identification, autonomous email handling.
        </LI>
        <LI>
          <Strong>Production React frontends</Strong> — React 19, Next.js,
          Tailwind v4, Supabase, Cloudflare Workers.
        </LI>
      </UL>

      <H2 id="a-bit-of-history">A bit of history</H2>
      <P>
        Before SartechLabs I worked at the <Strong>German Red Cross</Strong>{" "}
        (built KIRK — an agentic reporting tool that cut reporting time by 96%),
        at <Strong>ZEW Mannheim</Strong> (processed 1.4M privacy policies with
        a fine-tuned LLM), at <Strong>Würth-Gruppe</Strong> (75%-accurate
        hybrid recommendation system on 1.5M customers), and spent three years
        at <Strong>Tata Consultancy Services</Strong> as a system engineer in
        the US and Germany.
      </P>
      <P>
        I hold an <Strong>M.Sc. in Data Science</Strong> from Universität
        Mannheim, with a thesis on out-of-distribution detection for textual
        product offers using RoBERTa and contrastive learning.
      </P>

      <H2 id="recognition">Recognition</H2>
      <P>
        Seven hackathon wins to date, including the AI Hackathon at the{" "}
        <Strong>World Economic Forum</Strong> in Davos (2025). The full list is
        in <Code>awards.md</Code> — scroll down to read on.
      </P>

      <P>
        <Em>
          ↓ Scroll to continue, or jump around using the file tree on the left.
          You can also reach me via{" "}
          <A href={`mailto:${profile.email}`}>email</A>,{" "}
          <A href={profile.linkedin}>LinkedIn</A>, or{" "}
          <A href={profile.github}>GitHub</A>.
        </Em>
      </P>
    </>
  );
}
