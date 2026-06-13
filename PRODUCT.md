# Product

## Register

product

> Hybrid surface. The public face is a marketing/portfolio site (Landing, Über,
> Projekte-Werkschau), but its credibility rests on the working `system.html`
> demos and the honestly-labelled "Eigenbau" projects. Carsten's call: treat it
> as **product** — design serves the demonstration of real capability, not a
> brand campaign. Per-task this can flip to `brand` for a pure landing pass.

## Users

Decision-makers at small and mid-sized German manufacturers (Maschinenbau,
Handwerk, Dienstleister) in the Siegerland / NRW region — typically the owner,
operations lead, or office manager of a grown business that runs on an ageing
ERP plus a lot of manual rework. Two reader types:

- **Geschäftsführung / Inhaber** — skim on desktop or phone, skeptical of
  agency polish, want to know "kann der das wirklich, und hilft das *meinem*
  Betrieb?" before spending five minutes.
- **Fertigung / Büro** — recognise the daily pain (Medienbruch zwischen ERP und
  CAD, doppelte Eingaben, Listen die niemand pflegt) and judge whether the
  person on the other side actually understands the shop floor.

Context of use: a few minutes, often between other tasks, frequently mobile.
The job to be done is **vetting a potential partner**, not browsing.

## Product Purpose

weier.digital is the personal site of Carsten Weier — Maschinenbautechniker and
self-taught developer who builds internal software for the seams where work
gets stuck: ERP integration, CAD automation, interface tools, process apps.

It exists to **build trust before the first conversation**. Carsten has no
client logos, testimonials, or case studies (solo, NDA-bound, early). So the
site earns belief differently: by showing real, working things he built himself
(an ERP web-app on a terminal server + MySQL, a Python geometry→NC pipeline, a
status-sync tool, planning/Gantt), by speaking the customer's manufacturing
language, and by *being* what it claims — precise, fast, no tracking, no bloat.

Success = a qualified visitor finishes with "der versteht meinen Betrieb und
kann das wirklich," and a fraction of them send a concrete first email
(mailto-only, prefilled, by deliberate datensparsam design).

## Brand Personality

Three words: **werkstatt-präzise, ehrlich, unaufgeregt** (workshop-precise,
honest, understated).

Voice: a competent tradesperson-engineer who explains plainly, never oversells,
and respects the reader's time. Sentence-case German prose; uppercase reserved
for short technical stamps (POS.01, M 1:1, part-number chips). Technical when it
helps, with Maschinenbau analogies; never buzzword marketing. Emotional goal:
quiet confidence and relief ("endlich jemand, der das Problem kennt"), not
excitement or hype.

## Anti-references

- **Glowing fake-KPI dashboards / "Werkbank-OS" hero** — explicitly rejected.
  A live-looking metrics wall implies a running client system that doesn't
  exist. Dishonest for a no-references solo; never imply proof Carsten lacks.
- **Fabricated social proof** — no invented testimonials, client logos, star
  ratings, "trusted by" rows, or fake screenshots. If it isn't real, it isn't
  on the page.
- **Generic SaaS / agency landing tropes** — hero-metric template (big number +
  small label + gradient), identical icon-heading-text card grids, an
  uppercase tracked eyebrow over every section, gradient text, glassmorphism.
- **The old cool GitHub-dark palette** and the cream/sand/parchment AI-default
  warm-neutral. Warmth lives in the accent + typography, not a tinted near-bg.
- **Decoration without function** — drop-shadow depth, pill buttons, rounded
  bubbles. Depth comes from line weight (Haarlinien), not shadows.

## Design Principles

1. **Echtheit über Hochglanz.** Show real own-builds, labelled "Eigenbau." Trust
   is earned by verifiable work, never by manufactured proof. When in doubt,
   show less but true.
2. **Practice what you preach.** A craftsman's site that promises lean, precise,
   no-waste software must itself be lean: static, vanilla, datensparsam, fast,
   no tracking. The medium is the first proof.
3. **Show, don't tell.** The interactive `system.html` demos do the convincing
   that adjectives can't. Let the visitor *operate* the capability.
4. **Speak the shop floor.** Domain knowledge (Maschinenbau, Fertigung, ERP/CAD
   reality) is the differentiator. Name the customer's exact pain in their
   words; this signals "I've stood where you stand."
5. **Werkstatt-Präzision als Sprache.** The drawing-sheet system — engineering
   grid, hairline frame, dimension lines, mono title block, one machine accent —
   is meaning, not skin. Every mark earns its place like a line on a technical
   drawing.

## Accessibility & Inclusion

Target **WCAG AAA where achievable**, AA as the hard floor.

- Body/text contrast aim ≥7:1 against its background (≥4.5:1 minimum); large
  text ≥4.5:1. Muted captions must still clear AA — verify against the warm
  paper bg in both themes.
- Full keyboard operability, including the `system.html` tab demos (roving
  tabindex / arrow-key nav already in place — keep it).
- `prefers-reduced-motion: reduce` honoured globally; every animation needs a
  crossfade or instant fallback. Blueprint flourishes must not depend on motion.
- One machine accent must never be the sole information carrier (state in the
  demos also reads via label/text, not colour alone) — colour-blind safe.
- Bilingual DE/EN parity via `data-de` / `data-en`; default German.
