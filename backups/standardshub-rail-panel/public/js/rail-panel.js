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

    rail.querySelectorAll("[data-rail-item]").forEach((item) => {

        item.addEventListener("click", (event) => {

            // Rail items are real <a> links (so direct URLs and no-JS
            // still work). Intercept the click to switch panels instantly
            // instead of doing a full navigation, unless the user is
            // opening it in a new tab.
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) {
                return;
            }

            const id = item.dataset.railItem;

            // If we're already on that framework's page, just switch the
            // panel. Otherwise let the browser navigate normally so the
            // main content area updates too, but still switch the panel
            // immediately for a snappier feel.
            setActive(id);

        });

    });

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
    const sidebarRoot = document.querySelector(".standards-sidebar") || rail.parentElement;

    function applyTheme(theme) {
        if (sidebarRoot) sidebarRoot.dataset.theme = theme;
        if (themeBtn) themeBtn.setAttribute("aria-pressed", String(theme === "dark"));
    }

    const savedTheme = localStorage.getItem(THEME_KEY) || "light";
    applyTheme(savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            const next = sidebarRoot?.dataset.theme === "dark" ? "light" : "dark";
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
