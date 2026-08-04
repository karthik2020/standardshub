(function () {
  'use strict';

  const THEME_KEY = 'theme-mode';

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(mode) {
    document.documentElement.setAttribute('data-theme', mode);
  }

  function updateButtons(mode) {
    document.querySelectorAll('.mobile-theme-btn, [data-theme-toggle]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(mode === 'dark'));
    });
  }

  function cycleTheme() {
    try {
      var current = localStorage.getItem(THEME_KEY) || 'light';
      var next = current === 'light' ? 'dark' : 'light';
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
      updateButtons(next);
    } catch (e) {}
  }

  try {
    var saved = localStorage.getItem(THEME_KEY);
    if (!saved) {
      saved = getSystemTheme();
      localStorage.setItem(THEME_KEY, saved);
    }
    applyTheme(saved);
    updateButtons(saved);
  } catch (e) {}

  document.querySelectorAll('.mobile-theme-btn, [data-theme-toggle]').forEach(function (btn) {
    btn.addEventListener('click', cycleTheme);
  });
})();
