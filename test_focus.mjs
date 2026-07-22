import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });

    await page.goto('http://localhost:3000/indas/indas1');
    await page.waitForTimeout(500);
    await page.waitForSelector('.standards-panel');

    const tests = [
        { name: 'focus only', action: () => page.$eval('#standard-search', el => el.focus()) },
        { name: 'focus + focus event classes', action: async () => {
            await page.$eval('#standard-search', el => el.focus());
            await page.waitForTimeout(100);
        }},
        { name: 'value clear only', action: () => page.$eval('#standard-search', el => el.value = '') },
        { name: 'value clear + focus', action: async () => {
            await page.$eval('#standard-search', el => { el.value = ''; el.focus(); });
            await page.waitForTimeout(100);
        }},
        { name: 'applyFilter full clear', action: async () => {
            await page.evaluate(() => {
                const filterInput = document.getElementById('standard-search');
                const filterContainer = document.querySelector('.search-input-wrapper');
                const clearButton = document.getElementById('search-action');
                const emptyState = document.getElementById('sidebar-empty');
                const panel = document.querySelector('.standards-panel');
                
                filterInput.value = '';
                const hasTerm = false;
                
                if (filterContainer) filterContainer.classList.toggle('has-value', hasTerm);
                if (clearButton) clearButton.classList.toggle('visible', hasTerm);
                
                const sections = document.querySelectorAll('.section');
                sections.forEach(section => {
                    const links = section.querySelectorAll('.nav-link');
                    links.forEach(link => link.style.display = '');
                    section.style.display = '';
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
        }},
    ];

    for (const test of tests) {
        // Reset search state
        await page.$eval('#standard-search', el => el.value = 'Ind AS 16');
        await page.dispatchEvent('#standard-search', 'input');
        await page.waitForTimeout(100);

        // Run test action
        await test.action();

        const data = await page.evaluate(() => {
            const rail = document.querySelector('.framework-rail');
            const panel = document.querySelector('.standards-panel');
            const wrapper = document.querySelector('.search-input-wrapper');
            return {
                railX: rail.getBoundingClientRect().x,
                panelX: panel.getBoundingClientRect().x,
                searching: panel.classList.contains('searching'),
                hasValue: wrapper.classList.contains('has-value'),
            };
        });

        console.log(`${test.name}: railX=${data.railX}, panelX=${data.panelX}, searching=${data.searching}, hasValue=${data.hasValue}`);
    }

    await browser.close();
})();
