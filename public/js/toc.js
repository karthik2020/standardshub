document.addEventListener("DOMContentLoaded", () => {
    const pageToc = document.querySelector(".page-toc");
    const tocContainer = pageToc ? pageToc.querySelector(".toc ul") : null;
    const links = pageToc
        ? Array.from(pageToc.querySelectorAll(".toc a[data-section]"))
        : [];

    // Build the heading -> link map once. Each TOC link carries the real
    // section id in `data-section`; the heading element is the element with
    // that id. We skip links whose heading is missing so the map always
    // reflects what is actually on the page.
    const items = links
        .map((link) => {
            const id = link.dataset.section;
            const heading = id ? document.getElementById(id) : null;
            return heading ? { id, link, heading } : null;
        })
        .filter(Boolean);

    if (!items.length) {
        return;
    }

    const headerHeight = () =>
        parseInt(
            getComputedStyle(document.documentElement).getPropertyValue("--header-height")
        ) || 72;

    function scrollToId(targetId) {
        if (!targetId) return;
        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const offset = headerHeight() + 20;
        const targetPosition =
            targetElement.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({
            top: targetPosition,
            behavior: prefersReducedMotion ? "auto" : "smooth",
        });
    }

    function idFromHash(hash) {
        return hash.replace(/^#/, "").split("_")[0];
    }

    // --- Viewport-based active detection -----------------------------------
    //
    // We never trust individual IntersectionObserver events (those only report
    // the *delta* of what changed, so a section that is still on screen but did
    // not cross a threshold on this frame is reported as "not intersecting").
    // Instead we compute the reading region on every scroll frame and ask the
    // real layout where each heading currently sits.
    //
    // Reading region: a band just below the sticky header. A heading is active
    // when it sits inside the band, so several headings can be active at once.
    // When no heading is inside the band we keep the closest *preceding* heading
    // active, which gives the stable "trailing" behaviour documentation sites use.

    const READING_OFFSET = 12; // gap below the sticky header
    const READING_RATIO = 0.66; // band height as a fraction of the viewport
    const MIN_BAND = 140; // keep the band usable on short viewports

    // Keeps the TOC list scrolled so the active item stays in view.
    function keepActiveInView(activeLinks, force = false) {
        const activeLink = activeLinks[0];
        if (!activeLink || !tocContainer) return;

        if (!force && pageToc && pageToc.classList.contains("page-toc--user-scrolling")) {
            return;
        }

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const tocRect = pageToc.getBoundingClientRect();
        const linkRect = activeLink.getBoundingClientRect();

        if (linkRect.top < tocRect.top || linkRect.bottom > tocRect.bottom) {
            activeLink.scrollIntoView({
                behavior: prefersReducedMotion ? "auto" : "smooth",
                block: "nearest",
                inline: "nearest",
            });
        }
    }

    function computeActive() {
        const vh = window.innerHeight;
        const bandTop = headerHeight() + READING_OFFSET;
        const bandBottom = bandTop + Math.max(vh * READING_RATIO, MIN_BAND);

        const inBand = [];
        let preceding = null; // { item, top } with greatest top <= bandTop

        for (const item of items) {
            const top = item.heading.getBoundingClientRect().top;
            if (top >= bandTop && top <= bandBottom) {
                inBand.push(item);
            } else if (top <= bandTop) {
                if (!preceding || top > preceding.top) {
                    preceding = { item, top };
                }
            }
        }

        let active;
        if (inBand.length) {
            active = inBand;
        } else if (preceding) {
            active = [preceding.item];
        } else {
            // Nothing above the band yet (top of page) — default to first.
            active = [items[0]];
        }

        const activeIds = new Set(active.map((i) => i.id));
        const activeLinks = [];
        for (const item of items) {
            const isActive = activeIds.has(item.id);
            item.link.classList.toggle("active", isActive);
            if (isActive) activeLinks.push(item.link);
        }

        keepActiveInView(activeLinks);
    }

    // --- Intelligent TOC scrolling ------------------------------------------
    //
    // When the user manually scrolls the TOC, pause automatic follow for a
    // short period so the implementation does not fight their interaction.
    // Clicking a TOC link always forces the active item into view.

    let userTocScrollTimeout = null;
    const USER_TOC_SCROLL_PAUSE = 1500;

    function onUserTocScroll() {
        if (!pageToc) return;
        pageToc.classList.add("page-toc--user-scrolling");
        if (userTocScrollTimeout) clearTimeout(userTocScrollTimeout);
        userTocScrollTimeout = setTimeout(() => {
            pageToc.classList.remove("page-toc--user-scrolling");
            userTocScrollTimeout = null;
        }, USER_TOC_SCROLL_PAUSE);
    }

    if (pageToc) {
        pageToc.addEventListener("scroll", onUserTocScroll, { passive: true });
    }

    // --- Click handling without flicker ------------------------------------
    //
    // A click should activate the *target* immediately and hold it while the
    // smooth scroll travels, so intermediate sections never flash active. The
    // lock releases once the target heading reaches the reading line, once the
    // user takes over scrolling, or after a safety timeout.

    let pendingTarget = null;
    let releaseTimer = null;

    function releasePending() {
        pendingTarget = null;
        if (releaseTimer) {
            clearTimeout(releaseTimer);
            releaseTimer = null;
        }
    }

    function setActiveItem(item) {
        const activeIds = new Set([item.id]);
        const activeLinks = [];
        for (const it of items) {
            const isActive = activeIds.has(it.id);
            it.link.classList.toggle("active", isActive);
            if (isActive) activeLinks.push(it.link);
        }
        keepActiveInView(activeLinks, true);
    }

    links.forEach((link) => {
        link.addEventListener("click", (e) => {
            const href = link.getAttribute("href");
            if (!href || !href.startsWith("#")) return;

            e.preventDefault();
            const id = link.dataset.section;
            scrollToId(id);
            history.pushState(null, null, href);

            const item = items.find((i) => i.id === id);
            if (item) {
                setActiveItem(item);
                pendingTarget = item;
                if (releaseTimer) clearTimeout(releaseTimer);
                releaseTimer = setTimeout(releasePending, 1500);
            }
        });
    });

    // --- Throttled scroll/resize loop --------------------------------------
    let ticking = false;

    function onScroll() {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(() => {
                ticking = false;

                if (pendingTarget) {
                    const bandTop = headerHeight() + READING_OFFSET;
                    const top = pendingTarget.heading.getBoundingClientRect().top;
                    if (top <= bandTop + 4) {
                        // Target has arrived at the reading line — release lock.
                        releasePending();
                    } else {
                        // Hold the target active until it gets there.
                        return;
                    }
                }

                computeActive();
            });
        }
    }

    // User takes over scrolling -> drop the click lock immediately.
    ["wheel", "touchstart", "keydown"].forEach((evt) =>
        window.addEventListener(evt, () => {
            if (pendingTarget) {
                releasePending();
                computeActive();
            }
        }, { passive: true })
    );

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("popstate", () => scrollToId(idFromHash(window.location.hash)));

    if (window.location.hash) {
        requestAnimationFrame(() => scrollToId(idFromHash(window.location.hash)));
    }

    // Initial paint.
    requestAnimationFrame(computeActive);
});
