document.addEventListener("DOMContentLoaded", () => {

    const root = document.documentElement;

    let fontScale =
        Number(localStorage.getItem("font-scale")) || 1;

    root.style.setProperty(
        "--font-scale",
        fontScale
    );

    const increase =
        document.getElementById("font-increase");

    const decrease =
        document.getElementById("font-decrease");

    increase?.addEventListener("click", () => {

        

        ffontScale = Number(
            Math.min(1.5, fontScale + 0.05).toFixed(2)
        );

        root.style.setProperty(
            "--font-scale",
            fontScale
        );

        localStorage.setItem(
            "font-scale",
            fontScale
        );

    });

    decrease?.addEventListener("click", () => {

        fontScale = Number(
            Math.max(0.8, fontScale - 0.05).toFixed(2)
        );

        root.style.setProperty(
            "--font-scale",
            fontScale
        );

        localStorage.setItem(
            "font-scale",
            fontScale
        );

    });
    const menu =
        document.getElementById(
            "reading-menu"
        );

    const button =
        document.getElementById(
            "reading-settings"
        );

    button?.addEventListener(
        "click",
        () => {

            menu.classList.toggle(
                "open"
            );

        }
    );
});