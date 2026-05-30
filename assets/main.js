(function(){
  const root     = document.documentElement;
  const themeKey = 'weier_theme';
  const langKey  = 'weier_lang';

  // ── Theme ────────────────────────────────────────────────────────────────────
  function updateThemeIcon(t){
    const btn = document.getElementById('themeToggle');
    if(!btn) return;
    btn.setAttribute('aria-label', t === 'dark' ? 'Light mode' : 'Dark mode');
    const sun  = btn.querySelector('[data-ic="sun"]');
    const moon = btn.querySelector('[data-ic="moon"]');
    if(sun && moon){
      sun.style.display  = t === 'dark' ? 'block' : 'none';
      moon.style.display = t === 'dark' ? 'none'  : 'block';
    }
  }
  function getPreferredTheme(){
    const s = localStorage.getItem(themeKey);
    if(s === 'light' || s === 'dark') return s;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function setTheme(t){
    root.setAttribute('data-theme', t);
    localStorage.setItem(themeKey, t);
    updateThemeIcon(t);
  }

  // ── Language ──────────────────────────────────────────────────────────────────
  function getPreferredLang(){
    const s = localStorage.getItem(langKey);
    if(s === 'de' || s === 'en') return s;
    return (navigator.language || 'de').startsWith('de') ? 'de' : 'en';
  }
  function updateLangLabel(lang){
    const btn = document.getElementById('langToggle');
    if(!btn) return;
    const lbl = btn.querySelector('.lang-label');
    if(lbl) lbl.textContent = lang.toUpperCase();
    btn.setAttribute('aria-label', lang === 'de' ? 'Switch to English' : 'Zu Deutsch wechseln');
  }
  function translatePage(lang){
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-de][data-en]').forEach(el => {
      const t = el.getAttribute('data-' + lang);
      if(t) el.textContent = t;
    });
    localStorage.setItem(langKey, lang);
    updateLangLabel(lang);
  }

  // ── Hamburger (opacity + transform + backdrop) ────────────────────────────────
  function initHamburger(){
    const toggle   = document.getElementById('navToggle');
    const menu     = document.getElementById('mainMenu');
    const backdrop = document.getElementById('navBackdrop');
    if(!toggle || !menu) return;

    function openMenu(){
      menu.classList.add('menu--open');
      toggle.setAttribute('aria-expanded', 'true');
      if(backdrop){
        backdrop.style.display = 'block';
        requestAnimationFrame(() => backdrop.classList.add('bd--open'));
      }
    }
    function closeMenu(){
      menu.classList.remove('menu--open');
      toggle.setAttribute('aria-expanded', 'false');
      if(backdrop){
        backdrop.classList.remove('bd--open');
        setTimeout(() => {
          if(!backdrop.classList.contains('bd--open')) backdrop.style.display = 'none';
        }, 200);
      }
    }

    toggle.addEventListener('click', e => {
      e.stopPropagation();
      menu.classList.contains('menu--open') ? closeMenu() : openMenu();
    });
    if(backdrop) backdrop.addEventListener('click', closeMenu);
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  }

  // ── System-Bereich: open / close ──────────────────────────────────────────────
  function openSystemBereich(tabName){
    const sb = document.getElementById('system-bereich');
    if(!sb) return;
    activateTab(tabName);
    sb.style.display = 'block';
    // setTimeout instead of rAF: rAF may not fire in unfocused iframes/tabs
    setTimeout(() => sb.classList.add('sb--open'), 20);
    setTimeout(() => sb.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  }

  function closeSystemBereich(){
    const sb = document.getElementById('system-bereich');
    if(!sb) return;
    sb.classList.remove('sb--open');
    setTimeout(() => {
      if(!sb.classList.contains('sb--open')) sb.style.display = 'none';
    }, 380);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── Tabs (3-tab: system | handarbeit | planung) ───────────────────────────────
  let _ganttInited      = false;
  let _handarbeitInited = false;

  const TAB_MAP = {
    system:     { stab: 'stabSystem',     panel: 'tabSystem'     },
    handarbeit: { stab: 'stabHandarbeit', panel: 'tabHandarbeit' },
    planung:    { stab: 'stabPlanung',    panel: 'tabPlanung'    },
  };

  function activateTab(name){
    Object.entries(TAB_MAP).forEach(([key, {stab, panel}]) => {
      const stabEl  = document.getElementById(stab);
      const panelEl = document.getElementById(panel);
      const active  = key === name;
      if(stabEl){
        stabEl.className = 'stab' + (active ? ' stab--on' : '');
        stabEl.setAttribute('aria-selected', String(active));
      }
      if(panelEl) panelEl.classList.toggle('stab-panel--hidden', !active);
    });

    if(name === 'planung' && !_ganttInited){
      _ganttInited = true;
      setTimeout(triggerGanttAnim, 80);
    }
    if(name === 'handarbeit' && !_handarbeitInited){
      _handarbeitInited = true;
      setTimeout(runHandarbeitAnim, 120);
    }
  }

  function initTabs(){
    Object.entries(TAB_MAP).forEach(([key, {stab}]) => {
      const stabEl = document.getElementById(stab);
      if(stabEl) stabEl.addEventListener('click', () => activateTab(key));
    });
    const backBtn = document.getElementById('sysBack');
    if(backBtn) backBtn.addEventListener('click', closeSystemBereich);
  }

  // ── Sneak-peek card → open System-Bereich ─────────────────────────────────────
  function initCardLinks(){
    document.querySelectorAll('.card--sneak').forEach(card => {
      const tabName = card.dataset.tab;
      if(!tabName) return;
      function go(){
        openSystemBereich(tabName);
      }
      card.addEventListener('click', go);
      card.addEventListener('keydown', e => {
        if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); go(); }
      });
    });
  }

  // ── Handarbeit terminal ───────────────────────────────────────────────────────
  function runHandarbeitAnim(){
    const body = document.getElementById('haTermBody');
    if(!body) return;
    const lang = localStorage.getItem(langKey) || 'de';
    const lines = lang === 'en' ? [
      { c:'ha-tl-cmd',   t:'> auftrag-sync.py --id 2024-0552' },
      { c:'ha-tl-info',  t:'→ Order #2024-0552 detected...' },
      { c:'ha-tl-ok',    t:'✓ BOM loaded (24 items)' },
      { c:'ha-tl-muted', t:'  → Exporting stueckliste_2024-0552.xlsx' },
      { c:'ha-tl-ok',    t:'✓ BOM exported' },
      { c:'ha-tl-info',  t:'→ Creating production order...' },
      { c:'ha-tl-ok',    t:'✓ FA-2024-0552 created in PPS' },
      { c:'ha-tl-info',  t:'→ Reserving material (Storage A3)...' },
      { c:'ha-tl-ok',    t:'✓ 6× S235JR Ø40mm reserved' },
      { c:'ha-tl-info',  t:'→ Generating delivery note...' },
      { c:'ha-tl-ok',    t:'✓ LS-2024-0552.pdf ready' },
      { c:'ha-tl-sep',   t:'─────────────────────────────' },
      { c:'ha-tl-total', t:'✓ Done in 7.3s' },
    ] : [
      { c:'ha-tl-cmd',   t:'> auftrag-sync.py --id 2024-0552' },
      { c:'ha-tl-info',  t:'→ Auftrag #2024-0552 erkannt...' },
      { c:'ha-tl-ok',    t:'✓ Stückliste geladen (24 Positionen)' },
      { c:'ha-tl-muted', t:'  → Exportiere stueckliste_2024-0552.xlsx' },
      { c:'ha-tl-ok',    t:'✓ Stückliste exportiert' },
      { c:'ha-tl-info',  t:'→ Fertigungsauftrag anlegen...' },
      { c:'ha-tl-ok',    t:'✓ FA-2024-0552 im PPS angelegt' },
      { c:'ha-tl-info',  t:'→ Material reservieren (Lager A3)...' },
      { c:'ha-tl-ok',    t:'✓ 6× S235JR Ø40mm reserviert' },
      { c:'ha-tl-info',  t:'→ Lieferschein generieren...' },
      { c:'ha-tl-ok',    t:'✓ LS-2024-0552.pdf bereit' },
      { c:'ha-tl-sep',   t:'─────────────────────────────' },
      { c:'ha-tl-total', t:'✓ Fertig in 7.3s' },
    ];
    body.innerHTML = '';
    let delay = 0;
    lines.forEach((line, i) => {
      delay += i === 0 ? 0 : (line.c.includes('info') ? 320 : 160);
      setTimeout(() => {
        const s = document.createElement('span');
        s.className = 'ha-tl ' + line.c;
        s.textContent = line.t;
        body.appendChild(s);
        body.scrollTop = body.scrollHeight;
      }, delay);
    });
  }

  // ── Gantt ──────────────────────────────────────────────────────────────────────
  const GANTT_WEEKS = 8;
  const GANTT_TASKS = [
    { de:'Beschaffung',             en:'Procurement',
      note:{ de:'Vorlaufzeit ignoriert', en:'Lead time ignored' },
      plan:[0,2],     chaos:[0,4.5] },
    { de:'Rohmaterial-\nLieferung', en:'Raw Material\nDelivery',
      note:{ de:'Warten auf Lieferant', en:'Waiting on supplier' },
      plan:[2,3],     chaos:[4.5,5.8] },
    { de:'CNC-Fertigung',           en:'CNC Machining',
      note:{ de:'Maschine steht leer', en:'Machine sits idle' },
      plan:[3,5.5],   chaos:[5.8,7.8] },
    { de:'Montage & QS',            en:'Assembly & QC',
      note:{ de:'Termin überschritten', en:'Deadline exceeded' },
      plan:[5.5,7],   chaos:[7.8,8.6] },
    { de:'Lieferung',               en:'Delivery',
      note:{ de:'Termin nicht haltbar', en:'Delivery date missed' },
      plan:[7,7.8],   chaos:null },
  ];

  let _ganttMode     = 'chaos';
  let _ganttAnimated = false;
  let _ganttTimer    = null;

  function gPct(v)    { return (v / GANTT_WEEKS * 100).toFixed(3) + '%'; }
  function gSpan(s,e) { return ((e - s) / GANTT_WEEKS * 100).toFixed(3) + '%'; }

  function applyGanttMode(m){
    _ganttMode = m;
    const lang = localStorage.getItem(langKey) || 'de';
    const sd = document.getElementById('ganttStatus');
    const st = document.getElementById('ganttStatusText');
    if(m === 'chaos'){
      if(sd) sd.className = 'gantt-status gantt-status--err';
      if(st) st.textContent = lang === 'en'
        ? '⏱  Delivery delayed +3 weeks — machine idle, schedule cascades'
        : '⏱  Lieferung verzögert sich um +3 Wochen — Maschine steht, alles verschiebt sich';
    } else {
      if(sd) sd.className = 'gantt-status gantt-status--ok';
      if(st) st.textContent = lang === 'en'
        ? '✓  All steps coordinated — on time, no idle capacity'
        : '✓  Alle Schritte abgestimmt — pünktlich, keine Leerlaufzeiten';
    }
    GANTT_TASKS.forEach((t, i) => {
      const act    = document.getElementById('gact-' + i);
      const marker = document.getElementById('gmark-' + i);
      const failed = document.getElementById('gfail-' + i);
      const lbl    = document.getElementById('gact-lbl-' + i);
      if(!act) return;
      if(m === 'chaos'){
        if(t.chaos){
          act.style.left = gPct(t.chaos[0]); act.style.width = gSpan(t.chaos[0], t.chaos[1]);
          act.style.opacity = '1'; act.className = 'gantt-bar-actual gantt-bar-actual--err';
          if(lbl) lbl.textContent = lang === 'en' ? t.note.en : t.note.de;
          if(marker){ marker.style.left = (t.plan[1]/GANTT_WEEKS*100)+'%';
            marker.style.opacity = t.chaos[0] > t.plan[1] ? '1' : '0'; }
          if(failed) failed.style.opacity = '0';
        } else {
          act.style.opacity = '0';
          if(marker) marker.style.opacity = '0';
          if(failed) failed.style.opacity = '1';
        }
      } else {
        act.style.left = gPct(t.plan[0]); act.style.width = gSpan(t.plan[0], t.plan[1]);
        act.style.opacity = '1'; act.className = 'gantt-bar-actual gantt-bar-actual--ok';
        if(lbl) lbl.textContent = '';
        if(marker) marker.style.opacity = '0';
        if(failed) failed.style.opacity = '0';
      }
    });
    const bC = document.getElementById('gBtnChaos');
    const bP = document.getElementById('gBtnPlan');
    if(bC && bP){
      bC.className = 'gantt-btn' + (m === 'chaos' ? ' gantt-btn--on' : '');
      bP.className = 'gantt-btn' + (m === 'plan'  ? ' gantt-btn--on' : '');
    }
  }

  function startGanttCycle(){
    clearInterval(_ganttTimer);
    _ganttTimer = setInterval(() => applyGanttMode(_ganttMode === 'chaos' ? 'plan' : 'chaos'), 5000);
  }

  function triggerGanttAnim(){
    if(_ganttAnimated) return;
    _ganttAnimated = true;
    GANTT_TASKS.forEach((t, i) => {
      const act = document.getElementById('gact-' + i);
      if(!act) return;
      act.style.transition = '';
      act.style.transitionDelay = (i * 90) + 'ms';
    });
    setTimeout(() => {
      applyGanttMode(_ganttMode);
      setTimeout(() => {
        GANTT_TASKS.forEach((t, i) => {
          const act = document.getElementById('gact-' + i);
          if(act) act.style.transitionDelay = '0ms';
        });
      }, GANTT_TASKS.length * 90 + 800);
    }, 20);
    setTimeout(startGanttCycle, GANTT_TASKS.length * 90 + 1200);
  }

  function initGantt(){
    const wrap = document.getElementById('ganttWrap');
    if(!wrap) return;
    const lang = localStorage.getItem(langKey) || 'de';
    const sd = document.createElement('div');
    sd.className = 'gantt-status gantt-status--err'; sd.id = 'ganttStatus';
    sd.innerHTML = '<span class="gantt-status-icon">⚠</span><span id="ganttStatusText">'
      + (lang === 'en'
          ? '⏱  Delivery delayed +3 weeks — machine idle, schedule cascades'
          : '⏱  Lieferung verzögert sich um +3 Wochen — Maschine steht, alles verschiebt sich')
      + '</span>';
    wrap.appendChild(sd);
    const thead = document.createElement('div'); thead.className = 'gantt-thead';
    const lhd = document.createElement('div');
    const wksDiv = document.createElement('div'); wksDiv.className = 'gantt-wks';
    for(let w = 1; w <= GANTT_WEEKS; w++){
      const wk = document.createElement('div'); wk.className = 'gantt-wk'; wk.textContent = 'W'+w;
      wksDiv.appendChild(wk);
    }
    thead.appendChild(lhd); thead.appendChild(wksDiv); wrap.appendChild(thead);
    GANTT_TASKS.forEach((t, i) => {
      const row = document.createElement('div'); row.className = 'gantt-row';
      const lbl = document.createElement('div'); lbl.className = 'gantt-label';
      lbl.innerHTML = (lang === 'en' ? t.en : t.de).replace(/\n/g,'<br>');
      row.appendChild(lbl);
      const bars = document.createElement('div'); bars.className = 'gantt-bars';
      const planBar = document.createElement('div'); planBar.className = 'gantt-bar-plan';
      planBar.id = 'gplan-'+i; planBar.style.left = gPct(t.plan[0]); planBar.style.width = gSpan(t.plan[0],t.plan[1]);
      bars.appendChild(planBar);
      const act = document.createElement('div'); act.className = 'gantt-bar-actual'; act.id = 'gact-'+i;
      act.style.transition = 'none'; act.style.width = '0'; act.style.opacity = '0';
      const ls = document.createElement('span'); ls.className = 'gantt-bar-label'; ls.id = 'gact-lbl-'+i;
      act.appendChild(ls); bars.appendChild(act);
      const mk = document.createElement('div'); mk.className = 'gantt-marker'; mk.id = 'gmark-'+i;
      mk.textContent = '⚠'; mk.style.opacity = '0'; bars.appendChild(mk);
      const fl = document.createElement('div'); fl.className = 'gantt-failed'; fl.id = 'gfail-'+i;
      fl.style.opacity = '0';
      fl.innerHTML = '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">'
        +'<path d="M2 2l8 8M10 2l-8 8" stroke="#f85149" stroke-width="2" stroke-linecap="round"/></svg>'
        +'<span id="gfail-lbl-'+i+'">'+(lang==='en'?t.note.en:t.note.de)+'</span>';
      bars.appendChild(fl); row.appendChild(bars); wrap.appendChild(row);
    });
    const bC = document.getElementById('gBtnChaos');
    const bP = document.getElementById('gBtnPlan');
    if(bC) bC.addEventListener('click', () => { applyGanttMode('chaos'); startGanttCycle(); });
    if(bP) bP.addEventListener('click', () => { applyGanttMode('plan');  startGanttCycle(); });
  }

  // ── DOMContentLoaded ──────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function(){
    setTheme(getPreferredTheme());
    translatePage(getPreferredLang());

    document.getElementById('themeToggle')?.addEventListener('click', () =>
      setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));

    document.getElementById('langToggle')?.addEventListener('click', () =>
      translatePage(localStorage.getItem(langKey) === 'de' ? 'en' : 'de'));

    const y = document.getElementById('y');
    if(y) y.textContent = new Date().getFullYear();

    initHamburger();
    initTabs();
    initCardLinks();
    initGantt();
  });

})();
