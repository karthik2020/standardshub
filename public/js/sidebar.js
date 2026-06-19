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

            const links = document.querySelectorAll(".nav-link");

            links.forEach((link) => {

                const code =
                    (link.dataset.code || "").toLowerCase();

                const title =
                    (link.dataset.title || "").toLowerCase();

                const matches =
                    code.includes(searchTerm) ||
                    title.includes(searchTerm);

                link.style.display = matches ? "block" : "none";

            });

        });

    }
});