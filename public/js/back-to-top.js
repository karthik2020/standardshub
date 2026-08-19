(function () {
    var SCROLL_THRESHOLD = 1200;
    var DEFAULT_LAUNCHER_SIZE = 44;

    var btn = document.getElementById('backToTop');
    if (!btn) return;

    var launcher = document.getElementById('tocLauncher');
    var ticker = false;

    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function sheetOpen() {
        return document.body.classList.contains('toc-open');
    }

    function measureLauncher() {
        if (!launcher) return;
        var display = window.getComputedStyle(launcher).display;
        var height = display === 'none' ? DEFAULT_LAUNCHER_SIZE : launcher.offsetHeight;
        btn.style.setProperty('--back-to-top-offset', height + 'px');
    }

    function show() {
        btn.classList.add('is-visible');
    }

    function hide() {
        btn.classList.remove('is-visible');
    }

    function apply() {
        if (sheetOpen()) {
            hide();
            return;
        }
        if (window.scrollY > SCROLL_THRESHOLD) {
            show();
        } else {
            hide();
        }
    }

    function onScroll() {
        if (!ticker) {
            ticker = true;
            requestAnimationFrame(function () {
                apply();
                ticker = false;
            });
        }
    }

    function onResize() {
        measureLauncher();
        onScroll();
    }

    // Enhanced back‑to‑top: ensure we scroll to the absolute top even if browser offsets exist
    btn.addEventListener('click', function () {
        // Scroll the main document and any potential scrolling element to the top
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: prefersReducedMotion() ? 'auto' : 'smooth'
        });
        // Fallback for browsers that may keep a residual scroll position on the <html> element
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    });

    var observer = new MutationObserver(onScroll);
    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    measureLauncher();
    apply();
})();
