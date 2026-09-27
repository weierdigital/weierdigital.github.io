/* weier.digital — One-Pager Interaktion
   Scroll-Reveal, Scrollspy, Timeline-Fortschritt, Zähler. Ohne Abhängigkeiten. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO  = typeof IntersectionObserver !== 'undefined';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {

    /* ── Jahr im Footer ──────────────────────────────────────────────────── */
    var y = document.getElementById('y');
    if (y) y.textContent = new Date().getFullYear();

    /* ── Header: Linie erst nach dem Scrollen ────────────────────────────── */
    var top = document.querySelector('.top');
    if (top) {
      var onScroll = function () {
        top.classList.toggle('is-stuck', window.scrollY > 8);
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ── Scroll-Reveal ───────────────────────────────────────────────────── */
    var rv = document.querySelectorAll('.rv');
    if (rv.length) {
      if (reduce || !hasIO) {
        rv.forEach(function (el) { el.classList.add('in'); });
      } else {
        var ro = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (!e.isIntersecting) return;
            e.target.classList.add('in');
            ro.unobserve(e.target);
          });
        }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
        rv.forEach(function (el) { ro.observe(el); });
      }
    }

    /* ── Scrollspy für die Kopfnavigation ────────────────────────────────── */
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"]'));
    var secs  = links
      .map(function (a) { return document.querySelector(a.getAttribute('href')); })
      .filter(Boolean);

    if (secs.length && hasIO) {
      var visible = new Map();
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { visible.set(e.target, e.intersectionRatio); });
        var best = null, bestR = 0;
        visible.forEach(function (r, el) { if (r > bestR) { bestR = r; best = el; } });
        links.forEach(function (a) {
          a.classList.toggle('on', !!best && a.getAttribute('href') === '#' + best.id);
        });
      }, { threshold: [0.15, 0.4, 0.7], rootMargin: '-72px 0px -45% 0px' });
      secs.forEach(function (s) { spy.observe(s); });
    }

    /* ── Werdegang: Linie füllt sich mit dem Scrollen ────────────────────── */
    var cv   = document.querySelector('.cv');
    var fill = document.querySelector('.cv-fill');
    if (cv && fill && !reduce) {
      var items = Array.prototype.slice.call(cv.querySelectorAll('.cv-item'));
      var paint = function () {
        var r  = cv.getBoundingClientRect();
        var mid = window.innerHeight * 0.62;
        var h  = Math.max(0, Math.min(r.height, mid - r.top));
        fill.style.height = h + 'px';
        items.forEach(function (it) {
          var ir = it.getBoundingClientRect();
          it.classList.toggle('lit', ir.top < mid);
        });
      };
      paint();
      window.addEventListener('scroll', paint, { passive: true });
      window.addEventListener('resize', paint);
    } else if (cv) {
      cv.querySelectorAll('.cv-item').forEach(function (it) { it.classList.add('lit'); });
      if (fill) fill.style.height = '100%';
    }
  });
})();
