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

    const before = await page.evaluate(() => {
        const rail = document.querySelector('.framework-rail');
        return {
            railX: rail.getBoundingClientRect().x,
            windowScrollY: window.scrollY,
            windowScrollX: window.scrollX,
            sidebarScrollTop: document.querySelector('.sidebar-scroll').scrollTop,
            sidebarScrollLeft: document.querySelector('.sidebar-scroll').scrollLeft,
            pageYOffset: window.pageYOffset,
            pageXOffset: window.pageXOffset,
        };
    });

    console.log('Before focus:', before);

    await page.$eval('#standard-search', el => el.focus());
    await page.waitForTimeout(100);

    const after = await page.evaluate(() => {
        const rail = document.querySelector('.framework-rail');
        return {
            railX: rail.getBoundingClientRect().x,
            windowScrollY: window.scrollY,
            windowScrollX: window.scrollX,
            sidebarScrollTop: document.querySelector('.sidebar-scroll').scrollTop,
            sidebarScrollLeft: document.querySelector('.sidebar-scroll').scrollLeft,
            pageYOffset: window.pageYOffset,
            pageXOffset: window.pageXOffset,
        };
    });

    console.log('After focus:', after);

    await browser.close();
})();
