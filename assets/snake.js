/* Snake — kleine Werkstatt-Pause für weier.digital.
   Vanilla JS, statisch, kein Build. Steuerung: Pfeiltasten / WASD / Wisch / D-Pad.
   Folgt den Farb-Tokens aus site.css. */
(function () {
  'use strict';

  var canvas = document.getElementById('snakeCanvas');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');

  var BEST_KEY = 'weier_snake_best';
  var MODE_KEY = 'weier_snake_mode';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var GRID = 21;            // Zellen pro Seite
  var BASE_SPEED = 138;     // ms pro Schritt am Start
  var MIN_SPEED = 78;       // schnellstes Tempo
  var SPEED_STEP = 3;       // ms schneller pro gefressenem Punkt

  var board = document.getElementById('snakeBoard');
  var overlay = document.getElementById('snakeOverlay');
  var overlayTitle = document.getElementById('snakeOverlayTitle');
  var overlaySub = document.getElementById('snakeOverlaySub');
  var startBtn = document.getElementById('snakeStart');
  var pauseBtn = document.getElementById('snakePause');
  var restartBtn = document.getElementById('snakeRestart');
  var scoreEl = document.getElementById('snakeScore');
  var bestEl = document.getElementById('snakeBest');

  var modeWallBtn = document.getElementById('snakeModeWall');
  var modeWrapBtn = document.getElementById('snakeModeWrap');

  var snake, dir, nextDir, food, score, best, speed, state, timer;
  var bulges = [];  // Zellen, in denen gerade ein gefressener Happen sichtbar ist
  var cssSize = 0;  // CSS-Pixel-Kantenlänge des (quadratischen) Bretts
  // state: 'idle' | 'running' | 'paused' | 'over'

  // Modus: 'wall' = Wand ist toedlich, 'wrap' = auf der Gegenseite wieder rein.
  // Der Bestwert wird je Modus getrennt gefuehrt, weil wrap deutlich leichter ist.
  var wrap = localStorage.getItem(MODE_KEY) === 'wrap';
  function bestKey() { return wrap ? BEST_KEY + '_wrap' : BEST_KEY; }
  function loadBest() { return parseInt(localStorage.getItem(bestKey()) || '0', 10) || 0; }
  function saveBest() { localStorage.setItem(bestKey(), String(best)); }
  best = loadBest();

  function lang() { return 'de'; } // Seite ist seit dem Relaunch 2026 einsprachig
  function t(de, en) { return lang() === 'en' ? en : de; }
  function cssVar(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  /* ── Canvas scharf an die Containergröße anpassen ───────────────────── */
  function fitCanvas() {
    var rect = board.getBoundingClientRect();
    cssSize = Math.round(rect.width);
    board.style.height = cssSize + 'px'; // Quadrat erzwingen (Fallback ohne aspect-ratio)
    var dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(cssSize * dpr);
    canvas.height = Math.round(cssSize * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  /* ── Zustand & Daten ────────────────────────────────────────────────── */
  function reset() {
    var m = Math.floor(GRID / 2);
    snake = [{ x: m + 1, y: m }, { x: m, y: m }, { x: m - 1, y: m }];
    dir = { x: 1, y: 0 };
    nextDir = { x: 1, y: 0 };
    score = 0;
    speed = BASE_SPEED;
    bulges = [];
    placeFood();
    updateHud();
  }

  function placeFood() {
    var p;
    do {
      p = { x: (Math.random() * GRID) | 0, y: (Math.random() * GRID) | 0 };
    } while (snake.some(function (s) { return s.x === p.x && s.y === p.y; }));
    food = p;
  }

  function updateHud() {
    if (scoreEl) scoreEl.textContent = String(score);
    if (bestEl) bestEl.textContent = String(best);
  }

  function showOverlay(title, sub, btn) {
    if (!overlay) return;
    overlayTitle.textContent = title;
    overlaySub.textContent = sub;
    startBtn.textContent = btn;
    overlay.hidden = false;
  }
  function hideOverlay() { if (overlay) overlay.hidden = true; }

  function setState(s) {
    state = s;
    if (pauseBtn) pauseBtn.disabled = (s !== 'running' && s !== 'paused');
    if (s === 'idle') {
      showOverlay(t('Bereit?', 'Ready?'),
        t('Lostippen, wischen oder Start drücken.', 'Press a key, swipe, or hit Start.'),
        t('Start', 'Start'));
    } else if (s === 'paused') {
      showOverlay(t('Pause', 'Paused'),
        t('Weiter mit Leertaste oder Tippen.', 'Resume with Space or a tap.'),
        t('Weiter', 'Resume'));
    } else if (s === 'over') {
      showOverlay(t('Vorbei', 'Game over'),
        t('Punkte ' + score + ' · Bestwert ' + best, 'Score ' + score + ' · Best ' + best),
        t('Nochmal', 'Again'));
    } else {
      hideOverlay();
    }
  }

  /* ── Spielfluss ─────────────────────────────────────────────────────── */
  function start() {
    if (state === 'running') return;
    if (state === 'over') reset();
    hideOverlay();
    setState('running');
    clearTimeout(timer);
    loop();
  }
  function pause() {
    if (state !== 'running') return;
    clearTimeout(timer);
    setState('paused');
    draw();
  }
  function resume() {
    if (state !== 'paused') return;
    setState('running');
    loop();
  }
  function togglePause() {
    if (state === 'running') pause();
    else if (state === 'paused') resume();
    else start();
  }
  function gameOver() {
    clearTimeout(timer);
    if (score > best) { best = score; saveBest(); }
    updateHud();
    setState('over');
    draw();
  }
  function loop() {
    timer = setTimeout(function () {
      if (state !== 'running') return;
      tick();
      loop();
    }, speed);
  }

  function tick() {
    dir = nextDir;
    var head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    if (wrap) {
      // Tunnel: an der Kante hinaus, auf der Gegenseite wieder herein
      head.x = (head.x + GRID) % GRID;
      head.y = (head.y + GRID) % GRID;
    } else if (head.x < 0 || head.y < 0 || head.x >= GRID || head.y >= GRID) {
      gameOver(); return;
    }

    // eigener Körper (Schwanz wird gleich frei, daher ohne letztes Segment)
    for (var i = 0; i < snake.length - 1; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) { gameOver(); return; }
    }

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score++;
      if (score > best) { best = score; saveBest(); }
      speed = Math.max(MIN_SPEED, BASE_SPEED - score * SPEED_STEP);
      // Der Happen bleibt an genau dieser Zelle liegen und wandert dadurch
      // sichtbar durch den Körper, bis der Schwanz die Stelle verlassen hat.
      bulges.push({ x: head.x, y: head.y });
      placeFood();
      updateHud();
    } else {
      snake.pop();
    }

    // Happen verschwindet, sobald kein Segment mehr auf seiner Zelle liegt
    if (bulges.length) {
      bulges = bulges.filter(function (b) {
        return snake.some(function (s) { return s.x === b.x && s.y === b.y; });
      });
    }

    draw();
  }

  function setDir(x, y) {
    if (state === 'idle') start();
    if (state !== 'running') return;
    if (x === -dir.x && y === -dir.y) return; // keine 180°-Wende
    if (x === dir.x && y === dir.y) return;
    nextDir = { x: x, y: y };
  }

  /* ── Zeichnen ───────────────────────────────────────────────────────── */
  function roundRect(x, y, w, h, r) {
    if (w < 0) w = 0; if (h < 0) h = 0;
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function draw() {
    if (!cssSize) return;
    var cell = cssSize / GRID;
    ctx.clearRect(0, 0, cssSize, cssSize);

    // feines Raster (passt zum Werkstatt-Look, leise)
    ctx.strokeStyle = cssVar('--border', '#2a2219');
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (var i = 1; i < GRID; i++) {
      var p = Math.round(i * cell) + 0.5;
      ctx.moveTo(p, 0); ctx.lineTo(p, cssSize);
      ctx.moveTo(0, p); ctx.lineTo(cssSize, p);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Futter (gemessenes Grün)
    var ok = cssVar('--ok', '#5fae6e');
    var pad = cell * 0.2;
    ctx.fillStyle = ok;
    roundRect(food.x * cell + pad, food.y * cell + pad, cell - pad * 2, cell - pad * 2, (cell - pad * 2) * 0.32);
    ctx.fill();

    // Schlange (ein Maschinen-Akzent)
    var accent = cssVar('--accent', '#f56a35');
    var gap = Math.max(1, cell * 0.09);
    var bulgeGap = Math.max(0.5, cell * 0.015); // gefressener Happen sitzt dicker im Körper

    function segGap(seg) {
      for (var b = 0; b < bulges.length; b++) {
        if (bulges[b].x === seg.x && bulges[b].y === seg.y) return bulgeGap;
      }
      return gap;
    }
    function drawSeg(seg) {
      var g = segGap(seg);
      roundRect(seg.x * cell + g, seg.y * cell + g, cell - g * 2, cell - g * 2, cell * 0.3);
      ctx.fill();
    }

    ctx.fillStyle = accent;
    for (var s = snake.length - 1; s >= 1; s--) {
      ctx.globalAlpha = 0.85;
      drawSeg(snake[s]);
    }
    // Kopf voll deckend + Augen
    ctx.globalAlpha = 1;
    var h = snake[0];
    drawSeg(h);

    var cx = h.x * cell + cell / 2, cy = h.y * cell + cell / 2;
    var er = Math.max(1.4, cell * 0.085);
    var fwd = cell * 0.16, side = cell * 0.2;
    var px = dir.y, py = dir.x; // senkrecht zur Bewegung
    ctx.fillStyle = cssVar('--surface', '#18130d');
    [-1, 1].forEach(function (sgn) {
      var ex = cx + dir.x * fwd + px * side * sgn;
      var ey = cy + dir.y * fwd + py * side * sgn;
      ctx.beginPath(); ctx.arc(ex, ey, er, 0, Math.PI * 2); ctx.fill();
    });
  }

  /* ── Eingaben ───────────────────────────────────────────────────────── */
  window.addEventListener('keydown', function (e) {
    if (e.defaultPrevented) return;
    var k = e.key;
    if (k === 'ArrowUp' || k === 'w' || k === 'W') { setDir(0, -1); e.preventDefault(); }
    else if (k === 'ArrowDown' || k === 's' || k === 'S') { setDir(0, 1); e.preventDefault(); }
    else if (k === 'ArrowLeft' || k === 'a' || k === 'A') { setDir(-1, 0); e.preventDefault(); }
    else if (k === 'ArrowRight' || k === 'd' || k === 'D') { setDir(1, 0); e.preventDefault(); }
    else if (k === 'p' || k === 'P') { togglePause(); e.preventDefault(); }
    else if (k === ' ' || k === 'Spacebar' || k === 'Enter') {
      if (state === 'running') pause();
      else if (state === 'paused') resume();
      else start();
      e.preventDefault();
    }
  });

  // D-Pad
  Array.prototype.forEach.call(document.querySelectorAll('.snake-dbtn'), function (b) {
    b.addEventListener('click', function () {
      var d = b.getAttribute('data-dir');
      if (d === 'up') setDir(0, -1);
      else if (d === 'down') setDir(0, 1);
      else if (d === 'left') setDir(-1, 0);
      else if (d === 'right') setDir(1, 0);
    });
  });

  // Wischen auf dem Brett
  var touchStart = null;
  board.addEventListener('touchstart', function (e) {
    var tch = e.touches[0];
    touchStart = { x: tch.clientX, y: tch.clientY };
  }, { passive: true });
  board.addEventListener('touchmove', function (e) {
    if (touchStart) e.preventDefault(); // kein Seiten-Scrollen während des Wischens
  }, { passive: false });
  board.addEventListener('touchend', function (e) {
    if (!touchStart) return;
    var tch = e.changedTouches[0];
    var dx = tch.clientX - touchStart.x;
    var dy = tch.clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) { // Tippen = Start/Weiter
      if (state === 'idle' || state === 'over') start();
      else if (state === 'paused') resume();
      return;
    }
    if (Math.abs(dx) > Math.abs(dy)) setDir(dx > 0 ? 1 : -1, 0);
    else setDir(0, dy > 0 ? 1 : -1);
  }, { passive: true });

  // Buttons
  if (startBtn) startBtn.addEventListener('click', function () {
    if (state === 'paused') resume(); else start();
  });
  if (pauseBtn) pauseBtn.addEventListener('click', togglePause);
  if (restartBtn) restartBtn.addEventListener('click', function () { reset(); start(); });

  // Modusumschaltung. Wirkt sofort und bricht einen laufenden Zug nicht ab.
  function applyMode(toWrap) {
    wrap = !!toWrap;
    localStorage.setItem(MODE_KEY, wrap ? 'wrap' : 'wall');
    if (modeWallBtn) {
      modeWallBtn.classList.toggle('is-on', !wrap);
      modeWallBtn.setAttribute('aria-pressed', String(!wrap));
    }
    if (modeWrapBtn) {
      modeWrapBtn.classList.toggle('is-on', wrap);
      modeWrapBtn.setAttribute('aria-pressed', String(wrap));
    }
    board.classList.toggle('is-wrap', wrap); // gestrichelter Rand als Hinweis
    best = loadBest();
    updateHud();
    draw();
  }
  if (modeWallBtn) modeWallBtn.addEventListener('click', function () { applyMode(false); });
  if (modeWrapBtn) modeWrapBtn.addEventListener('click', function () { applyMode(true); });

  // Beim Wegklicken pausieren
  document.addEventListener('visibilitychange', function () {
    if (document.hidden && state === 'running') pause();
  });

  // Optionale Theme-/Sprachschalter, falls eine Seite sie einbindet
  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', function () { setTimeout(draw, 0); });
  var langBtn = document.getElementById('langToggle');
  if (langBtn) langBtn.addEventListener('click', function () {
    setTimeout(function () { if (overlay && !overlay.hidden) setState(state); }, 0);
  });

  var rt;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(fitCanvas, 120); });

  /* ── Start ──────────────────────────────────────────────────────────── */
  reset();          // erst Spieldaten anlegen, applyMode zeichnet bereits
  applyMode(wrap);
  fitCanvas();
  setState('idle');
  window.addEventListener('load', fitCanvas); // nach Font-/Layout-Settle erneut messen
})();
