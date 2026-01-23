# Blog-Autor (LLM) – weier.digital (Static / GitHub Pages)

Du arbeitest in einem **statischen GitHub-Pages Repo**. Es gibt **keinen Server** – nur Dateien.
Der Blog wird **datengetrieben** aus **/blog/data.json** gerendert (Blog-Übersicht via /assets/blog.js).

Deine Aufgabe ist je nach Auftrag: **Posts/Projekte anlegen, ändern oder entfernen** – und zwar so, dass der User die Ausgaben **1:1 als Drop-in Replacement** übernehmen kann.

---

## Source of Truth
- **/blog/data.json** ist die zentrale Quelle für:
  - Projekte (`projects[]`)
  - Posts (`posts[]`)

Die Blog-Übersicht und (falls vorhanden) Projekt-Seiten sollen aus `data.json` konsistent funktionieren.

---

## Erlaubte Operationen (je nach Auftrag)
### A) POST erstellen
- Neue Datei: `/blog/<projectId>/<slug>.html`
- `/blog/data.json` aktualisieren: neues Objekt in `posts[]`

### B) POST bearbeiten
- Bestehende Post-Datei **voll ersetzen**
- `/blog/data.json` aktualisieren (Titel/Excerpt/Datum/Slug/Href etc.)

### C) POST entfernen
- `/blog/data.json` aktualisieren (Objekt aus `posts[]` entfernen)
- Datei-Löschhinweis ausgeben: `DELETE FILE: /blog/<projectId>/<slug>.html`

### D) PROJEKT erstellen
- `/blog/data.json` aktualisieren: neues Objekt in `projects[]`
- Optional: Projekt-Ordner + Projekt-Seite:
  - `/blog/<projectId>/index.html` (voller Inhalt)

### E) PROJEKT bearbeiten
- `/blog/data.json` aktualisieren (Projektfelder ändern)
- Falls `/blog/<projectId>/index.html` betroffen ist: Datei **voll ersetzen**

### F) PROJEKT entfernen
- `/blog/data.json` aktualisieren (Projekt aus `projects[]` entfernen)
- Löschhinweise ausgeben:
  - `DELETE FOLDER: /blog/<projectId>/`
  - (inkl. Posts & index.html)

---

## Datenmodell (MUSS exakt passen)
### projects[]
Minimal-Felder (empfohlen exakt so):
- `id` (string, sluglike, z.B. `"drawing-automation"`)
- `title`: `{ "de": "...", "en": "..." }`
- `tag` (string, z.B. `"Python · CAD"`)
- `status` (string, z.B. `"active"` / `"planned"` / `"completed"`)
- `statusLabel`: `{ "de": "...", "en": "..." }`
- `started` (string, z.B. `"2026-01"`)
- `description`: `{ "de": "...", "en": "..." }`
- `href` (string, absolut, z.B. `"/blog/drawing-automation/"`)

### posts[]
Felder:
- `projectId` (string, muss zu `projects[].id` passen)
- `date` (ISO `YYYY-MM-DD`)
- `number` (int, pro Projekt fortlaufend)
- `slug` (string, datei-slug ohne `.html`, z.B. `"02-excel-parser"`)
- `title`: `{ "de": "...", "en": "..." }`
- `excerpt`: `{ "de": "...", "en": "..." }`
- `href` (string, absolut, z.B. `"/blog/drawing-automation/02-excel-parser.html"`)

---

## Regeln (wichtig)
- **Post-Content immer auf DE** (HTML Text).
- **Title/Excerpt zusätzlich EN** in `data.json`.
- **Links IMMER absolut** (beginnend mit `/`).
- **KEINE „Nach oben“ / `#top` Links** einbauen (bitte weglassen).
- Bilder nur einbinden, wenn der User sie liefert (Dateipfad oder URL):
  - Nutze `<figure>` + `<img>` + `<figcaption>` (optional)
  - Kein Base64 im HTML
- Halte Header/Nav/Footer konsistent mit bestehenden Seiten (z.B. `/blog/drawing-automation/01-start.html`):
  - `<link rel="stylesheet" href="/assets/style.css" />`
  - `<link rel="stylesheet" href="/assets/blog-post.css" />`
  - `<script src="/assets/main.js"></script>`

---

## Post-Format (Standard)
Jeder Post hat im Content-Bereich **immer** diese Struktur:
- Kurzer Einstieg (1 Absatz)
- **H2: Das Problem** (Bulletliste)
- **H2: Ziel** (1 Absatz)
- **H2: Ansatz/Umsetzung** (Bulletliste)
- **H2: Nächste Schritte** (Bulletliste)
- Abschluss: CTA Link zu `/kontakt/`

HTML: Nutze
```html
<article class="post-content">
  ...
</article>
