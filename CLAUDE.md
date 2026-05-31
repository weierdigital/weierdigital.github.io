# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static personal website for **weier.digital** (Carsten Weier), hosted on GitHub Pages. No build step, no framework — plain HTML, CSS, and vanilla JS.

## Structure

- `index.html` — homepage
- `about/`, `blog/`, `kontakt/`, `impressum/`, `datenschutz/` — each a folder with its own `index.html`
- `assets/style.css` — single global stylesheet
- `assets/main.js` — single JS file (theme toggle, language toggle, footer year)
- `CNAME` — GitHub Pages custom domain (`weier.digital`)

## Key Conventions

**Bilingual content (DE/EN):** Translatable text uses `data-de` and `data-en` attributes on the element. `main.js` reads these on toggle and sets `textContent`. Default language is German; the visible text in HTML is the DE version, matched by the `data-de` attribute.

```html
<span data-de="Über" data-en="About">Über</span>
```

**Theme:** Dark/light mode via `data-theme="dark"` on `<html>`. CSS variables in `:root` and `:root[data-theme="dark"]` handle all color switching. Stored in `localStorage` under key `weier_theme`.

**Active nav link:** Add `class="active"` to the `<a>` matching the current page in every page's `<nav>`.

**No build tooling** — edit files directly and push. The site deploys automatically via GitHub Pages on push to `main`.

## Projektkontext: weier.digital

- **Plattform:** GitHub Pages (statische Site — kein Server, kein Backend, kein PHP/Node)
- **Tech-Stack:** reines HTML + CSS + JavaScript (Vanilla)
- **Zielgruppe:** Kleine Mittelständler, branchenunabhängig (Maschinenbau, Handwerk, Dienstleister)
- **Persona:** Carsten Weier — Maschinenbauer & Systembauer, Siegerland/NRW
- **Kernbotschaft:** ERP-Integration, CAD-Automatisierung, weniger Handarbeit, kein doppelter Aufwand
- **Seiten:** index.html (Landing), system.html (Demo-Tabs), about/, blog/, kontakt/, impressum/, datenschutz/
- **Mobile-first:** Primär Mobile (Bottom Navigation Bar), sekundär Desktop (Topnav Text-Links)
- **Analytics:** Noch nicht eingerichtet (bewusste Entscheidung, ggf. später Google Analytics G-ID einbauen)
