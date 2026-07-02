(() => {

    const STORAGE_KEY = "theme";

    const html = document.documentElement;

    const systemDark = () =>
        window.matchMedia("(prefers-color-scheme: dark)").matches;

    function applyTheme(theme) {

        if (theme === "system") {

            html.dataset.theme =
                systemDark() ? "dark" : "light";

        } else {

            html.dataset.theme = theme;

        }

    }

    function setTheme(theme) {

        localStorage.setItem(STORAGE_KEY, theme);

        applyTheme(theme);

        updateButtons(theme);

    }

    function getTheme() {

        return localStorage.getItem(STORAGE_KEY) || "system";

    }

    function updateButtons(theme) {

        document
            .querySelectorAll("[data-theme-option]")
            .forEach(btn => {

                btn.classList.toggle(
                    "active",
                    btn.dataset.themeOption === theme
                );

            });

    }

    const savedTheme = getTheme();

    applyTheme(savedTheme);

    window.matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", () => {

            if (getTheme() === "system") {

                applyTheme("system");

            }

        });

    document.addEventListener("DOMContentLoaded", () => {

        updateButtons(savedTheme);

        document
            .querySelectorAll("[data-theme-option]")
            .forEach(btn => {

                btn.addEventListener("click", () => {

                    setTheme(btn.dataset.themeOption);

                });

            });

    });

})();