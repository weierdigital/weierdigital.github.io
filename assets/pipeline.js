// Pipeline-Terminal Animation für System-Tab
function initPipelineDemo() {
  var body = document.getElementById('pipeTermBody');
  if (!body || body.dataset.ran) return;
  body.dataset.ran = '1';

  var lines = [
    { text: '$ pipeline.py --fa 2024-0441',          cls: 'pt-cmd',  delay: 0 },
    { text: '→ Lade FA aus ERP...',                   cls: 'pt-info', delay: 600 },
    { text: '  ✓ Auftrag 2024-0441 geladen',          cls: 'pt-ok',   delay: 1000 },
    { text: '→ Berechne Rohrbogen-Geometrie...',       cls: 'pt-info', delay: 1400 },
    { text: '  ✓ R=80 · 90° · L1=100 · L2=120',      cls: 'pt-ok',   delay: 1900 },
    { text: '→ Generiere CAD-Modell (STEP)...',        cls: 'pt-info', delay: 2300 },
    { text: '  ✓ rohr_2024-0441.step erstellt',       cls: 'pt-ok',   delay: 2900 },
    { text: '→ Erstelle NC-Programm (Heidenhain)...',  cls: 'pt-info', delay: 3300 },
    { text: '  ✓ program_2024-0441.h erstellt',       cls: 'pt-ok',   delay: 3900 },
    { text: '→ Exportiere Fertigungsdokumente...',     cls: 'pt-info', delay: 4200 },
    { text: '  ✓ PDF · DXF · Stückliste',             cls: 'pt-ok',   delay: 4700 },
    { text: '',                                        cls: 'pt-info', delay: 5000 },
    { text: '✓ Fertig in 4.1s',                       cls: 'pt-done', delay: 5100 },
  ];

  lines.forEach(function(line) {
    setTimeout(function() {
      var div = document.createElement('div');
      div.className = 'pt-line ' + line.cls;
      div.textContent = line.text;
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
    }, line.delay);
  });

  // SVG Rohrbogen einzeichnen
  document.querySelectorAll('.pipe-draw').forEach(function(el, i) {
    setTimeout(function() {
      el.style.transition = 'stroke-dashoffset ' + (0.6 + i * 0.2) + 's ease';
      el.style.strokeDashoffset = '0';
    }, 200 + i * 400);
  });

  // Bemaßungen + Badge nach Rohr einblenden
  setTimeout(function() {
    var dims = document.querySelector('.pipe-dims');
    var badge = document.querySelector('.pipe-badge');
    if (dims)  dims.classList.add('pipe-dims--visible');
    if (badge) badge.classList.add('pipe-badge--visible');
  }, 1800);
}
