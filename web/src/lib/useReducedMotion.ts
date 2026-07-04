import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

let cachedWebgl: boolean | null = null;
export function hasWebGL(): boolean {
  if (cachedWebgl !== null) return cachedWebgl;
  try {
    const canvas = document.createElement("canvas");
    cachedWebgl = !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    cachedWebgl = false;
  }
  return cachedWebgl;
}
