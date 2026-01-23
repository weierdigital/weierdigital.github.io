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
    // Check browser language
    const browserLang = navigator.language || navigator.userLanguage;
    return browserLang.startsWith('de') ? 'de' : 'en';
  }

  function updateLangLabel(lang){
    const btn = document.getElementById("langToggle");
    if(!btn) return;
    const label = btn.querySelector('.lang-label');
    if(label) {
      label.textContent = lang.toUpperCase();
    }
    btn.setAttribute("aria-label", lang === "de" ? "Switch to English" : "Zu Deutsch wechseln");
  }

  function translatePage(lang){
    document.documentElement.lang = lang;
    
    // Update all elements with data-de and data-en attributes
    document.querySelectorAll('[data-de][data-en]').forEach(el => {
      const text = el.getAttribute(`data-${lang}`);
      if(text) {
        el.textContent = text;
      }
    });

    // Update title if it has translation attributes
    const titleEl = document.querySelector('title');
    if(titleEl && titleEl.hasAttribute('data-de') && titleEl.hasAttribute('data-en')) {
      titleEl.textContent = titleEl.getAttribute(`data-${lang}`);
    }

    localStorage.setItem(langKey, lang);
    updateLangLabel(lang);
  }

  // Initialize on DOM load
  document.addEventListener("DOMContentLoaded", function(){
    // Set theme
    const theme = getPreferredTheme();
    setTheme(theme);

    // Set language
    const lang = getPreferredLang();
    translatePage(lang);

    // Theme toggle button
    const themeBtn = document.getElementById("themeToggle");
    if(themeBtn){
      themeBtn.addEventListener("click", function(){
        const current = root.getAttribute("data-theme") || "light";
        setTheme(current === "dark" ? "light" : "dark");
      });
    }

    // Language toggle button
    const langBtn = document.getElementById("langToggle");
    if(langBtn){
      langBtn.addEventListener("click", function(){
        const current = localStorage.getItem(langKey) || 'de';
        translatePage(current === "de" ? "en" : "de");
      });
    }

    // Update year in footer
    const y = document.getElementById("y");
    if(y) y.textContent = new Date().getFullYear();
  });
})();
