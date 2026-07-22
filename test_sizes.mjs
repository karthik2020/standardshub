import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });

    await page.goto('http://localhost:3000/indas/indas1');
    await page.waitForTimeout(500);
    await page.waitForSelector('.standards-panel');

    const data = await page.evaluate(() => {
        const input = document.getElementById('standard-search');
        const wrapper = document.querySelector('.search-input-wrapper');
        const searchBox = document.querySelector('.search-box');
        const is = window.getComputedStyle(input);
        const ws = window.getComputedStyle(wrapper);
        const sbs = window.getComputedStyle(searchBox);
        
        return {
            inputWidth: input.offsetWidth,
            inputHeight: input.offsetHeight,
            inputMinWidth: is.minWidth,
            inputMaxWidth: is.maxWidth,
            inputFlexBasis: is.flexBasis,
            inputFlexGrow: is.flexGrow,
            inputFlexShrink: is.flexShrink,
            wrapperWidth: wrapper.offsetWidth,
            wrapperHeight: wrapper.offsetHeight,
            wrapperMinWidth: ws.minWidth,
            wrapperMaxWidth: ws.maxWidth,
            wrapperDisplay: ws.display,
            searchBoxWidth: searchBox.offsetWidth,
            searchBoxHeight: searchBox.offsetHeight,
            searchBoxPaddingLeft: sbs.paddingLeft,
            searchBoxPaddingRight: sbs.paddingRight,
        };
    });

    console.log('Input:', data.inputWidth, 'x', data.inputHeight);
    console.log('Input min/max width:', data.inputMinWidth, data.inputMaxWidth);
    console.log('Input flex:', data.inputFlexBasis, data.inputFlexGrow, data.inputFlexShrink);
    console.log('Wrapper:', data.wrapperWidth, 'x', data.wrapperHeight);
    console.log('Wrapper min/max width:', data.wrapperMinWidth, data.wrapperMaxWidth);
    console.log('Wrapper display:', data.wrapperDisplay);
    console.log('SearchBox:', data.searchBoxWidth, 'x', data.searchBoxHeight);
    console.log('SearchBox padding:', data.searchBoxPaddingLeft, data.searchBoxPaddingRight);

    await browser.close();
})();
