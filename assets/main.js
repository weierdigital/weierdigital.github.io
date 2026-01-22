(function(){
  const root = document.documentElement;
  const key = "weier_theme";

  function updateIcon(t){
    const btn = document.getElementById("themeToggle");
    if(!btn) return;
    btn.setAttribute("aria-label", t === "dark" ? "Light mode" : "Dark mode");
    btn.setAttribute("title", t === "dark" ? "Light mode" : "Dark mode");
    const sun = btn.querySelector('[data-ic="sun"]');
    const moon = btn.querySelector('[data-ic="moon"]');
    if(sun && moon){
      sun.style.display = (t === "dark") ? "block" : "none";
      moon.style.display = (t === "dark") ? "none" : "block";
    }
  }

  function getPreferred(){
    const saved = localStorage.getItem(key);
    if(saved === "light" || saved === "dark") return saved;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function setTheme(t){
    root.setAttribute("data-theme", t);
    localStorage.setItem(key, t);
    updateIcon(t);
  }

  document.addEventListener("DOMContentLoaded", function(){
    const t = getPreferred();
    setTheme(t);

    const btn = document.getElementById("themeToggle");
    if(btn){
      btn.addEventListener("click", function(){
        const current = root.getAttribute("data-theme") || "light";
        setTheme(current === "dark" ? "light" : "dark");
      });
    }

    const y = document.getElementById("y");
    if(y) y.textContent = new Date().getFullYear();
  });
})();
