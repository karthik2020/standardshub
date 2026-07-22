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
        return {
            railX: rail.getBoundingClientRect().x,
            panelX: panel.getBoundingClientRect().x,
        };
    });

    console.log('After search railX:', afterSearch.railX, 'panelX:', afterSearch.panelX);

    // Test 1: Remove searching class manually, don't run applyFilter
    await page.evaluate(() => {
        const panel = document.querySelector('.standards-panel');
        panel.classList.remove('searching');
    });
    await page.waitForTimeout(500);

    const afterManualRemove = await page.evaluate(() => {
        const rail = document.querySelector('.framework-rail');
        const panel = document.querySelector('.standards-panel');
        return {
            railX: rail.getBoundingClientRect().x,
            panelX: panel.getBoundingClientRect().x,
        };
    });

    console.log('After manual remove searching railX:', afterManualRemove.railX, 'panelX:', afterManualRemove.panelX);

    // Test 2: Now run applyFilter manually
    await page.evaluate(() => {
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.style.display = '';
            const items = section.querySelector('.section-items');
            if (items) items.classList.remove('collapsed');
        });
    });
    await page.waitForTimeout(500);

    const afterApplyFilter = await page.evaluate(() => {
        const rail = document.querySelector('.framework-rail');
        const panel = document.querySelector('.standards-panel');
        return {
            railX: rail.getBoundingClientRect().x,
            panelX: panel.getBoundingClientRect().x,
        };
    });

    console.log('After applyFilter railX:', afterApplyFilter.railX, 'panelX:', afterApplyFilter.panelX);

    await browser.close();
})();
