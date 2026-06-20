# sreehari59.github.io

Personal portfolio website for Sreehari Pradeep Kumar — Data Scientist & AI Engineer.

## About / Overview

This repository powers [sreehari59.github.io](https://sreehari59.github.io), a single-page personal portfolio that showcases:

- Professional background, key expertise, and interests
- Education history and online certifications
- Work experience
- A curated set of AI/ML/data science projects with dedicated detail pages
- Technical skills (languages, frameworks, tools)
- Resume link and contact / social information

It is a static, framework-free site built directly with HTML, CSS, and vanilla JavaScript.

## Tech Stack

- **HTML5 / CSS3** — page structure and styling (`index.html`, `assets/css/style.css`)
- **Vanilla JavaScript** — page interactivity (`assets/js/main.js`)
- **Bootstrap** — responsive grid and components
- **Vendor libraries** (bundled under `assets/vendor/`):
  - Bootstrap (CSS/JS)
  - Boxicons, IcoFont, Remixicon — icon sets
  - Owl Carousel — carousels
  - Isotope Layout — portfolio filtering/sorting
  - Venobox — lightbox/modal viewer for project details
  - Typed.js — animated typing effect in the header
  - jQuery, jQuery Easing, Waypoints, Counterup — scroll-triggered effects and counters
  - PHP Email Form — contact form validation
- **Google Tag Manager / Google Analytics** — visitor tracking

No build tooling, package manager, or backend framework is used — the site is plain static HTML/CSS/JS served as-is.

## Features

- **About** — summary of experience and key areas of expertise
- **Education** — degrees, dates, and relevant coursework, plus online certifications
- **Experience** — professional work history
- **Projects** — filterable portfolio grid; each project opens a detail page (in `projects/`) in a lightbox
- **Skills** — languages, databases, frameworks, and tools, shown as logo badges
- **Resume & Links** — direct link to a downloadable CV (`assets/pdf/CV.pdf`)
- **Contact** — address, social profiles (LinkedIn, GitHub, email), and email

## Project Structure

```
.
├── index.html              # Main portfolio page (all sections)
├── favicon.png              # Site favicon
├── LICENSE                  # MIT License
├── assets/
│   ├── css/style.css        # Custom site styles
│   ├── img/                 # Profile, education, certification, and project images
│   ├── js/main.js            # Site interactivity (nav, animations, carousels, etc.)
│   ├── pdf/CV.pdf            # Downloadable resume
│   └── vendor/               # Third-party front-end libraries (Bootstrap, icons, carousels, etc.)
├── projects/
│   ├── index.html            # Projects landing page
│   ├── *.html                 # Individual project detail pages (opened from the portfolio grid)
│   └── favicon.png
└── portfolio-v2/             # Reserved for an in-progress portfolio revamp
```

## Getting Started

### Prerequisites

- A modern web browser
- (Optional, for local serving) Python 3, Node.js, or any static file server

No package manager, dependencies, or build step are required since the site is plain static HTML/CSS/JS.

### Installation

Clone the repository:

```bash
git clone https://github.com/sreehari59/sreehari59.github.io.git
cd sreehari59.github.io
```

## Running Locally

Since this is a static site, you can either open the file directly or serve it with a lightweight HTTP server (recommended, so that relative paths and assets load correctly):

```bash
# Using Python 3
python3 -m http.server 8000

# Or using Node's http-server (requires npx)
npx http-server -p 8000
```

Then open `http://localhost:8000` in your browser.

Alternatively, simply open `index.html` directly in a browser.

## Build & Deployment

There is no build step. The site is deployed via **GitHub Pages**, served directly from the root of the `main` branch of this repository (the repo name `sreehari59.github.io` makes it a GitHub Pages user site). Pushing changes to `main` automatically publishes the updated site at [https://sreehari59.github.io](https://sreehari59.github.io).

## Available Scripts

This project does not use a package manager (e.g. npm/yarn), so there are no defined scripts. Use the commands under [Running Locally](#running-locally) to preview the site.

## Contact / Author

**Sreehari Pradeep Kumar**

- Email: sreeharipradeepkumar1996@gmail.com
- LinkedIn: [linkedin.com/in/sreeharipradeep](https://www.linkedin.com/in/sreeharipradeep)
- GitHub: [@sreehari59](https://github.com/sreehari59)
- Location: Mannheim, Germany

## License

This project is licensed under the terms of the [MIT License](LICENSE).
