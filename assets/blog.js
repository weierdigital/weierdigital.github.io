(function () {
  const LANG_KEY = "weier_lang";

  function getLang() {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "de" || saved === "en") return saved;
    const browserLang = navigator.language || navigator.userLanguage || "de";
    return browserLang.startsWith("de") ? "de" : "en";
  }

  function esc(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function fmtDate(iso, lang) {
    try {
      const d = new Date(iso);
      const locale = lang === "de" ? "de-DE" : "en-GB";
      return new Intl.DateTimeFormat(locale, { year: "numeric", month: "long", day: "2-digit" }).format(d);
    } catch {
      return iso;
    }
  }

  async function loadData() {
    const res = await fetch("/blog/data.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Could not load /blog/data.json");
    return res.json();
  }

  function statusClass(status) {
    if (status === "completed") return "status-completed";
    if (status === "planned") return "status-planned";
    return "status-active";
  }

  function sortByDateDesc(a, b) {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  }

  function renderLatestPost(data, lang) {
    const el = document.getElementById("latestPost");
    if (!el) return;

    const posts = [...(data.posts || [])].sort(sortByDateDesc);
    if (!posts.length) {
      el.innerHTML = `<div class="featured-card"><p class="project-description">${lang === "de" ? "Noch keine Posts." : "No posts yet."}</p></div>`;
      return;
    }

    const latest = posts[0];
    const project = (data.projects || []).find(p => p.id === latest.projectId);

    const title = latest.title?.[lang] || latest.title?.de || "";
    const excerpt = latest.excerpt?.[lang] || latest.excerpt?.de || "";
    const projectTitle = project?.title?.[lang] || project?.title?.de || "";
    const projectHref = project?.href || "/blog/";

    el.innerHTML = `
      <article class="featured-card">
        <div class="featured-meta">
          <span class="featured-pill">${lang === "de" ? "Neuster Post" : "Latest post"}</span>
          <span class="featured-date">${esc(fmtDate(latest.date, lang))}</span>
        </div>
        <h2 class="featured-title"><a href="${esc(latest.href)}">${esc(title)}</a></h2>
        <p class="featured-excerpt">${esc(excerpt)}</p>
        <div class="featured-actions">
          <a class="project-link" href="${esc(latest.href)}">${lang === "de" ? "Weiterlesen →" : "Read →"}</a>
          <a class="muted-link" href="${esc(projectHref)}">${lang === "de" ? "Projekt:" : "Project:"} ${esc(projectTitle)} →</a>
        </div>
      </article>
    `;
  }

  function renderProjects(data, lang) {
    const grid = document.getElementById("projectsGrid");
    if (!grid) return;

    const posts = data.posts || [];
    const projects = data.projects || [];

    const cards = projects.map(p => {
      const title = p.title?.[lang] || p.title?.de || "";
      const desc = p.description?.[lang] || p.description?.de || "";
      const updates = posts.filter(x => x.projectId === p.id).length;

      return `
        <article class="project-card">
          <div class="project-header">
            <div class="project-meta">
              <span class="project-tag">${esc(p.tag || "")}</span>
              <span class="project-status ${statusClass(p.status)}">${esc(p.statusLabel?.[lang] || p.statusLabel?.de || "")}</span>
            </div>
            <h2><a href="${esc(p.href)}">${esc(title)}</a></h2>
            <p class="project-description">${esc(desc)}</p>
          </div>

          <div class="project-footer">
            <div class="project-stats">
              <span class="stat">
                <span aria-hidden="true">📝</span>
                ${updates} ${lang === "de" ? "Updates" : "updates"}
              </span>
              <span class="stat">
                <span aria-hidden="true">🗓️</span>
                ${lang === "de" ? "Start" : "Started"} ${esc(p.started || "")}
              </span>
            </div>
            <a href="${esc(p.href)}" class="project-link">
              ${lang === "de" ? "Alle Updates ansehen →" : "View updates →"}
            </a>
          </div>
        </article>
      `;
    });

    // CTA Card “Ihr Projekt”
    const cta = `
      <article class="project-card cta-card">
        <div class="project-header">
          <div class="project-meta">
            <span class="project-tag">${lang === "de" ? "Ihr Projekt" : "Your project"}</span>
            <span class="project-status status-planned">${lang === "de" ? "💬 Unverbindlich" : "💬 No strings"}</span>
          </div>
          <h2>${lang === "de" ? "Lust auf eine robuste Automatisierung?" : "Want a robust automation?"}</h2>
          <p class="project-description">
            ${lang === "de"
              ? "Wenn du Prozesse, Datenqualität oder Engineering-Workflows verbessern willst: Schreib mir kurz, was du vorhast."
              : "If you want to improve processes, data quality or engineering workflows: tell me what you're planning."}
          </p>
        </div>
        <div class="project-footer">
          <a href="/kontakt/" class="project-link">${lang === "de" ? "Kontakt →" : "Contact →"}</a>
        </div>
      </article>
    `;

    grid.innerHTML = cards.join("\n") + "\n" + cta;
  }

  function renderProjectTimeline(data, lang, projectId) {
    const el = document.getElementById("projectTimeline");
    if (!el) return;

    const posts = (data.posts || [])
      .filter(p => p.projectId === projectId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (!posts.length) {
      el.innerHTML = `<p class="project-description">${lang === "de" ? "Noch keine Updates." : "No updates yet."}</p>`;
      return;
    }

    el.innerHTML = posts.map(p => {
      const title = p.title?.[lang] || p.title?.de || "";
      const excerpt = p.excerpt?.[lang] || p.excerpt?.de || "";
      return `
        <article class="timeline-post">
          <div class="timeline-marker"><span class="marker-icon">📍</span></div>
          <div class="timeline-content">
            <div class="post-meta-small">
              <time datetime="${esc(p.date)}">${esc(fmtDate(p.date, lang))}</time>
              <span class="post-number">#${esc(p.number)}</span>
            </div>
            <h3><a href="${esc(p.href)}">${esc(title)}</a></h3>
            <p>${esc(excerpt)}</p>
            <a href="${esc(p.href)}" class="read-more">${lang === "de" ? "Weiterlesen →" : "Read →"}</a>
          </div>
        </article>
      `;
    }).join("\n");
  }

  async function init() {
    const lang = getLang();
    const data = await loadData();

    // Blog index
    renderLatestPost(data, lang);
    renderProjects(data, lang);

    // Project page (if present)
    const projectId = document.body?.getAttribute("data-project-id");
    if (projectId) renderProjectTimeline(data, lang, projectId);

    // Re-render after language toggle (main.js updates localStorage)
    const langBtn = document.getElementById("langToggle");
    if (langBtn) {
      langBtn.addEventListener("click", () => {
        setTimeout(async () => {
          const l = getLang();
          const d = await loadData();
          renderLatestPost(d, l);
          renderProjects(d, l);
          const pid = document.body?.getAttribute("data-project-id");
          if (pid) renderProjectTimeline(d, l, pid);
        }, 0);
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    init().catch(err => console.error(err));
  });
})();
