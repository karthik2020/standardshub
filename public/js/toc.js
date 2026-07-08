document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".toc a");
    const sections = document.querySelectorAll(".page-content section[id], .page-content div[id]");
    const tocContainer = document.querySelector(".toc ul");

    if (!links.length || !sections.length) {
        return;
    }

    // Function to scroll TOC to keep active item visible
    function scrollTocToActiveItem() {
        const activeLink = document.querySelector(".toc a.active");
        if (!activeLink || !tocContainer) return;

        const tocRect = tocContainer.getBoundingClientRect();
        const linkRect = activeLink.getBoundingClientRect();
        
        // Check if active link is outside visible area
        if (linkRect.top < tocRect.top || linkRect.bottom > tocRect.bottom) {
            activeLink.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "nearest"
            });
        }
    }

    const observer = new IntersectionObserver(
        (entries) => {
            // Track all currently visible sections
            const visibleSections = new Set();
            
            entries.forEach((entry) => {
                const id = entry.target.id;
                if (entry.isIntersecting) {
                    visibleSections.add(id);
                }
            });

            // Update all links based on visible sections
            links.forEach((link) => {
                const sectionId = link.dataset.section;
                const isVisible = visibleSections.has(sectionId);
                
                link.classList.toggle("active", isVisible);
                
                // Add partial class for sections that are partially visible
                if (isVisible) {
                    const section = document.getElementById(sectionId);
                    if (section) {
                        const sectionRect = section.getBoundingClientRect();
                        const viewportHeight = window.innerHeight;
                        const isFullyVisible = sectionRect.top >= 0 && sectionRect.bottom <= viewportHeight;
                        link.classList.toggle("partial", !isFullyVisible);
                    }
                } else {
                    link.classList.remove("partial");
                }
            });

            // Scroll TOC to keep active items visible
            if (visibleSections.size > 0) {
                requestAnimationFrame(scrollTocToActiveItem);
            }
        },
        {
            // Adjust rootMargin to account for sticky header
            rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 72}px 0px -40% 0px`,
            threshold: [0, 0.25, 0.5, 0.75, 1]
        }
    );

    sections.forEach((section) => {
        observer.observe(section);
    });

    // Smooth scroll with offset for sticky header
    links.forEach((link) => {
        link.addEventListener("click", (e) => {
            const href = link.getAttribute("href");
            if (href.startsWith("#")) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 72;
                    const offset = headerHeight + 20; // Additional padding
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: "smooth"
                    });
                    
                    // Update URL without jumping
                    history.pushState(null, null, href);
                }
            }
        });
    });

    // Handle browser back/forward navigation
    window.addEventListener("popstate", () => {
        const hash = window.location.hash;
        if (hash) {
            const targetElement = document.getElementById(hash.substring(1));
            if (targetElement) {
                const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 72;
                const offset = headerHeight + 20;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });
            }
        }
    });
});