(function () {

  // ─── DATA ─────────────────────────────────────────────────────────────────

  var PHASES = [
    {
      id: 'auftrag',
      label: 'Auftrag',
      lines: [
        { t: 'cmd',   s: '> lade_auftrag.py --fa FA-2024-0441', d: 0 },
        { t: 'blank', s: '', d: 200 },
        { t: 'muted', s: '  Fertigungsauftrag FA-2024-0441...', d: 380 },
        { t: 'blank', s: '', d: 560 },
        { t: 'head',  s: '  Variante: U-BOGEN-DN50-L320  (aus Variantenkonfigurator)', d: 660 },
        { t: 'sep',   s: '  ' + '─'.repeat(52), d: 720 },
        { t: 'muted', s: '  Typ           U-Rohrbogen', d: 920 },
        { t: 'muted', s: '  Werkstoff     1.4301', d: 1120 },
        { t: 'muted', s: '  Nennweite     DN50  (48,3 × 2,0 mm)', d: 1320 },
        { t: 'muted', s: '  Schenkel      A = 320 mm  /  B = 320 mm', d: 1520 },
        { t: 'muted', s: '  Stegbreite    580 mm', d: 1720 },
        { t: 'muted', s: '  Biegeradius   76 mm  (1,5 × D)', d: 1920 },
        { t: 'muted', s: '  Bohrung A/B   ø 52 mm  ·  Tiefe 22 mm', d: 2120 },
        { t: 'blank', s: '', d: 2220 },
        { t: 'ok',    s: '  → Parameter aus Variantentabelle geladen  ·  kein Eingriff nötig', d: 2420 }
      ]
    },
    {
      id: 'rohrbogen',
      label: 'Rohrbogen',
      lines: [
        { t: 'cmd',   s: '> geo_calc.py --typ U-BOGEN --out koordinaten,rohrbild', d: 0 },
        { t: 'blank', s: '', d: 200 },
        { t: 'head',  s: '  PUNKT    X (mm)    Y (mm)    R (mm)    AKTION', d: 380 },
        { t: 'sep',   s: '  ' + '─'.repeat(52), d: 440 },
        { t: 'ok',    s: '  A         0,0        0,0       —        Bohrung ø 52', d: 650 },
        { t: 'ok',    s: '  BP-1       0,0      320,0      76        90° Biegung', d: 870 },
        { t: 'ok',    s: '  BP-2     580,0      320,0      76        90° Biegung', d: 1090 },
        { t: 'ok',    s: '  B       580,0        0,0       —        Bohrung ø 52', d: 1310 },
        { t: 'blank', s: '', d: 1410 },
        { t: 'muted', s: '  Entwickelte Länge:   1.544,3 mm', d: 1590 },
        { t: 'blank', s: '', d: 1690 },
        { t: 'svg-pipe', s: '', d: 1880 }
      ]
    },
    {
      id: 'rohrplatte',
      label: 'Rohrplatte',
      lines: [
        { t: 'cmd',   s: '> nc_gen.py --typ ROHRPLATTE --raster 55x45 --n 12', d: 0 },
        { t: 'blank', s: '', d: 200 },
        { t: 'muted', s: '  Berechne Bohrungskoordinaten (Schlangenlauf)...', d: 380 },
        { t: 'blank', s: '', d: 500 },
        { t: 'head',  s: '  NR    X (mm)    Y (mm)    ø (mm)    T (mm)', d: 660 },
        { t: 'sep',   s: '  ' + '─'.repeat(48), d: 720 },
        { t: 'ok',    s: '  01      0,0       0,0      52,0      22,0', d: 920 },
        { t: 'ok',    s: '  02     55,0       0,0      52,0      22,0', d: 1020 },
        { t: 'ok',    s: '  03    110,0       0,0      52,0      22,0', d: 1120 },
        { t: 'muted', s: '  ...', d: 1220 },
        { t: 'ok',    s: '  12    165,0      90,0      52,0      22,0', d: 1320 },
        { t: 'blank', s: '', d: 1420 },
        { t: 'muted', s: '  12 Bohrungen  ·  NC-Programm generiert', d: 1520 },
        { t: 'blank', s: '', d: 1620 },
        { t: 'svg-plate', s: '', d: 1820 }
      ]
    },
    {
      id: 'systeme',
      label: 'Systeme',
      lines: [
        { t: 'cmd',   s: '> sync.py --fa FA-2024-0441 --targets all', d: 0 },
        { t: 'blank', s: '', d: 200 },
        { t: 'ok',    s: '  ✓ DXF Rohrbogen     →  RO-7731_v1.dxf', d: 450 },
        { t: 'ok',    s: '  ✓ DXF Rohrplatte    →  RP-7731_v1.dxf', d: 750 },
        { t: 'ok',    s: '  ✓ NC-Programm       →  BIEGE_7731.nc · BOHR_7731.nc', d: 1050 },
        { t: 'ok',    s: '  ✓ Fertigungsauftrag →  FA-2024-0441: bereit', d: 1350 },
        { t: 'blank', s: '', d: 1450 },
        { t: 'ok',    s: '  5 Dokumente  ·  0 Doppeleingaben  ·  Konstruktion ✓', d: 1650 }
      ]
    }
  ];

  var PHASE_OFFSETS = [0, 3400, 6280, 9060];

  // ─── U-PIPE SVG ──────────────────────────────────────────────────────────
  // Tangential cubic bezier (correct geometry):
  //   Left  bend (UP→RIGHT):   C 80 78, 98 60, 120 60
  //   Right bend (RIGHT→DOWN): C 302 60, 320 78, 320 100

  var UPIPE_PATH = 'M 80 240 L 80 100 C 80 78 98 60 120 60 L 280 60 C 302 60 320 78 320 100 L 320 240';

  function buildPipeSVG() {
    return '<svg class="pipe-svg pipe-svg--upipe" width="100%" viewBox="0 0 420 310" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
      + '<path class="p-body"   d="' + UPIPE_PATH + '" stroke="#3d444d" stroke-width="24" stroke-linejoin="round" stroke-linecap="butt"/>'
      + '<path class="p-glow"   d="' + UPIPE_PATH + '" stroke="#6366f1" stroke-width="24" fill="none" stroke-linejoin="round" stroke-linecap="butt" opacity="0.08"/>'
      + '<path class="p-hollow" d="' + UPIPE_PATH + '" stroke="#0d1117" stroke-width="14" stroke-linejoin="round" stroke-linecap="butt"/>'
      + '<line class="p-annot" x1="68"  y1="240" x2="92"  y2="240" stroke="#4b5563" stroke-width="2.5"/>'
      + '<line class="p-annot" x1="308" y1="240" x2="332" y2="240" stroke="#4b5563" stroke-width="2.5"/>'
      + '<circle class="p-annot" cx="80"  cy="240" r="20" stroke="#6366f1" stroke-width="1" stroke-dasharray="4 3"/>'
      + '<circle class="p-annot" cx="320" cy="240" r="20" stroke="#6366f1" stroke-width="1" stroke-dasharray="4 3"/>'
      + '<line class="p-annot" x1="80"  y1="224" x2="80"  y2="256" stroke="#484f58" stroke-width="1"/>'
      + '<line class="p-annot" x1="64"  y1="240" x2="96"  y2="240" stroke="#484f58" stroke-width="1"/>'
      + '<line class="p-annot" x1="320" y1="224" x2="320" y2="256" stroke="#484f58" stroke-width="1"/>'
      + '<line class="p-annot" x1="304" y1="240" x2="336" y2="240" stroke="#484f58" stroke-width="1"/>'
      + '<text class="p-annot" x="80"  y="271" fill="#6e7681" font-size="8.5" font-family="monospace" text-anchor="middle">ø 52</text>'
      + '<text class="p-annot" x="80"  y="283" fill="#6e7681" font-size="8"   font-family="monospace" text-anchor="middle">A (0 / 0)</text>'
      + '<text class="p-annot" x="320" y="271" fill="#6e7681" font-size="8.5" font-family="monospace" text-anchor="middle">ø 52</text>'
      + '<text class="p-annot" x="320" y="283" fill="#6e7681" font-size="8"   font-family="monospace" text-anchor="middle">B (580 / 0)</text>'
      + '<line class="p-annot" x1="36" y1="100" x2="36" y2="240" stroke="#484f58" stroke-width="1"/>'
      + '<line class="p-annot" x1="32" y1="100" x2="40" y2="100" stroke="#484f58" stroke-width="1"/>'
      + '<line class="p-annot" x1="32" y1="240" x2="40" y2="240" stroke="#484f58" stroke-width="1"/>'
      + '<text class="p-annot" transform="rotate(-90 23 170)" x="23" y="174" fill="#6e7681" font-size="8" font-family="monospace" text-anchor="middle">A = 320</text>'
      + '<line class="p-annot" x1="80"  y1="297" x2="320" y2="297" stroke="#484f58" stroke-width="1"/>'
      + '<line class="p-annot" x1="80"  y1="293" x2="80"  y2="301" stroke="#484f58" stroke-width="1"/>'
      + '<line class="p-annot" x1="320" y1="293" x2="320" y2="301" stroke="#484f58" stroke-width="1"/>'
      + '<text class="p-annot" x="200" y="308" fill="#6e7681" font-size="8" font-family="monospace" text-anchor="middle">W = 580</text>'
      + '<text class="p-annot" x="107" y="78"  fill="#6e7681" font-size="8" font-family="monospace">R 76</text>'
      + '<circle class="p-annot" cx="80"  cy="100" r="3" fill="#6366f1" opacity="0.6"/>'
      + '<circle class="p-annot" cx="320" cy="100" r="3" fill="#6366f1" opacity="0.6"/>'
      + '<text class="p-annot" x="54"  y="97" fill="#6e7681" font-size="7.5" font-family="monospace">BP-1</text>'
      + '<text class="p-annot" x="324" y="97" fill="#6e7681" font-size="7.5" font-family="monospace">BP-2</text>'
      + '<text class="p-annot" x="200" y="42" fill="#6e7681" font-size="9" font-family="monospace" text-anchor="middle">RO-7731 · DN50 · 48,3×2,0 · WS 1.4301</text>'
      + '</svg>';
  }

  function animatePipe(wrapper) {
    var svg = wrapper.querySelector('.pipe-svg');
    if (!svg) return;
    svg.querySelectorAll('.p-annot').forEach(function (el) { el.style.opacity = '0'; });
    var paths = svg.querySelectorAll('.p-body, .p-glow, .p-hollow');
    paths.forEach(function (p) {
      var len = p.getTotalLength();
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
    });
    svg.getBoundingClientRect();
    paths.forEach(function (p) {
      p.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(0.4,0,0.2,1)';
      p.style.strokeDashoffset = '0';
    });
    setTimeout(function () {
      svg.querySelectorAll('.p-annot').forEach(function (el) {
        el.style.transition = 'opacity 0.7s ease';
        el.style.opacity = '1';
      });
    }, 1500);
  }

  // ─── ROHRPLATTE SVG + HEIDENHAIN NC ──────────────────────────────────────
  // Round plate, center web (Steg), symmetry line.
  // 16 bores (3-5-5-3), symmetric. Snake NC sequence.
  // Heidenhain program runs in sync alongside the bore animation.

  var CX = 140, CY = 100, PRAD = 85;
  var STEG_TOP = 89, STEG_BOT = 111; // ±11 px from center

  // Bore positions (SVG px). NC coords = (x-CX, -(y-CY)) mm.
  var PLATE_BORES = [
    {x:107,y:42},  {x:140,y:42},  {x:173,y:42},              // row B L→R
    {x:206,y:66},  {x:173,y:66},  {x:140,y:66},  {x:107,y:66},  {x:74,y:66},   // row A R→L
    {x:74,y:134},  {x:107,y:134}, {x:140,y:134}, {x:173,y:134}, {x:206,y:134}, // row C L→R
    {x:173,y:158}, {x:140,y:158}, {x:107,y:158}               // row D R→L
  ];

  function buildPlateSVG() {
    var html = '<svg class="pipe-svg pipe-svg--plate" width="100%" viewBox="0 0 290 208" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
      + '<defs><clipPath id="pc"><circle cx="' + CX + '" cy="' + CY + '" r="' + PRAD + '"/></clipPath></defs>'
      // plate
      + '<circle cx="' + CX + '" cy="' + CY + '" r="' + PRAD + '" fill="#161b22" stroke="#3d444d" stroke-width="2"/>'
      // Steg band
      + '<rect x="50" y="' + STEG_TOP + '" width="180" height="' + (STEG_BOT - STEG_TOP) + '" fill="#1e2530" clip-path="url(#pc)"/>'
      // Steg boundary lines
      + '<line x1="52" y1="' + STEG_TOP + '" x2="228" y2="' + STEG_TOP + '" stroke="#484f58" stroke-width="0.7" stroke-dasharray="4 3" clip-path="url(#pc)"/>'
      + '<line x1="52" y1="' + STEG_BOT + '" x2="228" y2="' + STEG_BOT + '" stroke="#484f58" stroke-width="0.7" stroke-dasharray="4 3" clip-path="url(#pc)"/>'
      // symmetry line
      + '<line x1="48" y1="' + CY + '" x2="236" y2="' + CY + '" stroke="#6366f1" stroke-width="0.8" stroke-dasharray="8 4" opacity="0.4"/>';

    // bores — smaller (r=7)
    PLATE_BORES.forEach(function (b, i) {
      html += '<g class="plate-bore">'
        + '<circle cx="' + b.x + '" cy="' + b.y + '" r="7" fill="#0d1117" stroke="#30363d" stroke-width="1.2"/>'
        + '<text x="' + b.x + '" y="' + (b.y + 2.5) + '" text-anchor="middle" fill="#484f58" font-size="5.5" font-family="monospace">' + String(i + 1).padStart(2, '0') + '</text>'
        + '</g>';
    });

    // annotations
    html
      += '<line class="p-annot" x1="240" y1="' + STEG_TOP + '" x2="240" y2="' + STEG_BOT + '" stroke="#484f58" stroke-width="1"/>'
      + '<line class="p-annot" x1="237" y1="' + STEG_TOP + '" x2="243" y2="' + STEG_TOP + '" stroke="#484f58" stroke-width="1"/>'
      + '<line class="p-annot" x1="237" y1="' + STEG_BOT + '" x2="243" y2="' + STEG_BOT + '" stroke="#484f58" stroke-width="1"/>'
      + '<text class="p-annot" x="246" y="' + (CY + 3) + '" fill="#6e7681" font-size="7" font-family="monospace">Steg</text>'
      + '<text class="p-annot" x="244" y="' + (CY + 12) + '" fill="#6366f1" font-size="6.5" font-family="monospace" opacity="0.7">Sym.</text>'
      + '<text class="p-annot" x="' + CX + '" y="10" fill="#6e7681" font-size="7.5" font-family="monospace" text-anchor="middle">Rohrplatte · 16× ø 52 · t = 22</text>'
      + '<text class="p-annot" x="' + CX + '" y="200" fill="#6e7681" font-size="6.5" font-family="monospace" text-anchor="middle">Schlangenlauf · Raster 33 mm · Steg ±11 mm</text>'
      + '</svg>';
    return html;
  }

  function buildNcProg() {
    var lines = [
      { cls: 'nc-h', t: 'BEGIN PGM BOHR_7731 MM' },
      { cls: 'nc-h', t: '; FA-2024-0441 · 16× ø52 t=22' },
      { cls: 'nc-h', t: '' },
      { cls: 'nc-h', t: 'TOOL CALL 5 Z S800 F120' },
      { cls: 'nc-h', t: 'L Z+100 R0 FMAX' },
      { cls: 'nc-h', t: '' },
      { cls: 'nc-h', t: 'CYCL DEF 200 BOHREN' },
      { cls: 'nc-h', t: '  Q200=+2  Q201=-22' },
      { cls: 'nc-h', t: '  Q206=+120  Q202=+5' },
      { cls: 'nc-h', t: '' }
    ];
    PLATE_BORES.forEach(function (b, i) {
      var nx = b.x - CX;
      var ny = -(b.y - CY);
      var xs = (nx >= 0 ? '+' : '') + nx;
      var ys = (ny >= 0 ? '+' : '') + ny;
      lines.push({ cls: 'nc-b', id: 'nc' + i, t: 'L X' + xs + ' Y' + ys + ' R0 FMAX M99' });
    });
    lines.push({ cls: 'nc-h', t: '' });
    lines.push({ cls: 'nc-h', t: 'END PGM BOHR_7731 MM' });

    return lines.map(function (l) {
      var id = l.id ? ' id="' + l.id + '"' : '';
      return '<div class="' + l.cls + '"' + id + '>' + (l.t || '&nbsp;') + '</div>';
    }).join('');
  }

  function animatePlate(wrapper) {
    var bores = wrapper.querySelectorAll('.plate-bore');
    var ncEl  = wrapper.querySelector('.nc-scroll');
    bores.forEach(function (bore, i) {
      setTimeout(function () {
        var circle = bore.querySelector('circle');
        var label  = bore.querySelector('text');
        if (circle) { circle.setAttribute('stroke', '#6366f1'); circle.style.fill = 'rgba(99,102,241,0.12)'; }
        if (label)  { label.setAttribute('fill', '#818cf8'); }
        if (ncEl) {
          var prev = ncEl.querySelector('.nc-b--on');
          if (prev) prev.classList.remove('nc-b--on');
          var line = ncEl.querySelector('#nc' + i);
          if (line) {
            line.classList.add('nc-b--on');
            line.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
      }, i * 280);
    });
  }

  // ─── KPI PANEL ────────────────────────────────────────────────────────────

  function kpiEl(id) { return document.getElementById(id); }

  function kpiReset() {
    var s = kpiEl('kpiStatus');
    if (s) { s.className = 'kpi-status kpi-status--running'; s.innerHTML = '<span class="kpi-dot"></span><span>Pipeline läuft…</span>'; }
    var qv = kpiEl('kpiQualityVal'); if (qv) qv.textContent = '—';
    var qc = kpiEl('kpiQualityChange'); if (qc) { qc.textContent = 'lädt Variante'; qc.className = 'kpi-change'; }
    var dv = kpiEl('kpiDupesVal'); if (dv) dv.textContent = '3';
    var dc = kpiEl('kpiDupesChange'); if (dc) { dc.textContent = 'manuelle Übergänge'; dc.className = 'kpi-change kpi-change--warn'; }
    var tv = kpiEl('kpiTimeVal'); if (tv) tv.textContent = '—';
    var bar = kpiEl('kpiBarAfter'); if (bar) { bar.style.transition = 'none'; bar.style.width = '0%'; }
    var bpct = kpiEl('kpiBarAfterPct'); if (bpct) bpct.textContent = '0';
    var log = kpiEl('kpiLog'); if (log) log.innerHTML = '<div class="kpi-log-item kpi-log-wait">Verarbeitung läuft…</div>';
    setWorkflow(2); // "Konstruktion" active
  }

  function kpiAfterPhase2() {
    setTimeout(function () {
      var bar = kpiEl('kpiBarAfter');
      if (bar) { bar.style.transition = 'width 2s ease'; bar.style.width = '100%'; }
      var bpct = kpiEl('kpiBarAfterPct');
      if (bpct) { var n = 0; var iv = setInterval(function () { n += 4; if (n >= 100) { n = 100; clearInterval(iv); } bpct.textContent = n + '%'; }, 50); }
    }, PHASE_OFFSETS[2] + 1000);
  }

  function kpiAfterPhase3() {
    setTimeout(function () {
      var qv = kpiEl('kpiQualityVal'); if (qv) qv.textContent = '5';
      var qc = kpiEl('kpiQualityChange'); if (qc) { qc.textContent = 'Systeme befüllt'; qc.className = 'kpi-change kpi-change--ok'; }
      var dv = kpiEl('kpiDupesVal'); if (dv) dv.textContent = '0';
      var dc = kpiEl('kpiDupesChange'); if (dc) { dc.textContent = '↓ kein Transfer nötig'; dc.className = 'kpi-change kpi-change--ok'; }
      var tv = kpiEl('kpiTimeVal'); if (tv) tv.textContent = '4.1s';
      var tc = kpiEl('kpiTimeChange'); if (tc) { tc.textContent = '↑ vs. ~2h manuell'; tc.className = 'kpi-change kpi-change--ok'; }
    }, PHASE_OFFSETS[3] + 400);

    setTimeout(function () {
      var log = kpiEl('kpiLog');
      if (!log) return;
      var now = new Date(); var hh = now.getHours(); var mm = String(now.getMinutes()).padStart(2, '0');
      log.innerHTML =
        '<div class="kpi-log-item kpi-log-ok">✓ RO-7731_v1.dxf  ' + hh + ':' + mm + '</div>'
        + '<div class="kpi-log-item kpi-log-ok">✓ RP-7731_v1.dxf  Rohrplatte</div>'
        + '<div class="kpi-log-item kpi-log-ok">✓ BIEGE_7731.nc · BOHR_7731.nc</div>';
    }, PHASE_OFFSETS[3] + 700);

    setTimeout(function () { setWorkflow(3); }, PHASE_OFFSETS[3] + 1200); // Beschaffung active
  }

  function kpiDone() {
    var s = kpiEl('kpiStatus');
    if (s) { s.className = 'kpi-status kpi-status--ok'; s.innerHTML = '<span class="kpi-dot"></span><span>Alle Systeme aktuell</span>'; }
  }

  // ─── WORKFLOW TRACKER ─────────────────────────────────────────────────────

  var WF_STEPS = ['Vertrieb', 'KfM', 'Konstruktion', 'Beschaffung', 'Dispo', 'Fertigung'];

  function setWorkflow(activeIndex) {
    var container = document.getElementById('kpiWorkflow');
    if (!container) return;
    var html = '';
    WF_STEPS.forEach(function (step, i) {
      var cls = i < activeIndex ? 'wf-step wf-done' : (i === activeIndex ? 'wf-step wf-active' : 'wf-step');
      html += '<span class="' + cls + '">' + step + '</span>';
      if (i < WF_STEPS.length - 1) html += '<span class="wf-arrow">›</span>';
    });
    container.querySelector('.workflow-steps').innerHTML = html;
  }

  // ─── ENGINE ───────────────────────────────────────────────────────────────

  var tids = []; var running = false;
  function sched(fn, d) { tids.push(setTimeout(fn, d)); }
  function cancelAll() { tids.forEach(clearTimeout); tids = []; running = false; }

  function setStep(i) {
    document.querySelectorAll('.ps-step').forEach(function (el, idx) {
      el.classList.remove('ps-step--active', 'ps-step--done');
      if (idx === i) el.classList.add('ps-step--active');
      if (idx < i)  el.classList.add('ps-step--done');
    });
  }

  function appendLine(output, type, text) {
    var el = document.createElement('div');
    if (type === 'svg-pipe') {
      el.className = 'tl tl-svg';
      el.innerHTML = buildPipeSVG();
      output.appendChild(el);
      requestAnimationFrame(function () { animatePipe(el); });
    } else if (type === 'svg-plate') {
      el.className = 'tl tl-svg';
      el.innerHTML = '<div class="plate-split">'
        + '<div class="plate-svg-col">' + buildPlateSVG() + '</div>'
        + '<div class="plate-nc-col"><div class="nc-scroll">' + buildNcProg() + '</div></div>'
        + '</div>';
      output.appendChild(el);
      setTimeout(function () { animatePlate(el); }, 30);
    } else if (type === 'blank') {
      el.className = 'tl tl-blank'; output.appendChild(el);
    } else {
      el.className = 'tl tl-' + type;
      el.textContent = text;
      output.appendChild(el);
    }
    output.scrollTop = output.scrollHeight;
  }

  function appendPhaseSep(output, label) {
    var el = document.createElement('div');
    el.className = 'tl-phase-sep';
    el.textContent = '── ' + label + ' ';
    output.appendChild(el);
    output.scrollTop = output.scrollHeight;
  }

  var PHASE_LABELS = ['Auftrag laden', 'Rohrbogen', 'Rohrplatte', 'Systeme aktualisieren'];

  function run() {
    if (running) return;
    running = true;
    var output = document.getElementById('termOutput');
    var btn    = document.getElementById('termBtn');
    if (!output || !btn) return;

    output.innerHTML = '';
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Läuft…';

    kpiReset();
    kpiAfterPhase2();
    kpiAfterPhase3();

    var globalOffset = 0;
    PHASES.forEach(function (phase, pi) {
      var offset = globalOffset;
      sched(function () { setStep(pi); appendPhaseSep(output, PHASE_LABELS[pi]); }, offset);
      var maxD = 0;
      phase.lines.forEach(function (line) {
        if (line.d > maxD) maxD = line.d;
        sched(function () { appendLine(output, line.t, line.s); }, offset + 280 + line.d);
      });
      globalOffset += 280 + maxD + 700;
    });

    sched(function () {
      setStep(PHASES.length);
      kpiDone();
      running = false;
      btn.disabled = false;
      btn.querySelector('span').textContent = 'Nochmal';
      var cur = document.createElement('span');
      cur.className = 'term-cursor'; cur.textContent = '▋';
      output.appendChild(cur);
      output.scrollTop = output.scrollHeight;
    }, globalOffset);
  }

  // ─── INIT ─────────────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('termBtn');
    if (btn) {
      btn.addEventListener('click', function () { cancelAll(); run(); });
    }
    setWorkflow(2);
    window.pipelineRun = function () { cancelAll(); run(); };
  });

})();
