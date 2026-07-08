// Assembles the final /docs tree that GitHub Pages serves.
//
// Run AFTER the two framework builds:
//   - web/          (Vite)  -> already wrote docs/portfolio/   (via vite base '/portfolio/')
//   - portfolio-v2/ (Next)  -> wrote portfolio-v2/out/         (static export, basePath '/dev')
//
// This script then:
//   1. copies portfolio-v2/out  -> docs/dev
//   2. copies gate/index.html   -> docs/index.html   (the audience gate, the site's front door)
//   3. ensures docs/.nojekyll    (so GitHub Pages serves _next/ and other underscore dirs)
import { existsSync, rmSync, mkdirSync, cpSync, copyFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const p = (...s) => resolve(root, ...s);

const devOut = p("portfolio-v2", "out");
const devDest = p("docs", "dev");
const gateSrc = p("gate", "index.html");
const gateDest = p("docs", "index.html");
const nojekyll = p("docs", ".nojekyll");

if (!existsSync(devOut)) {
  console.error(`✗ Missing ${devOut}. Run the portfolio-v2 build first (npm run build:dev).`);
  process.exit(1);
}
if (!existsSync(p("docs", "portfolio", "index.html"))) {
  console.error("✗ Missing docs/portfolio. Run the web build first (npm run build:portfolio).");
  process.exit(1);
}
if (!existsSync(gateSrc)) {
  console.error(`✗ Missing ${gateSrc}.`);
  process.exit(1);
}

// 1. portfolio-v2/out -> docs/dev  (fully replace)
rmSync(devDest, { recursive: true, force: true });
mkdirSync(devDest, { recursive: true });
cpSync(devOut, devDest, { recursive: true });
console.log("✓ docs/dev        <- portfolio-v2/out");

// 2. gate -> docs/index.html
copyFileSync(gateSrc, gateDest);
console.log("✓ docs/index.html <- gate/index.html");

// 3. .nojekyll
writeFileSync(nojekyll, "");
console.log("✓ docs/.nojekyll");

console.log("\nDone. /docs is ready to commit and serve from GitHub Pages (main / docs).");
