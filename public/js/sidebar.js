// Run initialization as early as possible. This script is shipped at the end
// of <body>, so the sidebar DOM is already parsed by the time it executes and
// the browser has not painted yet. Restoring the scroll position here means
// the list appears already at the correct offset on the very first paint —
// no scroll jump and no hide/show blink. (The scroll restore must happen
// after the filter restore, which can change the list height.)
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

    const hasActive = !!section.querySelector(".nav-link.active");

    if (hasActive) {
        return true;
    }

    const saved = localStorage.getItem(key);

    return saved !== null ? saved === "open" : false;

}

function initSidebar() {

    // ==========================================================
    // Helpers
    // ==========================================================

    const sections = [...document.querySelectorAll(".section")];

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

            if (event.target.closest("a")) {
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
        document.querySelector(".search-input-wrapper");
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

            if (hasTerm && section.dataset.section === "japangaap") {
                section.style.display = "none";
                totalVisible += 0;
                return;
            }

            const items =
                section.querySelector(".section-items");

            const links =
                [...section.querySelectorAll(".nav-link")];

            let visible = 0;

            links.forEach(link => {

                const code = normalize(link.dataset.code || "");
                const title = normalize(link.dataset.title || "");
                const aliases = (link.dataset.aliases || "")
                    .split(",")
                    .map(normalize)
                    .filter(Boolean);

                const match =
                    !hasTerm ||
                    code.includes(term) ||
                    title.includes(term) ||
                    aliases.some(alias => alias.includes(term));

                link.style.display = match ? "" : "none";

                const li = link.closest("li");
                if (li) li.style.display = match ? "" : "none";

                if (match) visible++;

            });

            if (!hasTerm) {

                section.style.display = "";
                if (items) items.classList.remove("collapsed");
                setSectionState(section, getSavedState(section));

                const container = items || section;

                container.querySelectorAll("ul.sidebar-items").forEach(ul => {
                    ul.style.display = "";
                });
                container.querySelectorAll("li.sidebar-category-label").forEach(label => {
                    label.style.display = "";
                });
                container.querySelectorAll(".sidebar-category-group").forEach(group => {
                    group.style.display = "";
                });
                container.querySelectorAll("li.sidebar-group-label").forEach(label => {
                    label.style.display = "";
                    const parentUl = label.closest("ul.sidebar-items");
                    if (parentUl) parentUl.style.display = "";
                });

            } else {

                section.style.display = visible ? "" : "none";

                if (visible && items) {
                    section.classList.add("expanded");
                    items.classList.remove("collapsed");
                    items.style.maxHeight = items.scrollHeight + "px";
                    if (section.tagName === "DETAILS") {
                        section.open = true;
                    }
                }

                const container = items || section;

                container.querySelectorAll("ul.sidebar-items").forEach(ul => {
                    const hasVisible = [...ul.querySelectorAll(".nav-link")].some(link => link.style.display !== "none");
                    ul.style.display = hasVisible ? "" : "none";
                });

                container.querySelectorAll("li.sidebar-category-label").forEach(label => {
                    const nextUl = label.nextElementSibling;
                    if (!nextUl || !nextUl.classList.contains("sidebar-items")) return;
                    const hasVisible = [...nextUl.querySelectorAll(".nav-link")].some(link => link.style.display !== "none");
                    label.style.display = hasVisible ? "" : "none";
                });

                container.querySelectorAll(".sidebar-category-group").forEach(group => {
                    const ul = group.querySelector("ul.sidebar-items");
                    const hasVisible = ul ? [...ul.querySelectorAll(".nav-link")].some(link => link.style.display !== "none") : false;
                    group.style.display = hasVisible ? "" : "none";
                });

                container.querySelectorAll("li.sidebar-group-label").forEach(label => {
                    const parentUl = label.closest("ul.sidebar-items");
                    if (parentUl) {
                        const hasVisible = [...parentUl.querySelectorAll(".nav-link")].some(link => link.style.display !== "none");
                        parentUl.style.display = hasVisible ? "" : "none";
                        label.style.display = hasVisible ? "" : "none";
                    }
                });

            }

            totalVisible += visible;

        });

        if (emptyState) {
            emptyState.hidden = !(hasTerm && totalVisible === 0);
        }

        if (filterInput) {
            const term = filterInput.value.trim();
            if (term) {
                sessionStorage.setItem(FILTER_KEY, term);
            } else {
                sessionStorage.removeItem(FILTER_KEY);
            }
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

        const activeLink = sidebar.querySelector(".nav-link.active");

        if (activeLink) {
            requestAnimationFrame(() => {
                activeLink.scrollIntoView({ block: "nearest" });
            });
        } else {
            const saved =
                sessionStorage.getItem("sidebar-scroll");

            if (saved) {
                requestAnimationFrame(() => {
                    sidebar.scrollTop =
                        Number(saved);
                });
            }
        }

        sidebar.addEventListener("scroll", () => {

            sessionStorage.setItem(
                "sidebar-scroll",
                sidebar.scrollTop
            );

        });

        document.querySelectorAll(".nav-link").forEach((link) => {
            link.addEventListener("click", () => {
                sessionStorage.setItem("sidebar-scroll", sidebar.scrollTop);
            });
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

    // ==========================================================
    // Restore persisted search
    // ==========================================================

    const savedFilter = sessionStorage.getItem(FILTER_KEY);
    if (savedFilter && filterInput) {
        filterInput.value = savedFilter;
        const panel = document.querySelector(".standards-panel");
        if (panel) panel.classList.toggle("searching", savedFilter.trim() !== "");
        if (filterContainer) filterContainer.classList.add("has-value");
        if (clearButton) clearButton.classList.add("visible");
        applyFilter(savedFilter);
    }

}

// ==========================================================
// Browser history sync
// ==========================================================
// Reconstructs the entire sidebar state from the current URL
// so Back/Forward navigation shows the correct framework panel,
// expanded section, and highlighted standard.

window.syncSidebarFromUrl = function(pathname) {

    const filterInput = document.getElementById("standard-search");
    const hasFilter = filterInput && filterInput.value.trim() !== "";

    if (hasFilter) {
        document.querySelectorAll(".nav-link").forEach(link => {
            link.classList.remove("active");
        });

        const activeLink = [...document.querySelectorAll(".nav-link")].find(
            link => link.getAttribute("href") === pathname
        );

        if (activeLink) {
            activeLink.classList.add("active");
            requestAnimationFrame(() => {
                activeLink.scrollIntoView({ block: "nearest" });
            });
        }

        return;
    }

    const sections = [...document.querySelectorAll(".section")];

    sections.forEach(section => {
        setSectionState(section, false);
    });

    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.remove("active");
    });

    const activeLink = [...document.querySelectorAll(".nav-link")].find(
        link => link.getAttribute("href") === pathname
    );

    if (activeLink) {
        activeLink.classList.add("active");
        const section = activeLink.closest(".section");
        if (section) {
            setSectionState(section, true);
        }
        requestAnimationFrame(() => {
            activeLink.scrollIntoView({ block: "nearest" });
        });
    } else {
        sections.forEach(section => {
            setSectionState(section, getSavedState(section));
        });
    }

    document.querySelectorAll(".section").forEach(s => {
        s.querySelectorAll(".nav-link").forEach(link => {
            link.style.display = "";
            const li = link.closest("li");
            if (li) li.style.display = "";
        });
        const items = s.querySelector(".section-items");
        const container = items || s;
        container.querySelectorAll("ul.sidebar-items").forEach(ul => {
            ul.style.display = "";
        });
        container.querySelectorAll("li.sidebar-category-label").forEach(label => {
            label.style.display = "";
        });
        container.querySelectorAll(".sidebar-category-group").forEach(group => {
            group.style.display = "";
        });
        container.querySelectorAll("li.sidebar-group-label").forEach(label => {
            label.style.display = "";
            const parentUl = label.closest("ul.sidebar-items");
            if (parentUl) parentUl.style.display = "";
        });
    });

    // ==========================================================
    // Navigation sync
    // ==========================================================

    window.addEventListener("popstate", () => {
        if (typeof window.syncSidebarFromUrl === "function") {
            window.syncSidebarFromUrl(window.location.pathname);
        }
    });

    window.addEventListener("pageshow", () => {
        if (typeof window.syncSidebarFromUrl === "function") {
            window.syncSidebarFromUrl(window.location.pathname);
        }
    });

}

// Restore synchronously when the sidebar is already in the DOM (the normal
// case: this script sits at the end of <body>). Fall back to DOMContentLoaded
// only if it somehow executes before the sidebar exists.
if (document.querySelector(".sidebar-scroll")) {
    initSidebar();
} else {
    document.addEventListener("DOMContentLoaded", initSidebar);
}