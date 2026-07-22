import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });

    await page.goto('http://localhost:3000/indas/indas1');
    await page.waitForTimeout(500);
    await page.waitForSelector('.standards-panel');

    const states = ['INITIAL', 'AFTER_SEARCH', 'AFTER_CLEAR'];
    const props = [
        'position', 'marginLeft', 'marginRight', 'paddingLeft', 'paddingRight',
        'borderLeftWidth', 'borderRightWidth', 'left', 'right', 'transform',
        'width', 'flexBasis', 'flexGrow', 'flexShrink', 'order',
        'display', 'float', 'clear', 'visibility',
    ];

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

        const data = await page.evaluate((props) => {
            const rail = document.querySelector('.framework-rail');
            const sidebar = document.querySelector('.standards-sidebar');
            const s = window.getComputedStyle(rail);
            const ss = window.getComputedStyle(sidebar);
            const result = {};
            props.forEach(p => {
                result[p] = s[p];
            });
            result.sidebarWidth = ss.width;
            result.sidebarPaddingLeft = ss.paddingLeft;
            result.sidebarPaddingRight = ss.paddingRight;
            result.sidebarBorderLeft = ss.borderLeftWidth;
            result.sidebarBorderRight = ss.borderRightWidth;
            result.sidebarGap = ss.gap;
            result.sidebarJustifyContent = ss.justifyContent;
            result.sidebarFlexDirection = ss.flexDirection;
            return result;
        }, props);

        console.log(`\n=== ${state} ===`);
        props.forEach(p => console.log(`${p}: ${data[p]}`));
        console.log('sidebarWidth:', data.sidebarWidth);
        console.log('sidebarPaddingLeft:', data.sidebarPaddingLeft);
        console.log('sidebarPaddingRight:', data.sidebarPaddingRight);
        console.log('sidebarBorderLeft:', data.sidebarBorderLeft);
        console.log('sidebarBorderRight:', data.sidebarBorderRight);
        console.log('sidebarGap:', data.sidebarGap);
        console.log('sidebarJustifyContent:', data.sidebarJustifyContent);
        console.log('sidebarFlexDirection:', data.sidebarFlexDirection);
    }

    await browser.close();
})();
