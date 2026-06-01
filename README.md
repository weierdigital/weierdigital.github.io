# weierdigital.github.io

Personal site for **[weier.digital](https://weier.digital)** — Carsten Weier, Maschinenbauer & Systembauer aus dem Siegerland / NRW.

## Purpose

Static portfolio and contact site. Showcases ERP integration, CAD automation and process optimisation work for small and medium-sized manufacturers. No tracking, no cookies, no backend.

## Structure

```
index.html              — Landing page
system.html             — Live demo tabs (ERP · Python · CAD pipeline)
about/index.html        — Über mich / About
blog/index.html         — Praxisberichte / Notes
contact/index.html      — Contact
impressum/index.html    — Impressum / Legal notice
datenschutz/index.html  — Datenschutz / Privacy policy

assets/
  style.css             — Global stylesheet (Inter + Space Grotesk via Google Fonts)
  main.js               — Theme toggle · language toggle (DE/EN) · footer year · demo animations
  icons/                — SVG + PNG favicon
```

## Local preview

No build step — open any HTML file directly in a browser, or serve the project root with any static file server:

```bash
# Python
python -m http.server 8000

# Node
npx serve .
```

Then open `http://localhost:8000`.

## Deployment

Push to `main` → GitHub Pages deploys automatically. Custom domain configured via `CNAME` → `weier.digital`.

## Maintenance notes

This is a no-build static site. Shared layout parts — header, footer, bottom navigation, social links, and font/meta tags — are duplicated across pages intentionally. When changing navigation or footer content, update all HTML entry points:

`index.html`, `system.html`, `about/index.html`, `blog/index.html`, `contact/index.html`, `impressum/index.html`, `datenschutz/index.html`
