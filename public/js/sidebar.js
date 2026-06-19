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

});