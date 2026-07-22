import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });

    await page.goto('http://localhost:3000/indas/indas1');
    await page.waitForTimeout(500);
    await page.waitForSelector('.standards-panel');

    const before = await page.evaluate(() => {
        const input = document.getElementById('standard-search');
        const wrapper = document.querySelector('.search-input-wrapper');
        const is = window.getComputedStyle(input);
        const ws = window.getComputedStyle(wrapper);
        return {
            inputWidth: input.offsetWidth,
            inputHeight: input.offsetHeight,
            wrapperWidth: wrapper.offsetWidth,
            wrapperHeight: wrapper.offsetHeight,
            inputBorderTop: is.borderTopWidth,
            inputBorderBottom: is.borderBottomWidth,
            inputBorderLeft: is.borderLeftWidth,
            inputBorderRight: is.borderRightWidth,
            inputPaddingTop: is.paddingTop,
            inputPaddingBottom: is.paddingBottom,
            inputPaddingLeft: is.paddingLeft,
            inputPaddingRight: is.paddingRight,
            inputMarginTop: is.marginTop,
            inputMarginBottom: is.marginBottom,
            inputMarginLeft: is.marginLeft,
            inputMarginRight: is.marginRight,
            inputDisplay: is.display,
            inputPosition: is.position,
            inputTransform: is.transform,
            inputBoxSizing: is.boxSizing,
            wrapperBorderTop: ws.borderTopWidth,
            wrapperBorderBottom: ws.borderBottomWidth,
            wrapperPaddingTop: ws.paddingTop,
            wrapperPaddingBottom: ws.paddingBottom,
            wrapperPaddingLeft: ws.paddingLeft,
            wrapperPaddingRight: ws.paddingRight,
            wrapperBoxSizing: ws.boxSizing,
        };
    });

    console.log('Before focus:');
    console.log('  input:', before.inputWidth, 'x', before.inputHeight);
    console.log('  wrapper:', before.wrapperWidth, 'x', before.wrapperHeight);
    console.log('  input border:', before.inputBorderTop, before.inputBorderBottom, before.inputBorderLeft, before.inputBorderRight);
    console.log('  input padding:', before.inputPaddingTop, before.inputPaddingBottom, before.inputPaddingLeft, before.inputPaddingRight);
    console.log('  input margin:', before.inputMarginTop, before.inputMarginBottom, before.inputMarginLeft, before.inputMarginRight);
    console.log('  input display/position:', before.inputDisplay, before.inputPosition);
    console.log('  input transform:', before.inputTransform);
    console.log('  input boxSizing:', before.inputBoxSizing);

    await page.$eval('#standard-search', el => el.focus());
    await page.waitForTimeout(100);

    const after = await page.evaluate(() => {
        const input = document.getElementById('standard-search');
        const wrapper = document.querySelector('.search-input-wrapper');
        const is = window.getComputedStyle(input);
        const ws = window.getComputedStyle(wrapper);
        return {
            inputWidth: input.offsetWidth,
            inputHeight: input.offsetHeight,
            wrapperWidth: wrapper.offsetWidth,
            wrapperHeight: wrapper.offsetHeight,
            inputBorderTop: is.borderTopWidth,
            inputBorderBottom: is.borderBottomWidth,
            inputBorderLeft: is.borderLeftWidth,
            inputBorderRight: is.borderRightWidth,
            inputPaddingTop: is.paddingTop,
            inputPaddingBottom: is.paddingBottom,
            inputPaddingLeft: is.paddingLeft,
            inputPaddingRight: is.paddingRight,
            inputMarginTop: is.marginTop,
            inputMarginBottom: is.marginBottom,
            inputMarginLeft: is.marginLeft,
            inputMarginRight: is.marginRight,
            inputDisplay: is.display,
            inputPosition: is.position,
            inputTransform: is.transform,
            inputBoxSizing: is.boxSizing,
            wrapperBorderTop: ws.borderTopWidth,
            wrapperBorderBottom: ws.borderBottomWidth,
            wrapperPaddingTop: ws.paddingTop,
            wrapperPaddingBottom: ws.paddingBottom,
            wrapperPaddingLeft: ws.paddingLeft,
            wrapperPaddingRight: ws.paddingRight,
            wrapperBoxSizing: ws.boxSizing,
        };
    });

    console.log('After focus:');
    console.log('  input:', after.inputWidth, 'x', after.inputHeight);
    console.log('  wrapper:', after.wrapperWidth, 'x', after.wrapperHeight);
    console.log('  input border:', after.inputBorderTop, after.inputBorderBottom, after.inputBorderLeft, after.inputBorderRight);
    console.log('  input padding:', after.inputPaddingTop, after.inputPaddingBottom, after.inputPaddingLeft, after.inputPaddingRight);
    console.log('  input margin:', after.inputMarginTop, after.inputMarginBottom, after.inputMarginLeft, after.inputMarginRight);
    console.log('  input display/position:', after.inputDisplay, after.inputPosition);
    console.log('  input transform:', after.inputTransform);
    console.log('  input boxSizing:', after.inputBoxSizing);

    await browser.close();
})();
