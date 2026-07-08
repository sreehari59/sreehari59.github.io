"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FILES, type FileId } from "./fileConfig";

export const PANEL_MIN_HEIGHT = 96;
export const PANEL_DEFAULT_HEIGHT = 168;
export const PANEL_MAX_RATIO = 0.7;

type IDEState = {
  activeFile: FileId;
  fileProgress: number; // 0..1 across the entire editor
  setActiveFile: (id: FileId) => void;
  setFileProgress: (p: number) => void;
  /** Smooth-scroll the editor to a specific file. */
  jumpToFile: (id: FileId) => void;
  /** Internal: the Editor component registers its scroll container here. */
  registerScrollRoot: (el: HTMLDivElement | null) => void;
  /** Internal: the Editor component registers each section element here. */
  registerSection: (id: FileId, el: HTMLElement | null) => void;
  /** Bottom panel state. */
  panelOpen: boolean;
  panelHeight: number;
  setPanelOpen: (open: boolean) => void;
  setPanelHeight: (h: number | ((prev: number) => number)) => void;
  togglePanel: () => void;
  /** Chat panel state. */
  chatOpen: boolean;
  toggleChat: () => void;
  /** Mobile Explorer drawer (file tree + outline). */
  navOpen: boolean;
  setNavOpen: (open: boolean) => void;
  toggleNav: () => void;
};

const Ctx = createContext<IDEState | null>(null);

export function IDEProvider({ children }: { children: React.ReactNode }) {
  const [activeFile, setActiveFile] = useState<FileId>("readme");
  const [fileProgress, setFileProgress] = useState(0);
  const [panelOpen, setPanelOpen] = useState(true);
  const [panelHeight, setPanelHeightRaw] = useState(PANEL_DEFAULT_HEIGHT);
  const [chatOpen, setChatOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  const toggleChat = useCallback(() => setChatOpen((o) => !o), []);
  const toggleNav = useCallback(() => setNavOpen((o) => !o), []);

  // The mobile drawer is a small-screen affordance only — close it the moment
  // the viewport grows past the breakpoint where the real Sidebar appears, so
  // it can never get stranded open behind the desktop layout.
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const sync = () => mql.matches && setNavOpen(false);
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);

  const scrollRootRef = useRef<HTMLDivElement | null>(null);
  const sectionsRef = useRef<Partial<Record<FileId, HTMLElement>>>({});

  // Clamp panel height to legal bounds whenever it's set or the window resizes.
  const setPanelHeight = useCallback(
    (h: number | ((prev: number) => number)) => {
      setPanelHeightRaw((prev) => {
        const next = typeof h === "function" ? h(prev) : h;
        const max =
          typeof window !== "undefined"
            ? Math.max(PANEL_MIN_HEIGHT, window.innerHeight * PANEL_MAX_RATIO)
            : 600;
        return Math.min(Math.max(next, PANEL_MIN_HEIGHT), max);
      });
    },
    []
  );

  useEffect(() => {
    function onResize() {
      setPanelHeight((h) => h); // re-clamp
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [setPanelHeight]);

  const togglePanel = useCallback(() => {
    setPanelOpen((o) => !o);
  }, []);

  const registerScrollRoot = useCallback((el: HTMLDivElement | null) => {
    scrollRootRef.current = el;
  }, []);

  const registerSection = useCallback(
    (id: FileId, el: HTMLElement | null) => {
      if (el) sectionsRef.current[id] = el;
      else delete sectionsRef.current[id];
    },
    []
  );

  const jumpToFile = useCallback((id: FileId) => {
    const root = scrollRootRef.current;
    const target = sectionsRef.current[id];
    if (!root || !target) return;
    const top = target.offsetTop - root.offsetTop - 16;
    root.scrollTo({ top, behavior: "smooth" });
  }, []);

  const value = useMemo<IDEState>(
    () => ({
      activeFile,
      fileProgress,
      setActiveFile,
      setFileProgress,
      jumpToFile,
      registerScrollRoot,
      registerSection,
      panelOpen,
      panelHeight,
      setPanelOpen,
      setPanelHeight,
      togglePanel,
      chatOpen,
      toggleChat,
      navOpen,
      setNavOpen,
      toggleNav,
    }),
    [
      activeFile,
      fileProgress,
      jumpToFile,
      registerScrollRoot,
      registerSection,
      panelOpen,
      panelHeight,
      setPanelHeight,
      togglePanel,
      chatOpen,
      toggleChat,
      navOpen,
      toggleNav,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useIDE() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useIDE must be used inside <IDEProvider>");
  return ctx;
}

export function activeFileIndex(id: FileId): number {
  return FILES.findIndex((f) => f.id === id);
}
