document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("standard-search");
    const placeholder = document.getElementById("search-placeholder");
    const button = document.getElementById("search-action");
    const container = document.querySelector(".search-input");

    if (!input || !placeholder || !button || !container) return;

    const suggestions = [

        "IAS 38",
        "Revenue",
        "IFRS 15",
        "Leases",
        "IAS 16",
        "Fair value",
        "IAS 36",
        "Impairment",
        "Cash flows",
        "Goodwill",
        "Consolidation"

    ];

    let index = 0;
    let timer;

    placeholder.textContent = suggestions[index];

    function rotatePlaceholder() {

        if (
            document.activeElement === input ||
            input.value.trim() !== ""
        ) {

            scheduleNext();
            return;

        }

        placeholder.classList.add("leaving");

        setTimeout(() => {

            index = (index + 1) % suggestions.length;

            placeholder.textContent = suggestions[index];

            placeholder.classList.remove("leaving");

            placeholder.classList.add("entering");

            requestAnimationFrame(() => {

                placeholder.classList.remove("entering");

            });

            scheduleNext();

        }, 160);

    }

    let firstRotation = true;

    function scheduleNext() {

        clearTimeout(timer);

        const delay = firstRotation ? 2000 : 3000;

        firstRotation = false;

        timer = setTimeout(
            rotatePlaceholder,
            delay
        );

    }

    scheduleNext();

    input.addEventListener("focus", () => {

        container.classList.add("focused");

    });

    input.addEventListener("blur", () => {
        if (input.value.trim() === "") {

            container.classList.remove("focused");

            index = 0;
            firstRotation = true;

            placeholder.textContent = suggestions[index];

            scheduleNext();

        }
    });

});

    input.addEventListener("blur", () => {

        if (input.value.trim() === "") {

            container.classList.remove("focused");

            buttonAnimated = false;

            button.classList.remove("button-active");

            index = 0;
            firstRotation = true;

            placeholder.textContent = suggestions[index];

            scheduleNext();

        }

    });

});