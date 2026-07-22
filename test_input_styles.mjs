import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });

    await page.goto('http://localhost:3000/indas/indas1');
    await page.waitForTimeout(500);
    await page.waitForSelector('.standards-panel');

    const tests = [
        { name: 'before focus', action: () => {} },
        { name: 'after focus', action: async () => {
            await page.$eval('#standard-search', el => el.focus());
            await page.waitForTimeout(100);
        }},
    ];

    for (const test of tests) {
        await test.action();

        const data = await page.evaluate(() => {
            const input = document.getElementById('standard-search');
            const wrapper = document.querySelector('.search-input-wrapper');
            const searchBox = document.querySelector('.search-box');
            const rail = document.querySelector('.framework-rail');
            const panel = document.querySelector('.standards-panel');
            const sidebar = document.querySelector('.standards-sidebar');
            const is = window.getComputedStyle(input);
            const ws = window.getComputedStyle(wrapper);
            const sbs = window.getComputedStyle(searchBox);
            const ss = window.getComputedStyle(sidebar);
            
            return {
                railX: rail.getBoundingClientRect().x,
                panelX: panel.getBoundingClientRect().x,
                inputOutline: is.outlineWidth,
                inputOutlineStyle: is.outlineStyle,
                inputOutlineColor: is.outlineColor,
                inputBoxShadow: is.boxShadow,
                inputBorder: is.borderWidth,
                wrapperOutline: ws.outlineWidth,
                wrapperBoxShadow: ws.boxShadow,
                searchBoxOutline: sbs.outlineWidth,
                searchBoxBoxShadow: sbs.boxShadow,
                sidebarPaddingLeft: ss.paddingLeft,
                sidebarPaddingRight: ss.paddingRight,
                sidebarBorderLeft: ss.borderLeftWidth,
                sidebarBorderRight: ss.borderRightWidth,
                inputWidth: input.offsetWidth,
                wrapperWidth: wrapper.offsetWidth,
                searchBoxWidth: searchBox.offsetWidth,
            };
        });

        console.log(`\n${test.name}:`);
        console.log('  railX:', data.railX, 'panelX:', data.panelX);
        console.log('  input outline:', data.inputOutline, data.inputOutlineStyle, data.inputOutlineColor);
        console.log('  input boxShadow:', data.inputBoxShadow);
        console.log('  input border:', data.inputBorder);
        console.log('  wrapper outline:', data.wrapperOutline);
        console.log('  wrapper boxShadow:', data.wrapperBoxShadow);
        console.log('  searchBox outline:', data.searchBoxOutline);
        console.log('  searchBox boxShadow:', data.searchBoxBoxShadow);
        console.log('  sidebar padding:', data.sidebarPaddingLeft, data.sidebarPaddingRight);
        console.log('  sidebar border:', data.sidebarBorderLeft, data.sidebarBorderRight);
        console.log('  widths:', data.inputWidth, data.wrapperWidth, data.searchBoxWidth);
    }

    await browser.close();
})();
