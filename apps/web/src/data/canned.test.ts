import { describe, it, expect } from "vitest";
import { findCanned } from "./canned";

describe("findCanned", () => {
  it("matches an intro question", () => {
    expect(findCanned("Who is Sreehari?")?.id).toBe("intro");
  });

  it("routes project questions to the projects reveal", () => {
    const r = findCanned("show me his projects");
    expect(r?.id).toBe("projects");
    expect(r?.reveal).toBe("projects");
  });

  it("routes hiring questions to contact", () => {
    expect(findCanned("how can I hire him?")?.reveal).toBe("contact");
  });

  it("matches hackathon questions to awards", () => {
    expect(findCanned("what's his hackathon track record?")?.id).toBe("awards");
  });
});
