document.addEventListener("DOMContentLoaded", () => {

    const headers = document.querySelectorAll(".section-header");

    headers.forEach((header) => {

        const section = header.closest(".section");
        const sectionName = section.dataset.section;

        const items = header.nextElementSibling;

        if (!items || !items.classList.contains("section-items")) {
            return;
        }

        const savedState = localStorage.getItem(`section-${sectionName}`);

        if (savedState === "open") {
            section.classList.add("expanded");
        } else {
            items.classList.add("hidden");
        }

        header.addEventListener("click", () => {

            items.classList.toggle("hidden");
            section.classList.toggle("expanded");

            localStorage.setItem(
                `section-${sectionName}`,
                items.classList.contains("hidden")
                    ? "closed"
                    : "open"
            );

        });

    });
    const searchInput = document.getElementById("standard-search");

    if (searchInput) {

        searchInput.addEventListener("input", (e) => {

            const searchTerm = e.target.value.toLowerCase().trim();

            const sections = document.querySelectorAll(".section");

            sections.forEach((section) => {

                const items = section.querySelector(".section-items");
                const links = section.querySelectorAll(".nav-link");

                let visibleCount = 0;

                links.forEach((link) => {

                    const code =
                        (link.dataset.code || "").toLowerCase();

                    const title =
                        (link.dataset.title || "").toLowerCase();

                    const matches =
                        searchTerm === "" ||
                        code.includes(searchTerm) ||
                        title.includes(searchTerm);

                    link.style.display = matches ? "block" : "none";

                    if (matches) {
                        visibleCount++;
                    }

                });

                if (searchTerm === "") {

                    section.style.display = "";

                    const sectionName =
                        section.dataset.section;

                    const savedState =
                        localStorage.getItem(
                            `section-${sectionName}`
                        );

                    if (savedState === "open") {
                        items.classList.remove("hidden");
                        section.classList.add("expanded");
                    } else {
                        items.classList.add("hidden");
                        section.classList.remove("expanded");
                    }

                } else {

                    section.style.display =
                        visibleCount > 0
                            ? ""
                            : "none";

                    if (visibleCount > 0) {
                        items.classList.remove("hidden");
                        section.classList.add("expanded");
                    }

                }

            });

        });

    }
});
document.querySelector(".sidebar").classList.add("loaded");
const sidebar = document.querySelector(".sidebar");

if (sidebar) {

    const savedScroll =
        sessionStorage.getItem("sidebar-scroll");

    if (savedScroll) {
        sidebar.scrollTop = Number(savedScroll);
    }

    sidebar.addEventListener("scroll", () => {
        sessionStorage.setItem(
            "sidebar-scroll",
            sidebar.scrollTop
        );
    });

}










