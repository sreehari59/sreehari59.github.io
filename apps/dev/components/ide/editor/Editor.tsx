"use client";

import { useEffect, useRef } from "react";
import { FILES, type FileId } from "../fileConfig";
import { FILE_COMPONENTS } from "../files";
import { useIDE } from "../IDEContext";

export function Editor() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Partial<Record<FileId, HTMLElement>>>({});

  const { setActiveFile, setFileProgress, registerScrollRoot, registerSection } =
    useIDE();

  // Register the scroll root once
  useEffect(() => {
    registerScrollRoot(scrollRef.current);
    return () => registerScrollRoot(null);
  }, [registerScrollRoot]);

  // IntersectionObserver picks the section most centered in the viewport
  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;

    // We pick the section whose top is closest to the root's top + 30% margin.
    function pickActiveByScroll() {
      const r = scrollRef.current;
      if (!r) return;
      const probe = r.scrollTop + r.clientHeight * 0.3;
      let best: { id: FileId; dist: number } | null = null;
      for (const file of FILES) {
        const el = sectionRefs.current[file.id];
        if (!el) continue;
        const top = el.offsetTop;
        const bottom = top + el.offsetHeight;
        // distance to the probe line — penalty if outside [top, bottom]
        const dist =
          probe < top
            ? top - probe
            : probe > bottom
              ? probe - bottom
              : 0;
        if (!best || dist < best.dist) best = { id: file.id, dist };
      }
      if (best) setActiveFile(best.id);

      const maxScroll = r.scrollHeight - r.clientHeight;
      const p = maxScroll > 0 ? r.scrollTop / maxScroll : 0;
      setFileProgress(p);
    }

    pickActiveByScroll();
    let raf = 0;
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        pickActiveByScroll();
      });
    }
    root.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      root.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [setActiveFile, setFileProgress]);

  return (
    <div
      ref={scrollRef}
      className="h-full w-full overflow-y-auto overflow-x-hidden scrollbar-thin bg-[#0d1117]"
      data-editor-root
    >
      {FILES.map((file) => {
        const Component = FILE_COMPONENTS[file.id];
        return (
          <section
            key={file.id}
            id={`file-${file.id}`}
            data-file-id={file.id}
            ref={(el) => {
              if (el) {
                sectionRefs.current[file.id] = el;
                registerSection(file.id, el);
              } else {
                delete sectionRefs.current[file.id];
                registerSection(file.id, null);
              }
            }}
            className="max-w-3xl mx-auto px-6 sm:px-10 lg:px-14 py-12 first:pt-8 last:pb-32"
          >
            {/* file separator (between files) */}
            <FileSeparator file={file} />
            <Component />
          </section>
        );
      })}
    </div>
  );
}

function FileSeparator({ file }: { file: typeof FILES[number] }) {
  if (file.index === 0) {
    return null;
  }
  return (
    <div className="mb-12 flex items-center gap-3 select-none font-mono text-[10.5px] uppercase tracking-[0.22em] text-zinc-600">
      <span className="h-px flex-1 bg-white/[0.04]" />
      <span style={{ color: file.accent }}>· {file.filename} ·</span>
      <span className="h-px flex-1 bg-white/[0.04]" />
    </div>
  );
}
