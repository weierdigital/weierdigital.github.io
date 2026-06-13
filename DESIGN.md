---
name: weier.digital
description: Werkstatt-Blueprint × Siegerland Editorial — warm drawing paper, one machine accent, hairlines instead of shadows.
colors:
  accent-machine: "#cb5328"
  accent-machine-hover: "#b1481f"
  accent-ink: "#ffffff"
  accent-soft: "#cb53281f"
  paper-bg: "#f4f1ea"
  sheet-surface: "#ffffff"
  sunken-surface: "#f1ede3"
  ink: "#211c16"
  dimension-muted: "#6b6357"
  hairline: "#ddd5c6"
  hairline-strong: "#c3bba9"
  measured-green: "#3f7d4e"
  caution-amber: "#b67708"
typography:
  display:
    fontFamily: "Source Serif 4, Georgia, 'Times New Roman', serif"
    fontSize: "clamp(28px, 4.4vw, 44px)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "clamp(22px, 3.5vw, 32px)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  label:
    fontFamily: "'SF Mono', 'Cascadia Code', 'Fira Code', Consolas, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "2px"
rounded:
  sheet: "2px"
  draw: "3px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "20px"
  lg: "28px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.accent-machine}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.draw}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.accent-machine-hover}"
    textColor: "{colors.accent-ink}"
  button-ghost:
    backgroundColor: "{colors.paper-bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.draw}"
    padding: "11px 18px"
  button-ghost-hover:
    textColor: "{colors.accent-machine}"
  chip-part-number:
    backgroundColor: "{colors.sheet-surface}"
    textColor: "{colors.dimension-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.sheet}"
    padding: "2px 7px"
  card-sheet:
    backgroundColor: "{colors.sheet-surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.draw}"
    padding: "22px"
  nav-link-active:
    textColor: "{colors.ink}"
    backgroundColor: "{colors.paper-bg}"
---

# Design System: weier.digital

## 1. Overview

**Creative North Star: "Das Zeichenblatt" (The Drawing Sheet)**

Every surface behaves like a sheet of engineering drawing paper on a workshop
desk. A faint engineering grid sits behind the whole page; content lives inside
a hairline frame with corner registration marks; the headline is underscored by
a real dimension line with arrowheads and a mono measurement label; a mono title
block anchors the hero like the stamp in the corner of a technical drawing. The
warmth is Siegerland-editorial — a serif headline voice and warm ink on warm
paper — but the discipline is the machine shop: precise, measured, nothing
decorative that isn't also functional. This is a craftsman-engineer's site that
proves its claim (lean, precise, no waste) by being exactly that.

The system explicitly rejects the things that would make it read as generic or
dishonest: the cool GitHub-dark palette it came from, the cream/sand/parchment
AI-default warm-neutral, glowing fake-KPI dashboards, gradient text, glass
cards, drop-shadow depth, and pill-shaped everything. Depth comes from line
weight, not shadow. Identity comes from one machine accent, not a palette of
brand colors. Trust comes from real, labelled own-builds, never manufactured
proof.

**Key Characteristics:**
- Warm drawing-paper background (`#f4f1ea`) with a 20px / 100px engineering grid, never a flat fill.
- Exactly one machine accent (`#cb5328`), reserved for CTAs, the active-nav tick, dimension arrows, and the "Bruch" marker.
- Three voices: Source Serif 4 (display warmth), Inter (body), mono (technical stamps).
- Flat by default — hairline borders carry structure; box-shadows are near-zero.
- Squared corners (2–3px), not rounded pills. A card is a "sheet," not a bubble.

## 2. Colors

A warm, low-chroma paper palette carrying one saturated machine accent. The
whole system is **Restrained**: tinted warm neutrals plus a single accent that
appears on well under 10% of any screen.

### Primary
- **Machine Orange** (`#cb5328`): The only saturated color. Primary CTA fill, active-nav underline tick (`inset 0 -2px 0`), dimension-line and arrowheads, the BOM "Medienbruch / Bruch" marker, hover edge on link-cards, focus accents. In dark theme it warms and lightens to **Ember** (`#e0875f`) for contrast on graphite. Hover: **Machine Orange Deep** (`#b1481f`).
- **Accent Soft** (`#cb53281f`, ~8% alpha): the only accent *fill* allowed — backing the BOM break-row and the projekte disclaimer, never a solid field.

### Neutral
- **Drawing Paper** (`#f4f1ea`): page background, always under the engineering grid. Dark theme: **Warm Graphite** (`#14110d`).
- **Sheet** (`#ffffff`): raised drawing surface — cards, BOM, panels — that lifts off the paper. Dark: `#1d1813`.
- **Sunken** (`#f1ede3`): inset wells — header bar, track backgrounds. Dark: `#241d15`.
- **Ink** (`#211c16`): primary text, the tusche. Dark: `#ece5d8`.
- **Dimension Muted** (`#6b6357`): captions, dimension labels, secondary prose. Dark: `#a99f8d`. Must clear AA against paper — do not lighten further.
- **Hairline** (`#ddd5c6`): default 1px borders and dividers. Dark: `#332b21`.
- **Hairline Strong** (`#c3bba9`): the drawing frame, registration marks, title-block rule, ghost-button border. Dark: `#463b2d`.

