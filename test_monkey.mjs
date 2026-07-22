import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });

    await page.goto('http://localhost:3000/indas/indas1');
    await page.waitForTimeout(500);
    await page.waitForSelector('.standards-panel');

    // Type into search first
    await page.$eval('#standard-search', el => el.value = 'Ind AS 16');
    await page.dispatchEvent('#standard-search', 'input');
    await page.waitForTimeout(100);

    // Monkey-patch applyFilter to log railX after each section
    await page.evaluate(() => {
        const originalApplyFilter = window.applyFilter;
        let callCount = 0;
        window.applyFilter = function(rawTerm) {
            const result = originalApplyFilter(rawTerm);
            const railX = document.querySelector('.framework-rail').getBoundingClientRect().x;
            const panelX = document.querySelector('.standards-panel').getBoundingClientRect().x;
            console.log(`applyFilter call ${++callCount}: railX=${railX}, panelX=${panelX}`);
            return result;
        };
    });

    // Click clear button
    await page.click('#search-action');
    await page.waitForTimeout(500);

    // Get console logs
    const logs = await page.evaluate(() => {
        return window.__testLogs || [];
    });

    console.log('Console logs:', logs);

    await browser.close();
})();
