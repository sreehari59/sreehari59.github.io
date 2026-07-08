import type { Metadata } from "next";
import { IDE } from "@/components/ide/IDE";
import { profile } from "@/lib/data";

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.title}`,
  description: profile.shortBio,
};

export default function Home() {
  return (
    <>
      <IDE />
      {/* SEO-only content, available to crawlers and screen readers */}
      <div className="sr-only">
        <h1>{profile.name}</h1>
        <h2>{profile.title}</h2>
        <p>{profile.shortBio}</p>
        <p>{profile.tagline}</p>
        <p>Email: {profile.email}</p>
        <p>Location: {profile.location}</p>
        <p>
          <a href={profile.github}>GitHub</a>
          <a href={profile.linkedin}>LinkedIn</a>
          <a href="/classic">2D version</a>
        </p>
      </div>
    </>
  );
}
