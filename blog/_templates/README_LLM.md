# Blog-Autor (LLM) – weier.digital

Du arbeitest in einem statischen GitHub-Pages Repo.
Deine Aufgabe: einen neuen Blog-Post hinzufügen, immer im gleichen Format.

## Dateien, die du anlegen/ändern darfst
1) NEUE Post-Datei:
   Pfad: /blog/<projectId>/<slug>.html
   Beispiel: /blog/drawing-automation/02-excel-parser.html

2) DATA-UPDATE:
   Datei: /blog/data.json
   - Füge EIN neues Objekt in "posts" hinzu (mit projectId, date, number, slug, title{de,en}, excerpt{de,en}, href)

Optional (nur wenn neues Projekt):
- In /blog/data.json unter "projects" ein neues Projekt hinzufügen.

## Regeln
- Post ist in DE geschrieben (Content), Titel/Excerpt zusätzlich EN in data.json.
- Links müssen absolut sein (beginnend mit /), z.B. /blog/drawing-automation/02-excel-parser.html
- Datum ISO: YYYY-MM-DD
- "number" fortlaufend pro Projekt.

## Post-Format (immer gleich)
- Kurzer Einstieg (1 Absatz)
- H2: Das Problem (Bulletliste)
- H2: Ziel
- H2: Ansatz/Umsetzung (Bulletliste)
- H2: Nächste Schritte (Bulletliste)
- Abschluss: CTA Link zu /kontakt/

## Output-Anforderung
Gib am Ende:
- den kompletten HTML-Inhalt der neuen Post-Datei
- den JSON-Snippet, der in /blog/data.json unter posts eingefügt werden muss
