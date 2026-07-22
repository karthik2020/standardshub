import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });

    await page.goto('http://localhost:3000/indas/indas1');
    await page.waitForTimeout(500);
    await page.waitForSelector('.standards-panel');

    // Remove search.js event listeners by overriding the input's focus handler
    await page.evaluate(() => {
        const input = document.getElementById('standard-search');
        const newInput = input.cloneNode(true);
        input.parentNode.replaceChild(newInput, input);
    });

    await page.waitForTimeout(100);

    const before = await page.evaluate(() => {
        const rail = document.querySelector('.framework-rail');
        return {
            railX: rail.getBoundingClientRect().x,
        };
    });

    console.log('Before focus (no search.js):', before);

    // Re-get the input after clone
    const input = await page.$('#standard-search');
    await input.focus();
    await page.waitForTimeout(100);

    const after = await page.evaluate(() => {
        const rail = document.querySelector('.framework-rail');
        return {
            railX: rail.getBoundingClientRect().x,
        };
    });

    console.log('After focus (no search.js):', after);

    await browser.close();
})();