### Tertiary (status only)
- **Measured Green** (`#3f7d4e`): the "nachher / ok" demo state, copied-confirmation. Dark: `#5fae6e`.
- **Caution Amber** (`#b67708`): the "running / warn" demo state. Dark: `#d29922`.

### Named Rules
**The One Accent Rule.** There is exactly one accent, `#cb5328`. It is never used as a large fill field — only as line, edge, arrowhead, tick, or ≤8%-alpha wash. Its rarity is what makes a CTA read as "press here."

**The Warmth-Is-Earned Rule.** Warmth lives in the accent and the serif type, never in the background. Do not tint the paper warmer "for feel"; `#f4f1ea` is the ceiling. Cream/sand/parchment near-whites are forbidden.

**The Migration-Debt Rule.** The `system.html` demo internals are still hardcoded GitHub-indigo (`#818cf8`, `rgba(99,102,241,…)`, `#161b22`, `#21262d`, `#30363d`). These are legacy, NOT part of this palette. New work must use the tokens above; the demo chrome is pending a re-tint pass.

## 3. Typography

**Display Font:** Source Serif 4 (Georgia, 'Times New Roman', serif) — weights 500/600.
**Body Font:** Inter (-apple-system, sans-serif) — weights 400–800.
**Label / Mono Font:** SF Mono / Cascadia Code / Fira Code / Consolas, monospace.

**Character:** A three-voice system pairing on contrast axes, never on similar
sans. The serif carries editorial warmth and authority in headlines; Inter keeps
prose plain and legible; the mono is the "instrument readout" — it stamps the
technical layer (eyebrows, POS./M 1:1 marks, section indices, part numbers,
title block) so those elements read as drawing annotations, not body copy.

### Hierarchy
- **Display** (Source Serif 4, 600, `clamp(28px, 4.4vw, 44px)`, lh 1.08, ls -0.015em): the hero `.bp-tagline` and page `h1`. Accent words wrapped in `<b>` take `#cb5328`. Use `text-wrap: balance`.
- **Headline** (Source Serif 4, 600, `clamp(22px, 3.5vw, 32px)`): section titles (`.section-h`), CTA-block `h2`. Optional mono `data-idx` "01 · " prefix in accent — used **only** where the section is a real ordered sequence, never as default scaffolding.
- **Title** (Source Serif 4, 600, 20px, ls -0.01em): card / projekte headings (`.proj-card h3`).
- **Body** (Inter, 400, 16px, lh 1.7): prose. Cap measure at 62–70ch (`.section-lead` 62ch, `.who-text` 68ch, `.faq p` 64ch).
- **Label** (mono, 400, 10–11px, ls 1–2px, UPPERCASE): eyebrows, title block, BOM headers, dimension labels, badges. Uppercase is reserved for these short technical stamps **only**.

### Named Rules
**The Stamp-Case Rule.** Uppercase appears only in the mono technical layer (eyebrows, POS marks, title block, badges). Prose and headlines are always sentence case. An uppercase tracked eyebrow over every section is forbidden — the mono eyebrow is one deliberate voice, not section scaffolding.

**The Legacy-Sans Rule.** Space Grotesk is still loaded and still styles a few un-migrated sub-headings (`.card h3`, `.sys-card h3`, `.kpi-val`). Source Serif 4 is canonical for all display/headline/title text; new headings use the serif, and the Space Grotesk holdouts are migration debt, not a second display face.

## 4. Elevation

This is a **flat system**. Depth is drawn, not lit. Surfaces are distinguished by
hairline borders and tonal layering (paper → sunken → sheet), exactly like
overlapping sheets of drawing paper. The shadow tokens that remain are
deliberately near-invisible single-pixel offsets, not blurred lifts.

### Shadow Vocabulary
- **Sheet rest** (`box-shadow: 0 1px 0 rgba(33,28,22,.05)`): a 1px tonal seam, not a shadow. Most cards override even this to `none`.
- **Sheet raised** (`box-shadow: 0 2px 0 rgba(33,28,22,.06)`): the BOM/KPI panel only. Still a seam, not a float.

### Named Rules
**The No-Float Rule.** No blurred drop-shadows, ever. If a surface needs to read as raised, give it a `#ffffff` sheet fill on the paper bg and a hairline border. The tell of failure: a card that looks like it's hovering above the page.

**The Edge-On-Intent Rule.** Cards are inert at rest. Interaction is signalled by a 3px accent edge that scales in on hover/focus (`.card--link::before`), not by lifting or shadowing the whole card.

## 5. Components

