function resolveActiveFramework(pathname) {
  if (pathname.startsWith("/ifrs") || pathname.startsWith("/ifric") || pathname.startsWith("/sic")) return "ifrs";
  if (pathname.startsWith("/ipsas")) return "ipsas";
  if (pathname.startsWith("/ias")) return "ias";
  if (pathname.startsWith("/indas")) return "indas";
  if (pathname.startsWith("/usgaap")) return "usgaap";
  if (pathname.startsWith("/ukgaap")) return "ukgaap";
  if (pathname.startsWith("/asbe")) return "asbe";
  if (pathname.startsWith("/aspe")) return "aspe";
  if (pathname.startsWith("/japangaap")) return "japangaap";
  if (pathname.startsWith("/hgb") || pathname.startsWith("/germany/drs")) return "hgb";
  return "home";
}

function initRailPanel() {

    const rail = document.querySelector("[data-rail]");
    const panel = document.querySelector("[data-panel]");

    if (!rail || !panel) return;

    // ==========================================================
    // Framework switching (rail -> panel)
    // ==========================================================

    const STORAGE_KEY = "rail-active-framework";

    function setActive(id, persist = true) {

        panel.dataset.activeFramework = id;

        const appBody = document.querySelector(".app-body");
        if (appBody) {
            appBody.dataset.framework = id;
        }

        rail.querySelectorAll("[data-rail-item]").forEach((item) => {
            const isActive = item.dataset.railItem === id;
            item.classList.toggle("active", isActive);
            if (isActive) {
                item.setAttribute("aria-current", "page");
            } else {
                item.removeAttribute("aria-current");
            }
        });

        if (persist) {
            localStorage.setItem(STORAGE_KEY, id);
        }

    }

    function syncFromUrl() {
        const pathname = window.location.pathname;
        const framework = resolveActiveFramework(pathname);
        setActive(framework, true);
        if (typeof window.syncSidebarFromUrl === "function") {
            window.syncSidebarFromUrl(pathname);
        }
    }

    rail.querySelectorAll("[data-rail-item]").forEach((item) => {

        item.addEventListener("click", (event) => {

            if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) {
                return;
            }

            const id = item.dataset.railItem;

            setActive(id);

        });

    });

    window.addEventListener("popstate", syncFromUrl);
    window.addEventListener("pageshow", syncFromUrl);

    // Restore whichever framework the panel was serverside-resolved to
    // (from the current URL) rather than a stale localStorage value, so
    // deep links always show the right list. Only fall back to the saved
    // preference on the home page where there's no URL signal.
    const serverActive = panel.dataset.activeFramework;
    if (serverActive === "home") {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && rail.querySelector(`[data-rail-item="${saved}"]`)) {
            setActive(saved, false);
        }
    } else {
        setActive(serverActive, true);
    }

    // ==========================================================
    // Cross-framework search
    // ==========================================================
    // sidebar.js's applyFilter() already hides non-matching .nav-link
    // items and their parent .section. All we need to do here is lift
    // the per-framework panel visibility restriction while a term is
    // present, so matches from every framework are shown at once.

    const searchInput = document.getElementById("standard-search");

    if (searchInput) {

        const updateSearchingState = () => {
            panel.classList.toggle("searching", searchInput.value.trim() !== "");
        };

        searchInput.addEventListener("input", updateSearchingState);
        updateSearchingState();

        const clearButton = document.getElementById("search-action");
        if (clearButton) {
            clearButton.addEventListener("click", () => {
                // sidebar.js clears the value; wait a tick so this reads
                // the value after that handler runs.
                requestAnimationFrame(updateSearchingState);
            });
        }

    }

    // ==========================================================
    // Dark / light toggle (scoped to the sidebar only)
    // ==========================================================

    const themeBtn = document.getElementById("rail-theme-toggle");
    const THEME_KEY = "rail-theme";

    function applyTheme(theme) {
        document.documentElement.dataset.sidebarTheme = theme;
        if (themeBtn) themeBtn.setAttribute("aria-pressed", String(theme === "dark"));
    }

    const savedTheme = localStorage.getItem(THEME_KEY) || "light";
    applyTheme(savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            const next = document.documentElement.dataset.sidebarTheme === "dark" ? "light" : "dark";
            applyTheme(next);
            localStorage.setItem(THEME_KEY, next);
        });
    }

}

if (document.querySelector("[data-panel]")) {
    initRailPanel();
} else {
    document.addEventListener("DOMContentLoaded", initRailPanel);
}
