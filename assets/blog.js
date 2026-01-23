(function () {
  const LANG_KEY = "weier_lang";

  function getLang() {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "de" || saved === "en") return saved;
    const browserLang = navigator.language || navigator.userLanguage || "de";
    return browserLang.startsWith("de") ? "de" : "en";
  }

  function pickLang(obj, lang) {
    if (!obj) return "";
    return obj[lang] || obj.de || obj.en || "";
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

  function fmtYearMonth(ym, lang) {
    // erwartet "YYYY-MM" oder "YYYY-MM-DD"
    try {
      const parts = String(ym || "").split("-");
      const y = Number(parts[0]);
      const m = Number(parts[1]);
      if (!y || !m) return String(ym || "");
      const d = new Date(y, m - 1, 1);
      const locale = lang === "de" ? "de-DE" : "en-GB";
      return new Intl.DateTimeFormat(locale, { year: "numeric", month: "long" }).format(d);
    } catch {
      return String(ym || "");
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

  // =========================
  // Blog Index ( /blog/ )
  // =========================

  function renderLatestPost(data, lang) {
    const el = document.getElementById("latestPost");
    if (!el) return;

    const posts = [...(data.posts || [])].sort(sortByDateDesc);
    if (!posts.length) {
      el.innerHTML = `<article class="featured-card"><p class="project-description">${lang === "de" ? "Noch keine Posts." : "No posts yet."}</p></article>`;
      return;
    }

    const latest = posts[0];
    const project = (data.projects || []).find(p => p.id === latest.projectId);

    const title = pickLang(latest.title, lang);
    const excerpt = pickLang(latest.excerpt, lang);
    const projectTitle = pickLang(project?.title, lang);
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
      const title = pickLang(p.title, lang);
      const desc = pickLang(p.description, lang);
      const updates = posts.filter(x => x.projectId === p.id).length;

      return `
        <article class="project-card">
          <div class="project-header">
            <div class="project-meta">
              <span class="project-tag">${esc(p.tag || "")}</span>
              <span class="project-status ${statusClass(p.status)}">${esc(pickLang(p.statusLabel, lang))}</span>
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
                ${lang === "de" ? "Gestartet" : "Started"} ${esc(fmtYearMonth(p.started, lang))}
              </span>
            </div>
            <a href="${esc(p.href)}" class="project-link">
              ${lang === "de" ? "Alle Updates ansehen →" : "View updates →"}
            </a>
          </div>
        </article>
      `;
    });

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

  // =========================
  // Project Pages ( /blog/<project>/ )
  // =========================

  function renderProjectHeader(data, lang, projectId) {
    const project = (data.projects || []).find(p => p.id === projectId);
    if (!project) return;

    const title = pickLang(project.title, lang);
    const desc = pickLang(project.description, lang);

    // Fill header placeholders
    const tagEl = document.getElementById("projectTag");
    if (tagEl) tagEl.textContent = project.tag || "";

    const statusEl = document.getElementById("projectStatus");
    if (statusEl) {
      statusEl.textContent = pickLang(project.statusLabel, lang);
      statusEl.classList.remove("status-active", "status-planned", "status-completed");
      statusEl.classList.add(statusClass(project.status));
    }

    const titleEl = document.getElementById("projectTitle");
    if (titleEl) titleEl.textContent = title;

    const introEl = document.getElementById("projectIntro");
    if (introEl) introEl.textContent = desc;

    const startedEl = document.getElementById("projectStarted");
    if (startedEl) startedEl.textContent = fmtYearMonth(project.started, lang);

    const phaseEl = document.getElementById("projectCurrentPhase");
    if (phaseEl) phaseEl.textContent = pickLang(project.currentPhase, lang) || "";

    const techInlineEl = document.getElementById("projectTechInline");
    if (techInlineEl) {
      const techInline = (project.tech && project.tech.length) ? project.tech.join(", ") : "";
      techInlineEl.textContent = techInline;
    }

    // Sidebar tech list
    const techListEl = document.getElementById("projectTechList");
    if (techListEl) {
      const tech = Array.isArray(project.tech) ? project.tech : [];
      techListEl.innerHTML = tech.map(t => `<span class="tech-item">${esc(t)}</span>`).join("\n");
    }

    // Sidebar phases list
    const phasesEl = document.getElementById("projectPhasesList");
    if (phasesEl) {
      const phases = Array.isArray(project.phases) ? project.phases : [];
      phasesEl.innerHTML = phases.map(ph => {
        const label = pickLang(ph, lang);
        const cls = ph.active ? "phase-active" : "";
        return `<li class="${cls}">${esc(label)}</li>`;
      }).join("\n");
    }

    // Update <title> + meta description dynamically (nice for new projects)
    const docTitle = document.querySelector("title");
    if (docTitle) {
      const deTitle = pickLang(project.title, "de");
      const enTitle = pickLang(project.title, "en");
      docTitle.setAttribute("data-de", `${deTitle} – weier.digital`);
      docTitle.setAttribute("data-en", `${enTitle} – weier.digital`);
      docTitle.textContent = `${title} – weier.digital`;
    }
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", desc || "Projekt Updates");
  }

  function renderProjectLatest(data, lang, projectId) {
    const el = document.getElementById("projectLatest");
    if (!el) return;

    const posts = (data.posts || []).filter(p => p.projectId === projectId).sort(sortByDateDesc);
    if (!posts.length) {
      el.innerHTML = `
        <div class="latest-update">
          <div class="latest-update-head">
            <span class="latest-pill">${lang === "de" ? "Neustes Update" : "Latest update"}</span>
            <span class="latest-date">${lang === "de" ? "—" : "—"}</span>
          </div>
          <h2 class="latest-title">${lang === "de" ? "Noch keine Updates" : "No updates yet"}</h2>
          <p class="latest-excerpt">${lang === "de" ? "Sobald ein Post da ist, erscheint er hier automatisch." : "Once you publish a post, it will show up here automatically."}</p>
        </div>
      `;
      return;
    }

    const latest = posts[0];
    const title = pickLang(latest.title, lang);
    const excerpt = pickLang(latest.excerpt, lang);

    el.innerHTML = `
      <div class="latest-update">
        <div class="latest-update-head">
          <span class="latest-pill">${lang === "de" ? "Neustes Update" : "Latest update"}</span>
          <time class="latest-date" datetime="${esc(latest.date)}">${esc(fmtDate(latest.date, lang))}</time>
        </div>
        <h2 class="latest-title">
          <a href="${esc(latest.href)}">${esc(title)}</a>
        </h2>
        <p class="latest-excerpt">${esc(excerpt)}</p>
        <a class="read-more" href="${esc(latest.href)}">${lang === "de" ? "Zum Update →" : "Go to update →"}</a>
      </div>
    `;
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
      const title = pickLang(p.title, lang);
      const excerpt = pickLang(p.excerpt, lang);
      return `
        <article class="timeline-post">
          <div class="timeline-marker"><span class="marker-icon" aria-hidden="true">📍</span></div>
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

    // Project page
    const projectId = document.body?.getAttribute("data-project-id");
    if (projectId) {
      renderProjectHeader(data, lang, projectId);
      renderProjectLatest(data, lang, projectId);
      renderProjectTimeline(data, lang, projectId);
    }

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
          if (pid) {
            renderProjectHeader(d, l, pid);
            renderProjectLatest(d, l, pid);
            renderProjectTimeline(d, l, pid);
          }
        }, 0);
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    init().catch(err => console.error(err));
  });
})();
