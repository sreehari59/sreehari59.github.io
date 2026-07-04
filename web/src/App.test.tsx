import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("renders every section heading", () => {
    render(<App />);
    for (const heading of ["About", "Experience", "Projects", "Hackathon Wins", "Skills", "Contact"]) {
      expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
    }
  });

  it("renders key content from the resume data", () => {
    render(<App />);
    expect(screen.getAllByText(/ForgeAlign/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/World Economic Forum/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/SartechLabs/).length).toBeGreaterThan(0);
  });

  it("uses the static (no-WebGL) backdrop fallback in jsdom", () => {
    const { container } = render(<App />);
    // StaticSwarm renders an inline SVG; the live canvas would render <canvas>
    expect(container.querySelector("svg")).toBeTruthy();
    expect(container.querySelector("canvas")).toBeFalsy();
  });
});
