import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });

    await page.goto('http://localhost:3000/indas/indas1');
    await page.waitForTimeout(500);
    await page.waitForSelector('.standards-panel');

    const data = await page.evaluate(() => {
        const wrapper = document.querySelector('.search-input-wrapper');
        const panel = document.querySelector('.standards-panel');
        const ws = window.getComputedStyle(wrapper);
        const ps = window.getComputedStyle(panel);
        
        return {
            borderColor: ws.borderColor,
            borderWidth: ws.borderWidth,
            boxShadow: ws.boxShadow,
            panelBorderColor: ps.borderColor,
            railAccent: getComputedStyle(document.documentElement).getPropertyValue('--framework-accent').trim(),
        };
    });

    console.log('Wrapper border:', data.borderWidth, data.borderColor);
    console.log('Wrapper boxShadow:', data.boxShadow);
    console.log('Panel border:', data.panelBorderColor);
    console.log('--framework-accent:', data.railAccent);

    await browser.close();
})();
