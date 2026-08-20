(function () {
    const progressBar = document.querySelector('.reading-progress-bar');
    const progressContainer = document.querySelector('.reading-progress');

    if (!progressBar || !progressContainer) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        progressBar.style.transition = 'none';
    }

    let ticking = false;

    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        progressBar.style.width = progress + '%';

        if (docHeight > 0) {
            progressContainer.classList.add('is-scrollable');
        } else {
            progressContainer.classList.remove('is-scrollable');
        }

        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(updateProgress);
            ticking = true;
        }
    }, { passive: true });

    window.addEventListener('resize', function () {
        requestAnimationFrame(updateProgress);
    });

    updateProgress();
})();

