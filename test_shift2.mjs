import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });

    await page.goto('http://localhost:3000/indas/indas1');
    await page.waitForTimeout(500);
    await page.waitForSelector('.standards-panel');

    const states = ['INITIAL', 'AFTER_SEARCH', 'AFTER_CLEAR'];

    for (let i = 0; i < states.length; i++) {
        const state = states[i];
        
        if (state === 'AFTER_SEARCH') {
            await page.$eval('#standard-search', el => el.value = 'Ind AS 16');
            await page.dispatchEvent('#standard-search', 'input');
            await page.waitForTimeout(100);
        } else if (state === 'AFTER_CLEAR') {
            await page.click('#search-action');
            await page.waitForTimeout(500);
        }

        const data = await page.evaluate(() => {
            const sidebar = document.querySelector('.standards-sidebar');
            const rail = document.querySelector('.framework-rail');
            const panel = document.querySelector('.standards-panel');
            const search = document.querySelector('.search-input-wrapper');
            
            return {
                sidebarRect: sidebar.getBoundingClientRect(),
                railRect: rail.getBoundingClientRect(),
                panelRect: panel.getBoundingClientRect(),
                searchRect: search.getBoundingClientRect(),
                railChildren: rail.children.length,
                panelChildren: panel.children.length,
                sidebarChildren: sidebar.children.length,
                sidebarClasses: sidebar.className,
                panelClasses: panel.className,
                railClasses: rail.className,
                searchClasses: search.className,
            };
        });

        console.log(`\n=== ${state} ===`);
        console.log('sidebar classes:', data.sidebarClasses);
        console.log('panel classes:', data.panelClasses);
        console.log('rail classes:', data.railClasses);
        console.log('search classes:', data.searchClasses);
        console.log('sidebar children:', data.sidebarChildren);
        console.log('rail children:', data.railChildren);
        console.log('panel children:', data.panelChildren);
        console.log('sidebar rect:', data.sidebarRect);
        console.log('rail rect:', data.railRect);
        console.log('panel rect:', data.panelRect);
        console.log('search rect:', data.searchRect);
    }

    await browser.close();
})();
