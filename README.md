# sreehari59.github.io

Source for [sreehari59.github.io](https://sreehari59.github.io) — a personal portfolio and resume site, served via GitHub Pages.

## Purpose

A static, single-page personal site presenting:

- **About** — introduction and summary
- **Education**
- **Experience**
- **Portfolio** — featured project showcase
- **Skills**
- **Links** — social/external links
- **Contacts**

It also hosts a `/projects` sub-site with standalone case-study pages for individual projects (e.g. AI IT support agent, news sifter, water damage detection, todo app, etc.).

## Structure

```
.
├── index.html              # Main portfolio page (Personal v2.1.0 template by BootstrapMade)
├── favicon.png
├── LICENSE                  # MIT license (template by rajaprerak)
├── assets/
│   ├── css/style.css        # Site styling
│   ├── js/main.js           # Site behavior (nav, animations, etc.)
│   ├── img/                 # Profile photo, backgrounds, certification & education logos, project thumbnails
│   ├── pdf/CV.pdf           # Downloadable CV
│   └── vendor/               # Third-party libraries (Bootstrap, Boxicons, Icofont, Remixicon,
│                              #   owl.carousel, isotope-layout, jquery, typed.js, venobox, waypoints)
├── projects/
│   ├── index.html            # Projects listing page
│   └── *.html                # Individual project case-study pages
└── portfolio-v2/             # Placeholder for a future/in-progress portfolio revision (currently empty)
```

## Tech stack

Plain HTML/CSS/JavaScript with the Bootstrap-based "Personal" template, jQuery plugins (owl.carousel, isotope, venobox, typed.js, waypoints) for layout, filtering, lightboxes, and animated text. No build tooling, package manager, or server-side code is involved.

## Running locally

Since the site is fully static, no build step is required. Either:

- Open `index.html` directly in a browser, or
- Serve the directory locally, e.g.:

  ```bash
  python3 -m http.server 8000
  ```

  then visit `http://localhost:8000`.

## Deployment

The site is published automatically by GitHub Pages from this repository (`sreehari59/sreehari59.github.io`) — any change pushed to the default branch goes live at https://sreehari59.github.io.

## License

MIT — see [LICENSE](LICENSE). Base template originally created by [BootstrapMade](https://bootstrapmade.com/personal-free-resume-bootstrap-template/).
