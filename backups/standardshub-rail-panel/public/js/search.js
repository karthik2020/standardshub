document.addEventListener("DOMContentLoaded", () => {

    const inputs = document.querySelectorAll("#standard-search");

    inputs.forEach((input) => {

        const wrapper = input.closest(".search-input-wrapper");
        if (!wrapper) return;

        const placeholder = wrapper.querySelector(".search-placeholder");
        const button = wrapper.querySelector(".search-action");
        const container = wrapper.querySelector(".search-input");

        if (!placeholder || !button || !container) return;

        const suggestions = [
            "Search IAS 16...",
            "Search Revenue...",
            "Search Leases...",
            "Search PPE...",
            "Search Inventories...",
            "Search IAS 38..."
        ];

        let index = 0;
        let timer;

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

            timer = setTimeout(rotatePlaceholder, delay);

        }

        function updateClearButton() {

            if (input.value.trim() !== "") {
                button.classList.add("visible");
            } else {
                button.classList.remove("visible");
            }

        }

        scheduleNext();

        input.addEventListener("focus", () => {
            container.classList.add("focused");
            updateClearButton();
        });

        input.addEventListener("blur", () => {
            if (input.value.trim() === "") {
                container.classList.remove("focused");

                index = 0;
                firstRotation = true;

                placeholder.textContent = suggestions[index];

                scheduleNext();
            }
            updateClearButton();
        });

        input.addEventListener("input", updateClearButton);

        button.addEventListener("click", () => {
            input.value = "";
            updateClearButton();
            input.focus();
        });

    });

});
