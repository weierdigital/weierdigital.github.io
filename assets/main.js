(function(){
  const root = document.documentElement;
  const themeKey = "weier_theme";
  const langKey = "weier_lang";

  // Theme Functions
  function updateThemeIcon(t){
    const btn = document.getElementById("themeToggle");
    if(!btn) return;
    btn.setAttribute("aria-label", t === "dark" ? "Light mode" : "Dark mode");
    const sun = btn.querySelector('[data-ic="sun"]');
    const moon = btn.querySelector('[data-ic="moon"]');
    if(sun && moon){
      sun.style.display = (t === "dark") ? "block" : "none";
      moon.style.display = (t === "dark") ? "none" : "block";
    }
  }

  function getPreferredTheme(){
    const saved = localStorage.getItem(themeKey);
    if(saved === "light" || saved === "dark") return saved;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function setTheme(t){
    root.setAttribute("data-theme", t);
    localStorage.setItem(themeKey, t);
    updateThemeIcon(t);
  }

  // Language Functions
  function getPreferredLang(){
    const saved = localStorage.getItem(langKey);
    if(saved === "de" || saved === "en") return saved;
    const browserLang = navigator.language || navigator.userLanguage || "de";
    return browserLang.startsWith('de') ? 'de' : 'en';
  }

  function updateLangLabel(lang){
    const btn = document.getElementById("langToggle");
    if(!btn) return;
    const label = btn.querySelector('.lang-label');
    if(label) label.textContent = lang.toUpperCase();
    btn.setAttribute("aria-label", lang === "de" ? "Switch to English" : "Zu Deutsch wechseln");
  }

  function translatePage(lang){
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-de][data-en]').forEach(el => {
      const text = el.getAttribute(`data-${lang}`);
      if(text) el.textContent = text;
    });

    localStorage.setItem(langKey, lang);
    updateLangLabel(lang);
  }

  // Initialize on DOM load
  document.addEventListener("DOMContentLoaded", function(){
    // Theme
    const theme = getPreferredTheme();
    setTheme(theme);

    // Language
    const lang = getPreferredLang();
    translatePage(lang);

    // Theme toggle
    const themeBtn = document.getElementById("themeToggle");
    if(themeBtn){
      themeBtn.addEventListener("click", function(){
        const current = root.getAttribute("data-theme") || "light";
        setTheme(current === "dark" ? "light" : "dark");
      });
    }

    // Language toggle
    const langBtn = document.getElementById("langToggle");
    if(langBtn){
      langBtn.addEventListener("click", function(){
        const current = localStorage.getItem(langKey) || "de";
        translatePage(current === "de" ? "en" : "de");
      });
    }

    // Footer year
    const y = document.getElementById("y");
    if(y) y.textContent = new Date().getFullYear();

    // Gantt
    initGantt();
  });

  // ─── Gantt-Diagramm ──────────────────────────────────────────────────────

  function initGantt() {
    const wrap = document.getElementById('ganttWrap');
    if (!wrap) return;

    const WEEKS = 8;
    const tasks = [
      {
        de: 'Beschaffung', en: 'Procurement',
        note: { de: 'Vorlaufzeit ignoriert', en: 'Lead time ignored' },
        plan:  [0,   2],
        chaos: [0,   4.5],
      },
      {
        de: 'Rohmaterial-\nLieferung', en: 'Raw Material\nDelivery',
        note: { de: 'Warten auf Lieferant', en: 'Waiting on supplier' },
        plan:  [2,   3],
        chaos: [4.5, 5.8],
      },
      {
        de: 'CNC-Fertigung', en: 'CNC Machining',
        note: { de: 'Maschine steht leer', en: 'Machine sits idle' },
        plan:  [3,   5.5],
        chaos: [5.8, 7.8],
      },
      {
        de: 'Montage & QS', en: 'Assembly & QC',
        note: { de: 'Termin überschritten', en: 'Deadline exceeded' },
        plan:  [5.5, 7],
        chaos: [7.8, 8.6],
      },
      {
        de: 'Lieferung', en: 'Delivery',
        note: { de: 'Termin nicht haltbar', en: 'Delivery date missed' },
        plan:  [7,   7.8],
        chaos: null,
      },
    ];

    let mode = 'chaos';
    let cycleTimer = null;

    function pct(v)    { return (v / WEEKS * 100).toFixed(3) + '%'; }
    function span(s,e) { return ((e - s) / WEEKS * 100).toFixed(3) + '%'; }

    function build() {
      const lang = localStorage.getItem('weier_lang') || 'de';

      // Status bar
      const statusDiv = document.createElement('div');
      statusDiv.className = 'gantt-status gantt-status--err';
      statusDiv.id = 'ganttStatus';
      statusDiv.innerHTML = '<span class="gantt-status-icon">⚠</span>'
        + '<span id="ganttStatusText"></span>';
      wrap.appendChild(statusDiv);

      // Header
      const thead = document.createElement('div');
      thead.className = 'gantt-thead';
      const lhd = document.createElement('div');
      const wksDiv = document.createElement('div');
      wksDiv.className = 'gantt-wks';
      for (let w = 1; w <= WEEKS; w++) {
        const wk = document.createElement('div');
        wk.className = 'gantt-wk';
        wk.textContent = 'W' + w;
        wksDiv.appendChild(wk);
      }
      thead.appendChild(lhd);
      thead.appendChild(wksDiv);
      wrap.appendChild(thead);

      // Rows
      tasks.forEach((t, i) => {
        const row = document.createElement('div');
        row.className = 'gantt-row';

        // Label
        const lbl = document.createElement('div');
        lbl.className = 'gantt-label';
        const mainLabel = (lang === 'en' ? t.en : t.de).replace(/\n/g, '<br>');
        lbl.innerHTML = mainLabel;
        row.appendChild(lbl);

        // Bar area
        const bars = document.createElement('div');
        bars.className = 'gantt-bars';
        bars.dataset.idx = i;

        // Plan bar
        const planBar = document.createElement('div');
        planBar.className = 'gantt-bar-plan';
        planBar.id = 'gplan-' + i;
        planBar.style.left  = pct(t.plan[0]);
        planBar.style.width = span(t.plan[0], t.plan[1]);
        bars.appendChild(planBar);

        // Actual bar
        const actualBar = document.createElement('div');
        actualBar.className = 'gantt-bar-actual';
        actualBar.id = 'gact-' + i;
        const lspan = document.createElement('span');
        lspan.className = 'gantt-bar-label';
        lspan.id = 'gact-lbl-' + i;
        actualBar.appendChild(lspan);
        bars.appendChild(actualBar);

        // Problem marker
        const marker = document.createElement('div');
        marker.className = 'gantt-marker';
        marker.id = 'gmark-' + i;
        marker.textContent = '⚠';
        marker.style.opacity = '0';
        bars.appendChild(marker);

        // Failed overlay (delivery)
        const failed = document.createElement('div');
        failed.className = 'gantt-failed';
        failed.id = 'gfail-' + i;
        failed.innerHTML = '<svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#f85149" stroke-width="2" stroke-linecap="round"/></svg>'
          + '<span id="gfail-lbl-' + i + '">' + (lang === 'en' ? t.note.en : t.note.de) + '</span>';
        bars.appendChild(failed);

        row.appendChild(bars);
        wrap.appendChild(row);
      });
    }

    function applyMode(m, animate) {
      const lang = localStorage.getItem('weier_lang') || 'de';
      mode = m;

      const statusDiv  = document.getElementById('ganttStatus');
      const statusText = document.getElementById('ganttStatusText');

      if (m === 'chaos') {
        if (statusDiv)  { statusDiv.className = 'gantt-status gantt-status--err'; }
        if (statusText) {
          statusText.textContent = lang === 'en'
            ? '⏱  Delivery delayed by +3 weeks — machine idle, schedule cascades'
            : '⏱  Lieferung verzögert sich um +3 Wochen — Maschine steht, alles verschiebt sich';
        }
      } else {
        if (statusDiv)  { statusDiv.className = 'gantt-status gantt-status--ok'; }
        if (statusText) {
          statusText.textContent = lang === 'en'
            ? '✓  All steps coordinated — on time, no idle capacity'
            : '✓  Alle Schritte abgestimmt — pünktlich, keine Leerlaufzeiten';
        }
      }

      tasks.forEach((t, i) => {
        const act    = document.getElementById('gact-' + i);
        const marker = document.getElementById('gmark-' + i);
        const failed = document.getElementById('gfail-' + i);
        const lbl    = document.getElementById('gact-lbl-' + i);
        if (!act) return;

        if (m === 'chaos') {
          if (t.chaos) {
            act.style.left    = pct(t.chaos[0]);
            act.style.width   = span(t.chaos[0], t.chaos[1]);
            act.style.opacity = '1';
            act.className     = 'gantt-bar-actual gantt-bar-actual--err';
            if (lbl) lbl.textContent = lang === 'en' ? t.note.en : t.note.de;
            // marker at gap between plan-end and chaos-start
            if (marker) {
              const gapPos = t.plan[1] / WEEKS * 100;
              marker.style.left    = gapPos + '%';
              marker.style.opacity = t.chaos[0] > t.plan[1] ? '1' : '0';
            }
            if (failed) failed.style.opacity = '0';
          } else {
            // failed task (no chaos bar)
            act.style.opacity = '0';
            if (marker) marker.style.opacity = '0';
            if (failed) failed.style.opacity = '1';
          }
        } else {
          act.style.left    = pct(t.plan[0]);
          act.style.width   = span(t.plan[0], t.plan[1]);
          act.style.opacity = '1';
          act.className     = 'gantt-bar-actual gantt-bar-actual--ok';
          if (lbl)    lbl.textContent  = '';
          if (marker) marker.style.opacity = '0';
          if (failed) failed.style.opacity = '0';
        }
      });

      // Sync toggle buttons
      const bChaos = document.getElementById('gBtnChaos');
      const bPlan  = document.getElementById('gBtnPlan');
      if (bChaos && bPlan) {
        bChaos.className = 'gantt-btn' + (m === 'chaos' ? ' gantt-btn--on' : '');
        bPlan.className  = 'gantt-btn' + (m === 'plan'  ? ' gantt-btn--on' : '');
      }
    }

    function startCycle() {
      clearInterval(cycleTimer);
      cycleTimer = setInterval(() => {
        applyMode(mode === 'chaos' ? 'plan' : 'chaos');
      }, 5000);
    }

    // Build DOM
    build();
    // Start in chaos mode (bars at width 0 → animate in via IntersectionObserver)
    // Pre-set bar widths to 0 for entrance animation
    tasks.forEach((t, i) => {
      const act = document.getElementById('gact-' + i);
      if (act) { act.style.width = '0'; act.style.opacity = '0'; }
      const fail = document.getElementById('gfail-' + i);
      if (fail) fail.style.opacity = '0';
    });
    applyMode('chaos');
    // Force bars to 0 AFTER applyMode sets them, so transition plays
    tasks.forEach((t, i) => {
      const act = document.getElementById('gact-' + i);
      if (act) { act.style.transition = 'none'; act.style.width = '0'; act.style.opacity = '0'; }
    });

    // IntersectionObserver: animate bars in when visible
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        io.disconnect();
        // Re-enable transitions
        tasks.forEach((t, i) => {
          const act = document.getElementById('gact-' + i);
          if (act) act.style.transition = '';
        });
        // Stagger bar entrance
        tasks.forEach((t, i) => {
          setTimeout(() => { applyMode(mode); }, i * 120);
        });
        startCycle();
      });
    }, { threshold: 0.3 });
    io.observe(wrap);

    // Button handlers
    const bChaos = document.getElementById('gBtnChaos');
    const bPlan  = document.getElementById('gBtnPlan');
    if (bChaos) bChaos.addEventListener('click', () => { applyMode('chaos'); startCycle(); });
    if (bPlan)  bPlan.addEventListener('click',  () => { applyMode('plan');  startCycle(); });
  }

})();
