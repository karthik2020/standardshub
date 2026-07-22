import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });

    await page.goto('http://localhost:3000/indas/indas1');
    await page.waitForTimeout(500);
    await page.waitForSelector('.standards-panel');

    // Get initial position
    const initial = await page.evaluate(() => {
        const rail = document.querySelector('.framework-rail');
        const panel = document.querySelector('.standards-panel');
        return {
            railX: rail.getBoundingClientRect().x,
            panelX: panel.getBoundingClientRect().x,
        };
    });

    console.log('Initial railX:', initial.railX, 'panelX:', initial.panelX);

    // Type into search
    await page.$eval('#standard-search', el => el.value = 'Ind AS 16');
    await page.dispatchEvent('#standard-search', 'input');
    await page.waitForTimeout(100);

    const afterSearch = await page.evaluate(() => {
        const rail = document.querySelector('.framework-rail');
        const panel = document.querySelector('.standards-panel');
        const wrapper = document.querySelector('.search-input-wrapper');
        return {
            railX: rail.getBoundingClientRect().x,
            panelX: panel.getBoundingClientRect().x,
            wrapperClasses: wrapper.className,
            panelClasses: panel.className,
        };
    });

    console.log('After search railX:', afterSearch.railX, 'panelX:', afterSearch.panelX);
    console.log('Wrapper classes:', afterSearch.wrapperClasses);
    console.log('Panel classes:', afterSearch.panelClasses);

    // Reproduce EXACT clear button sequence from sidebar.js
    await page.evaluate(() => {
        const filterInput = document.getElementById('standard-search');
        const clearButton = document.getElementById('search-action');
        const filterContainer = document.querySelector('.search-input-wrapper');
        const emptyState = document.getElementById('sidebar-empty');
        const panel = document.querySelector('.standards-panel');

        // Step 1: sidebar.js handler
        filterInput.value = '';
        const filterTerm = '';
        const hasTerm = filterTerm !== '';

        if (filterContainer) {
            filterContainer.classList.toggle('has-value', hasTerm);
        }
        if (clearButton) {
            clearButton.classList.toggle('visible', hasTerm);
        }

        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            const links = section.querySelectorAll('.nav-link');
            let visible = 0;
            links.forEach(link => {
                link.style.display = '';
                visible++;
            });
            section.style.display = visible ? '' : 'none';
            const items = section.querySelector('.section-items');
            if (items) {
                items.classList.remove('collapsed');
                items.style.maxHeight = items.scrollHeight + 'px';
            }
        });

        if (emptyState) emptyState.hidden = true;
        filterInput.focus();
    });

    await page.waitForTimeout(100);

    const afterSidebarHandler = await page.evaluate(() => {
        const rail = document.querySelector('.framework-rail');
        const panel = document.querySelector('.standards-panel');
        const wrapper = document.querySelector('.search-input-wrapper');
        return {
            railX: rail.getBoundingClientRect().x,
            panelX: panel.getBoundingClientRect().x,
            wrapperClasses: wrapper.className,
            panelClasses: panel.className,
        };
    });

    console.log('After sidebar handler railX:', afterSidebarHandler.railX, 'panelX:', afterSidebarHandler.panelX);
    console.log('Wrapper classes:', afterSidebarHandler.wrapperClasses);
    console.log('Panel classes:', afterSidebarHandler.panelClasses);

    // Step 2: search.js focus handler (triggered by focus event)
    // This should happen automatically when focus() is called

    // Step 3: rail-panel.js rAF handler
    await page.evaluate(() => {
        const panel = document.querySelector('.standards-panel');
        const searchInput = document.getElementById('standard-search');
        panel.classList.remove('searching');
    });

    await page.waitForTimeout(100);

    const afterRailHandler = await page.evaluate(() => {
        const rail = document.querySelector('.framework-rail');
        const panel = document.querySelector('.standards-panel');
        return {
            railX: rail.getBoundingClientRect().x,
            panelX: panel.getBoundingClientRect().x,
        };
    });

    console.log('After rail handler railX:', afterRailHandler.railX, 'panelX:', afterRailHandler.panelX);

    // Now try the FULL real click
    await page.$eval('#standard-search', el => el.value = 'Ind AS 16');
    await page.dispatchEvent('#standard-search', 'input');
    await page.waitForTimeout(100);

    await page.click('#search-action');
    await page.waitForTimeout(500);

    const afterRealClick = await page.evaluate(() => {
        const rail = document.querySelector('.framework-rail');
        const panel = document.querySelector('.standards-panel');
        return {
            railX: rail.getBoundingClientRect().x,
            panelX: panel.getBoundingClientRect().x,
        };
    });

    console.log('After real click railX:', afterRealClick.railX, 'panelX:', afterRealClick.panelX);

    await browser.close();
})();