### Buttons
- **Shape:** squared, drawing-sheet corners (`--radius` 3px). Never pills for primary actions.
- **Primary** (`.btn-cta`): solid Machine Orange (`#cb5328`) fill, white ink, Inter 600, `12px 24px`. The one place the accent becomes a field. Hover → `#b1481f`. **Note:** legacy `.btn-cta` still sets `background: var(--gradient)` higher in the cascade; the relaunch override flattens it to solid — keep it solid.
- **Ghost** (`.btn-ghost`): transparent on paper, hairline-strong border, ink text, Inter 500, `11px 18px`. Hover → border and text shift to accent.
- **Utility** (`.btn`): surface fill, hairline border, used for theme/lang/icon toggles (40×40 icon variant).

### Chips — Part Numbers
- **Style:** mono, squared (`2px`), `#ffffff` sheet fill, hairline border, dimension-muted text, `2px 7px`. Tech stacks render as `.proj-stack span` / `.teaser-chip`.
- **State:** static labels. Interactive teaser-chips shift border + text to accent on hover. Never pill-shaped, never accent-filled.

### Cards — Sheets
- **Corner Style:** `2–3px` (`--radius` / sheet `2px`). A card is a sheet, not a bubble.
- **Background:** `#ffffff` sheet on the `#f4f1ea` paper grid.
- **Shadow Strategy:** none (see Elevation). Structure from the hairline border.
- **Border:** 1px hairline (`#ddd5c6`); the drawing frame uses hairline-strong.
- **Internal Padding:** 22–24px. Link-cards get the scale-in accent left-edge on hover (the one sanctioned vertical accent line — it is an interaction affordance, not a decorative side-stripe).

### Inputs / Fields
- Minimal in this static site (contact is mailto-only by design). The copy-button pattern (`.copy-btn`) is the model: mono, squared `2px`, surface fill, hairline border; hover → accent; success → measured-green with "copied" state.

### Navigation
- **Desktop topnav:** Inter 600, 15px, dimension-muted links. Hover → ink, transparent bg. Active → ink text with an `inset 0 -2px 0 #cb5328` accent tick (no fill, no radius).
- **Sticky header:** paper-tinted translucent (`rgba(246,242,234,.82)`) with `backdrop-filter: blur`. Dark: `rgba(20,17,13,.82)`.
- **Mobile:** bottom navigation bar (mobile-first); desktop is secondary topnav text links.

### Signature Components
- **Drawing-Sheet Hero** (`.bp-frame` + `.bp-reg`): hairline-strong frame with four circular corner registration marks bleeding 5px outside the edge.
- **Dimension Line** (`.dimline`): a 1px accent rule with CSS-drawn arrowheads and a centered mono measurement label, set under the headline. Pure CSS, theme-robust.
- **Title Block** (`.bp-titleblock`): mono, uppercase, hairline-strong top rule — the drawing's corner stamp (POS / M 1:1 / region).
- **Stückliste / BOM** (`.bom`): the hero parts-list showing the data flow (POS.01 ERP → POS.03 Medienbruch in accent → POS.05 Fertigung). The break-row gets `accent-soft` fill + full accent outline + accent badge — the one place the orange names a problem.
- **Reveal motion** (`.reveal`): one calm, uniform `translateY(16px)` + fade on scroll-in (0.55s ease). Honours `prefers-reduced-motion` (content visible by default). Replaced the old per-section stagger.

## 6. Do's and Don'ts

### Do:
- **Do** keep the engineering grid behind every page (`--grid` 20px, `--grid-bold` 100px); the paper is never a flat fill.
- **Do** reserve `#cb5328` for line, edge, tick, arrowhead, badge, and ≤8%-alpha wash. One accent, used sparingly.
- **Do** convey depth with hairline borders and tonal layering (paper → sunken → sheet), never blurred shadows.
- **Do** set headlines in Source Serif 4, sentence case, with `text-wrap: balance`; cap prose at 62–70ch.
- **Do** keep uppercase to the mono technical stamps (eyebrows, POS marks, title block, badges).
- **Do** show only real, "Eigenbau"-labelled own-builds; verify body contrast ≥7:1 (AAA target), AA as the floor.
- **Do** migrate any new `system.html` work onto the warm tokens above.

### Don't:
- **Don't** reintroduce the cool GitHub-dark palette or any cream/sand/parchment warm-neutral background. Warmth is carried by accent + serif, not by the bg.
- **Don't** build glowing fake-KPI dashboards or any "Werkbank-OS" hero that implies a running client system. No manufactured proof — no invented testimonials, logos, ratings, or screenshots.
- **Don't** use gradient text (`background-clip: text`), glassmorphism as decoration, or the hero-metric template (big number + small label + gradient).
- **Don't** use blurred drop-shadows or pill radii on primary actions; corners are 2–3px and surfaces are flat.
- **Don't** add an uppercase tracked eyebrow or `01 / 02 / 03` numbered marker over every section. Numbers earn their place only in a real ordered sequence (the BOM, a true process).
- **Don't** use `border-left/right` > 1px as a decorative colored stripe on cards or callouts. The `.proj-disclaimer` 3px accent left-border is a known exception to retire; the only sanctioned vertical accent line is the scale-in hover edge on link-cards.
- **Don't** let any single machine accent be the sole carrier of state — demo status must also read via label/text (colour-blind safe).
