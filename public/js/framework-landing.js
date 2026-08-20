document.addEventListener("DOMContentLoaded", () => {
    const btnNumber = document.getElementById("btn-number");
    const btnCategory = document.getElementById("btn-category");
    const slider = document.querySelector(".segmented-slider");
    const numberView = document.getElementById("number-view");
    const categoryView = document.getElementById("category-view");
    const searchInput = document.getElementById("framework-search-input");
    const clearBtn = document.getElementById("framework-search-clear");
    let noResults = document.getElementById("no-standards-results");

    // Dynamic fallback: inject "No results" banner if missing
    if (!noResults && searchInput) {
        noResults = document.createElement("div");
        noResults.id = "no-standards-results";
        noResults.className = "no-standards-results";
        noResults.style.display = "none";
        noResults.innerHTML = `
            <div class="no-results-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <h3>No matching standards found</h3>
            <p>We couldn't find any standards matching your search term. Try searching for a different code or keyword.</p>
        `;
        const insertTarget = document.querySelector(".segmented-control") || document.querySelector(".standards-group");
        if (insertTarget) {
            insertTarget.parentNode.insertBefore(noResults, insertTarget.nextSibling);
        } else {
            const content = document.querySelector(".content");
            if (content) content.appendChild(noResults);
        }
    }

    // 1. Setup view toggles (if they exist)
    if (btnNumber && btnCategory && numberView && categoryView) {
        // Set transition styles on load
        numberView.style.transition = "opacity 0.22s ease, transform 0.22s ease";
        categoryView.style.transition = "opacity 0.22s ease, transform 0.22s ease";
        
        // Set initial state for inactive view
        categoryView.style.display = "none";
        categoryView.style.opacity = "0";
        categoryView.style.transform = "translateY(8px)";

        function switchView(showBtn, hideBtn, showView, hideView) {
            showBtn.classList.add("active");
            showBtn.setAttribute("aria-pressed", "true");
            hideBtn.classList.remove("active");
            hideBtn.setAttribute("aria-pressed", "false");

            // Slide background pill
            if (showBtn === btnCategory) {
                if (slider) slider.style.transform = "translateX(100%)";
            } else {
                if (slider) slider.style.transform = "translateX(0)";
            }

            // Fade out
            hideView.style.opacity = "0";
            hideView.style.transform = "translateY(8px)";
            
            setTimeout(() => {
                hideView.style.display = "none";
                showView.style.display = "block";
                
                // Trigger reflow
                showView.offsetHeight;
                
                showView.style.opacity = "1";
                showView.style.transform = "translateY(0)";
                
                // Re-run filtering to update the active view list and noResults banner
                if (searchInput) {
                    filterStandards(searchInput.value);
                }
            }, 220);
        }

        btnNumber.addEventListener("click", () => {
            if (btnNumber.classList.contains("active")) return;
            switchView(btnNumber, btnCategory, numberView, categoryView);
        });

        btnCategory.addEventListener("click", () => {
            if (btnCategory.classList.contains("active")) return;
            switchView(btnCategory, btnNumber, categoryView, numberView);
        });
    }

    // Helper to normalize strings for search matching
    function normalize(str) {
        return str.toLowerCase().replace(/[-\s]+/g, "");
    }

    function filterStandards(val) {
        const query = normalize(val);
        let totalVisible = 0;

        // 1. Filter number view (if it exists)
        if (numberView) {
            const numCards = numberView.querySelectorAll(".standard-card");
            numCards.forEach(card => {
                const code = card.querySelector(".standard-code")?.textContent || "";
                const title = card.querySelector(".standard-title")?.textContent || "";
                const matches = normalize(code).includes(query) || normalize(title).includes(query);
                card.style.display = matches ? "flex" : "none";
                if (matches) totalVisible++;
            });

            const numGroups = numberView.querySelectorAll(".standards-group");
            numGroups.forEach(group => {
                const cardsInGroup = group.querySelectorAll(".standard-card");
                const hasVisible = Array.from(cardsInGroup).some(c => c.style.display === "flex");
                group.style.display = hasVisible ? "block" : "none";
            });
        }

        // 2. Filter category view (if it exists)
        if (categoryView) {
            const catGroups = categoryView.querySelectorAll(".category-group");
            catGroups.forEach(group => {
                const cards = group.querySelectorAll(".standard-card");
                let visibleInGroup = 0;
                cards.forEach(card => {
                    const code = card.querySelector(".standard-code")?.textContent || "";
                    const title = card.querySelector(".standard-title")?.textContent || "";
                    const matches = normalize(code).includes(query) || normalize(title).includes(query);
                    card.style.display = matches ? "flex" : "none";
                    if (matches) {
                        visibleInGroup++;
                        totalVisible++;
                    }
                });
                group.style.display = visibleInGroup > 0 ? "block" : "none";
            });
        }

        // 3. Fallback: filter general page standard groups/cards if no numberView or categoryView exists (e.g. HGB)
        if (!numberView && !categoryView) {
            const cards = document.querySelectorAll(".content .standard-card");
            cards.forEach(card => {
                const code = card.querySelector(".standard-code")?.textContent || "";
                const title = card.querySelector(".standard-title")?.textContent || "";
                const matches = normalize(code).includes(query) || normalize(title).includes(query);
                card.style.display = matches ? "flex" : "none";
                if (matches) totalVisible++;
            });

            const groups = document.querySelectorAll(".content .standards-group");
            groups.forEach(group => {
                const cardsInGroup = group.querySelectorAll(".standard-card");
                const hasVisible = Array.from(cardsInGroup).some(c => c.style.display === "flex");
                group.style.display = hasVisible ? "block" : "none";
            });
        }

        // 4. Update noResults notice
        if (noResults) {
            if (totalVisible === 0) {
                noResults.style.display = "block";
            } else {
                noResults.style.display = "none";
            }
        }

        // 5. If query is active and there are results, scroll the first visible card into view
        if (query.length > 0 && totalVisible > 0) {
            const allCards = document.querySelectorAll(".standard-card");
            let firstVisible = null;
            for (const card of allCards) {
                if (card.style.display !== "none" && card.offsetParent !== null) {
                    firstVisible = card;
                    break;
                }
            }
            if (firstVisible) {
                const rect = firstVisible.getBoundingClientRect();
                if (rect.top > window.innerHeight * 0.65) {
                    window.scrollBy({
                        top: rect.top - 150,
                        behavior: "smooth"
                    });
                }
            }
        }
    }

    if (searchInput) {
        const wrapper = searchInput.closest(".search-input-wrapper");
        
        searchInput.addEventListener("focus", () => {
            if (wrapper) wrapper.classList.add("focused");
        });

        searchInput.addEventListener("blur", () => {
            if (wrapper && searchInput.value.trim() === "") {
                wrapper.classList.remove("focused");
            }
        });

        searchInput.addEventListener("input", () => {
            const val = searchInput.value;
            if (val.trim() !== "") {
                if (clearBtn) clearBtn.style.display = "flex";
            } else {
                if (clearBtn) clearBtn.style.display = "none";
            }
            filterStandards(val);
        });

        if (clearBtn) {
            clearBtn.addEventListener("click", () => {
                searchInput.value = "";
                clearBtn.style.display = "none";
                filterStandards("");
                searchInput.focus();
                if (wrapper) wrapper.classList.remove("focused");
            });
        }

        searchInput.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                searchInput.value = "";
                if (clearBtn) clearBtn.style.display = "none";
                filterStandards("");
                searchInput.blur();
                if (wrapper) wrapper.classList.remove("focused");
            }
        });
    }
});
