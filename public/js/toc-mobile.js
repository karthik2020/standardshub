(function () {
    const SCROLL_THRESHOLD = 400;
    const launcher = document.getElementById('tocLauncher');
    const backdrop = document.getElementById('tocSheetBackdrop');
    const toc = document.querySelector('.page-toc');
    const closeButton = document.getElementById('tocSheetClose');

    if (!launcher || !backdrop || !toc || !closeButton) return;

    let ticking = false;
    let isOpen = false;

    function showLauncher() {
        launcher.classList.add('is-visible');
    }

    function hideLauncher() {
        launcher.classList.remove('is-visible');
    }

    function openSheet() {
        isOpen = true;
        toc.classList.add('is-open');
        backdrop.classList.add('is-open');
        document.body.classList.add('toc-open');
        launcher.setAttribute('aria-expanded', 'true');
        launcher.classList.add('is-hidden');

        const firstLink = toc.querySelector('.toc a[data-section]');
        if (firstLink) {
            firstLink.focus();
        }
    }

    function closeSheet() {
        isOpen = false;
        toc.classList.remove('is-open');
        backdrop.classList.remove('is-open');
        document.body.classList.remove('toc-open');
        launcher.setAttribute('aria-expanded', 'false');
        launcher.classList.remove('is-hidden');
        launcher.focus();

        requestAnimationFrame(onScroll);
    }

    launcher.addEventListener('click', function () {
        if (isOpen) {
            closeSheet();
        } else {
            openSheet();
        }
    });

    closeButton.addEventListener('click', closeSheet);

    backdrop.addEventListener('click', closeSheet);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && isOpen) {
            closeSheet();
        }
    });

    toc.addEventListener('click', function (e) {
        var link = e.target.closest('.toc a[data-section]');
        if (link) {
            setTimeout(closeSheet, 50);
        }
    });

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(function () {
                var scrollY = window.scrollY || window.pageYOffset;
                if (scrollY > SCROLL_THRESHOLD) {
                    showLauncher();
                } else {
                    hideLauncher();
                }
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    onScroll();
})();
