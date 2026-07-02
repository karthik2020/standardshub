document.addEventListener("DOMContentLoaded", () => {

    const links =
        document.querySelectorAll(".toc a");

    const sections =
        document.querySelectorAll(
            ".page-content section[id], .page-content div[id]"
        );

    if (!links.length || !sections.length) {
        return;
    }

    const observer =
        new IntersectionObserver(

            (entries) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    const id =
                        entry.target.id;

                    links.forEach((link) => {

                        link.classList.toggle(
                            "active",
                            link.dataset.section === id
                        );

                    });

                });

            },

            {

                rootMargin:
                    "-80px 0px -60% 0px",

                threshold: 0,

            }

        );

    sections.forEach((section) => {

        observer.observe(section);

    });

});