# Portfolio Website

Static portfolio site — plain HTML, CSS, and JavaScript with Bootstrap and bundled vendor libraries (jQuery, Owl Carousel, Isotope, Boxicons, etc.). No build step, no framework, no server-side code.

- **Repo:** https://github.com/sreehari59/sreehari59.github.io
- **Live:** https://sreehari59.github.io (projects section at https://sreehari59.github.io/projects/)

---

## Run in Local Mode

The pages load CSS/JS/images with relative paths (e.g. `assets/...`), so they must be served over HTTP from the folder that holds `index.html` and `assets/`. Opening the `.html` file directly with `file://` breaks styling and images — use a local static server.

Pick any one option below.

### Option 1 — Python (no install if Python present)

```bash
# from the site root (folder containing index.html + assets/)
cd sreehari59.github.io
python -m http.server 8000
```

Open http://localhost:8000 (projects page: http://localhost:8000/projects/).

### Option 2 — Node (npx, no install)

```bash
cd sreehari59.github.io
npx serve -l 8000
```

Open the URL printed in the terminal.

### Option 3 — VS Code Live Server

1. Install the **Live Server** extension.
2. Open the repo folder in VS Code.
3. Right-click `index.html` → **Open with Live Server**.

> Serve from the repository root so relative `assets/` paths resolve. To preview only the projects section, browse to `/projects/` on the running local server.

---

## Run in Live Mode (GitHub Pages)

This is a GitHub **user Pages** repo (`sreehari59.github.io`), so its `main` branch is published automatically at the root domain — no extra config or Actions workflow needed.

1. Commit your changes.

   ```bash
   git add .
   git commit -m "Update site"
   ```

2. Push to `main`.

   ```bash
   git push origin main
   ```

3. GitHub Pages rebuilds within ~1–2 minutes. View at:
   - Site: https://sreehari59.github.io
   - Projects: https://sreehari59.github.io/projects/

### First-time / settings check

If the site is not live, confirm in the GitHub repo: **Settings → Pages → Build and deployment**
- **Source:** Deploy from a branch
- **Branch:** `main` / `/ (root)`

---

## Project Structure

```
sreehari59.github.io/
├── index.html          # main portfolio page
├── favicon.png
├── assets/             # css, js, vendor libs, images, pdf
│   ├── css/
│   ├── js/
│   ├── img/
│   └── vendor/
└── projects/           # per-project detail pages
    ├── index.html
    ├── ai_it_support_agent.html
    ├── articula.html
    ├── intellisafe.html
    ├── news_sifter.html
    └── ...
```
