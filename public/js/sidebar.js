// Run initialization as early as possible. This script is shipped at the end
// of <body>, so the sidebar DOM is already parsed by the time it executes and
// the browser has not painted yet. Restoring the scroll position here means
// the list appears already at the correct offset on the very first paint —
// no scroll jump and no hide/show blink. (The scroll restore must happen
// after the filter restore, which can change the list height.)
function initSidebar() {

    // ==========================================================
    // Helpers
    // ==========================================================

    const sections = [...document.querySelectorAll(".section")];

    function setSectionState(section, open) {

        const items = section.querySelector(".section-items");

        if (!items) return;

        section.classList.toggle("expanded", open);

        if (open) {
            section.setAttribute("open", "");
            items.style.maxHeight = items.scrollHeight + "px";
        } else {
            section.removeAttribute("open");
            items.style.maxHeight = "0px";
        }

        localStorage.setItem(
            `section-${section.dataset.section}`,
            open ? "open" : "closed"
        );

    }

    function getSavedState(section) {

        const key = `section-${section.dataset.section}`;

        const saved = localStorage.getItem(key);

        if (saved !== null) {
            return saved === "open";
        }

        return !!section.querySelector(".nav-link.active");

    }

    // ==========================================================
    // Initial state
    // ==========================================================

    sections.forEach(section => {

        setSectionState(
            section,
            getSavedState(section)
        );

    });

    // ==========================================================
    // Expand / Collapse
    // ==========================================================

    sections.forEach(section => {

        const header =
            section.querySelector(".sidebar-section-header");

        if (!header) return;

        header.addEventListener("click", (event) => {

            if ((event.target as HTMLElement).closest("a")) {
                return;
            }

            event.preventDefault();

            const open =
                !section.classList.contains("expanded");

            setSectionState(section, open);

        });

    });

    // ==========================================================
    // Filter (navigation)
    // ==========================================================

    const FILTER_KEY = "sidebar-filter";

    const filterInput =
        document.getElementById("standard-search");
    const filterContainer =
        document.querySelector(".search-input");
    const clearButton =
        document.getElementById("search-action");
    const emptyState =
        document.getElementById("sidebar-empty");

    // Whitespace-insensitive, case-insensitive key for matching, so that
    // "IAS16", "IAS 16", "ias16" and "iAs 16" all normalise identically.
    const normalize = (value) =>
        value.toLowerCase().replace(/\s+/g, "");

    function applyFilter(rawTerm) {

        const term = normalize(rawTerm);
        const hasTerm = term !== "";

        if (filterContainer) {
            filterContainer.classList.toggle("has-value", hasTerm);
        }
        if (clearButton) {
            clearButton.classList.toggle("visible", hasTerm);
        }

        let totalVisible = 0;

        sections.forEach(section => {

            const items =
                section.querySelector(".section-items");

            const links =
                [...section.querySelectorAll(".nav-link")];

            let visible = 0;

            links.forEach(link => {

                const code = normalize(link.dataset.code || "");
                const title = normalize(link.dataset.title || "");

                const match =
                    !hasTerm ||
                    code.includes(term) ||
                    title.includes(term);

                link.style.display = match ? "" : "none";

                if (match) visible++;

            });

            if (!hasTerm) {

                section.style.display = "";
                if (items) items.classList.remove("collapsed");
                setSectionState(section, getSavedState(section));

            } else {

                section.style.display = visible ? "" : "none";

                if (visible && items) {
                    section.classList.add("expanded");
                    items.classList.remove("collapsed");
                    items.style.maxHeight = items.scrollHeight + "px";
                }

            }

            totalVisible += visible;

        });

        if (emptyState) {
            emptyState.hidden = !(hasTerm && totalVisible === 0);
        }

        if (filterInput) {
            sessionStorage.setItem(FILTER_KEY, filterInput.value);
        }

    }

        if (filterInput) {
            filterInput.setAttribute("aria-label", "Filter standards");

            filterInput.addEventListener("input", () => {
                applyFilter(filterInput.value);
            });

            if (clearButton) {
                clearButton.setAttribute("aria-label", "Clear filter");
                clearButton.addEventListener("click", () => {
                    filterInput.value = "";
                    applyFilter("");
                    filterInput.focus();
                });
            }
        }

    // ==========================================================
    // Restore Sidebar Scroll
    // ==========================================================

    const sidebar =
        document.querySelector(".sidebar-scroll");

    if (sidebar) {

        const saved =
            sessionStorage.getItem("sidebar-scroll");

        if (saved) {

            sidebar.scrollTop =
                Number(saved);

        }

        sidebar.addEventListener("scroll", () => {

            sessionStorage.setItem(
                "sidebar-scroll",
                sidebar.scrollTop
            );

        });

    }

    // ==========================================================
    // Mobile Menu Toggle
    // ==========================================================

    const menuBtn =
        document.getElementById("mobileMenuBtn");

    const sidebarEl =
        document.querySelector(".sidebar");

    const overlay =
        document.getElementById("sidebarOverlay");

    if (menuBtn && sidebarEl) {

        menuBtn.addEventListener("click", () => {

            const isOpen =
                sidebarEl.classList.toggle("open");

            overlay?.classList.toggle("visible", isOpen);

            menuBtn.setAttribute("aria-expanded", String(isOpen));

            menuBtn.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");

        });

        if (overlay) {

            overlay.addEventListener("click", () => {

                sidebarEl.classList.remove("open");

                overlay.classList.remove("visible");

                menuBtn.setAttribute("aria-expanded", "false");

                menuBtn.setAttribute("aria-label", "Open menu");

            });

        }

    }

}

// Restore synchronously when the sidebar is already in the DOM (the normal
// case: this script sits at the end of <body>). Fall back to DOMContentLoaded
// only if it somehow executes before the sidebar exists.
if (document.querySelector(".sidebar-scroll")) {
    initSidebar();
} else {
    document.addEventListener("DOMContentLoaded", initSidebar);
}