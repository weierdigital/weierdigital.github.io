# weierdigital.github.io

Quellcode von [weier.digital](https://weier.digital), dem beruflichen Profil von Carsten Weier.

Statische Seite ohne Build-Schritt: reines HTML, CSS und Vanilla-JavaScript.
Kein Framework, kein Tracking, keine Cookies, kein Backend. Kontakt läuft über `mailto:`.

## Struktur

```
index.html              One-Pager: Profil, Schwerpunkte, Stationen, Projekte, Werkzeuge, Kontakt
impressum/index.html    Impressum
datenschutz/index.html  Datenschutzerklärung
snake/index.html        Kleines Spiel, aus dem Footer verlinkt

about/, projekte/,      Weiterleitungen auf die passenden Anker des One-Pagers
contact/

assets/
  site.css              Stylesheet, tokenbasiert über CSS-Variablen in :root
  site.js               Footer-Jahr, Scroll-Reveal, Anker-Navigation
  snake.js              Spiellogik, liest ihre Farben aus den CSS-Tokens
  icons/                Logo und Favicon als SVG, PNG und PDF
  carsten-weier-*.jpg   Porträt in zwei Größen, ausgeliefert per srcset
  og-image.png          Vorschaubild für Social-Media-Karten
```

## Lokal ansehen

Absolute Pfade wie `/assets/site.css` funktionieren nicht über `file://`,
daher immer über einen lokalen Server testen:

```bash
python -m http.server 8765
```

Dann `http://localhost:8765` öffnen.

## Konventionen

- **Header und Footer sind pro Seite dupliziert.** Das ist Absicht, weil es keinen
  Build-Schritt gibt. Änderungen an Navigation oder Footer in allen HTML-Dateien nachziehen.
- **Farben und Abstände** liegen als CSS-Variablen in `:root` in `site.css`.
  Immer die Tokens verwenden, nie Rohwerte.
- **Schriften** werden per `<link>` aus Google Fonts geladen, nicht per CSS-`@import`.
  Die Einbindung ist in der Datenschutzerklärung dokumentiert. Bei Änderung dort nachziehen.
- **Bilder** vor dem Ablegen optimieren, keine Roh-PNGs.
- Die Seite ist einsprachig deutsch.

## Deployment

Push auf `main`, dann veröffentlicht GitHub Pages automatisch.
Die eigene Domain ist über `CNAME` gesetzt.
