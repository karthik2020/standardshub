document.addEventListener("DOMContentLoaded", () => {

    // ==========================================================
    // Helpers
    // ==========================================================

    const sections = [...document.querySelectorAll(".section")];

    function setSectionState(section, open) {

        const items = section.querySelector(".section-items");

        if (!items) return;

        section.classList.toggle("expanded", open);
        items.classList.toggle("hidden", !open);

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

    // sections.forEach(section => {

    //     const header =
    //         section.querySelector(".section-header");

    //     if (!header) return;

    //     header.addEventListener("click", () => {

    //         const open =
    //             !section.classList.contains("expanded");

    //         setSectionState(section, open);

    //     });

    // });

    // ==========================================================
    // Search
    // ==========================================================

    const searchInput =
        document.getElementById("standard-search");

    if (searchInput) {

        searchInput.addEventListener("input", () => {

            const term =
                searchInput.value
                    .trim()
                    .toLowerCase();

            sections.forEach(section => {

                const items =
                    section.querySelector(".section-items");

                const links =
                    [...section.querySelectorAll(".nav-link")];

                let visible = 0;

                links.forEach(link => {

                    const code =
                        (link.dataset.code || "")
                            .toLowerCase();

                    const title =
                        (link.dataset.title || "")
                            .toLowerCase();

                    const match =
                        term === "" ||
                        code.includes(term) ||
                        title.includes(term);

                    link.style.display =
                        match ? "" : "none";

                    if (match) visible++;

                });

                if (term === "") {

                    section.style.display = "";

                    setSectionState(
                        section,
                        getSavedState(section)
                    );

                } else {

                    section.style.display =
                        visible ? "" : "none";

                    if (visible) {

                        section.classList.add("expanded");
                        items.classList.remove("collapsed");

                    }

                }

            });

        });

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

        sidebar.classList.add("ready");

    }

});