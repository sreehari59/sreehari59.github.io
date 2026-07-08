"use client";

import { useEffect, useState } from "react";

/**
 * Subscribe to a CSS media query and re-render when it changes.
 *
 * SSR-safe: returns `false` on the server and during the first client paint,
 * then syncs to the real value in an effect. Pass any standard media string,
 * e.g. `useMediaQuery("(min-width: 640px)")`.
 */
export function useMediaQuery(query: string): boolean {
  // Initialise synchronously in the browser so the very first paint already
  // has the correct value. This avoids a flash where client components render
  // with the wrong layout mode before the useEffect fires.
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const sync = () => setMatches(mql.matches);
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, [query]);

  return matches;
}

/**
 * Tailwind's default breakpoints, kept in one place so component logic that
 * needs to branch in JS (animation variants, layout mode) stays in sync with
 * the responsive utility classes instead of sprinkling magic numbers around.
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

/** `true` once the viewport is at least the named Tailwind breakpoint wide. */
export function useBreakpoint(bp: keyof typeof BREAKPOINTS): boolean {
  return useMediaQuery(`(min-width: ${BREAKPOINTS[bp]}px)`);
}
