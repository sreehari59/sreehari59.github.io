import { describe, it, expect } from "vitest";
import { settleAccel, repelAccel, buildSwarm } from "./useSwarm";

describe("settleAccel", () => {
  it("pulls toward home proportionally to displacement", () => {
    expect(settleAccel(0, 10, 2)).toBe(20);
    expect(settleAccel(10, 10, 2)).toBe(0);
    expect(settleAccel(15, 10, 2)).toBe(-10);
  });
});

describe("repelAccel", () => {
  it("is zero outside the radius", () => {
    const f = repelAccel(10, 0, 0, 0, 3, 20);
    expect(f).toEqual({ x: 0, y: 0 });
  });

  it("pushes a node away from the cursor when inside the radius", () => {
    const f = repelAccel(1, 0, 0, 0, 3, 20); // node right of cursor
    expect(f.x).toBeGreaterThan(0);
    expect(f.y).toBeCloseTo(0, 5);
  });

  it("is stronger closer to the cursor", () => {
    const near = repelAccel(0.5, 0, 0, 0, 3, 20).x;
    const far = repelAccel(2.5, 0, 0, 0, 3, 20).x;
    expect(near).toBeGreaterThan(far);
  });

  it("returns zero at the exact cursor position (no NaN)", () => {
    const f = repelAccel(0, 0, 0, 0, 3, 20);
    expect(f).toEqual({ x: 0, y: 0 });
  });
});

describe("buildSwarm", () => {
  it("produces the requested node count and valid buffers", () => {
    const s = buildSwarm(40, { x: 10, y: 6, z: 4 }, 1);
    expect(s.count).toBe(40);
    expect(s.pos.length).toBe(120);
    expect(s.home.length).toBe(120);
    expect(s.pos).toEqual(s.home); // starts at rest
  });

  it("creates edges referencing valid node indices", () => {
    const s = buildSwarm(60, { x: 12, y: 8, z: 5 }, 2);
    expect(s.edges.length % 2).toBe(0);
    expect(s.edgeIntensity.length).toBe(s.edges.length / 2);
    for (const idx of s.edges) {
      expect(idx).toBeGreaterThanOrEqual(0);
      expect(idx).toBeLessThan(s.count);
    }
  });

  it("is deterministic for a given seed", () => {
    const a = buildSwarm(30, { x: 10, y: 6, z: 4 }, 5);
    const b = buildSwarm(30, { x: 10, y: 6, z: 4 }, 5);
    expect(Array.from(a.home)).toEqual(Array.from(b.home));
    expect(Array.from(a.edges)).toEqual(Array.from(b.edges));
  });
});
