import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });

    await page.goto('http://localhost:3000/indas/indas1');

    // Wait for everything to stabilize
    await page.waitForTimeout(1000);
    await page.waitForSelector('.standards-panel');

    // Measure initial state (before ANY interaction)
    const initial = await page.evaluate(() => {
        const sidebarSearch = document.querySelector('.sidebar-search');
        const searchBox = document.querySelector('.search-box');
        const searchWrapper = document.querySelector('.search-input-wrapper');
        const standardsPanel = document.querySelector('.standards-panel');
        const frameworkRail = document.querySelector('.framework-rail');
        const standardsSidebar = document.querySelector('.standards-sidebar');
        const appBody = document.querySelector('.app-body');
        
        return {
            searchStyles: window.getComputedStyle(sidebarSearch),
            searchBoxStyles: window.getComputedStyle(searchBox),
            wrapperStyles: window.getComputedStyle(searchWrapper),
            panelClasses: standardsPanel.className,
            railWidth: frameworkRail.offsetWidth,
            panelRect: standardsPanel.getBoundingClientRect(),
            scrollRect: document.querySelector('.sidebar-scroll').getBoundingClientRect(),
            searchRect: searchWrapper.getBoundingClientRect(),
            sidebarSearchRect: sidebarSearch.getBoundingClientRect(),
            searchBoxRect: searchBox.getBoundingClientRect(),
            appBodyRect: appBody.getBoundingClientRect(),
            sidebarRect: standardsSidebar.getBoundingClientRect(),
            sidebarStyles: window.getComputedStyle(standardsSidebar),
            railStyles: window.getComputedStyle(frameworkRail),
        };
    });

    console.log('=== INITIAL STATE ===');
    console.log('panelClasses:', initial.panelClasses);
    console.log('hasValue:', initial.hasValue);
    console.log('focused:', initial.focused);
    console.log('railWidth:', initial.railWidth);
    console.log('panelRect:', initial.panelRect);
    console.log('scrollRect:', initial.scrollRect);
    console.log('searchRect:', initial.searchRect);
    console.log('sidebarSearchRect:', initial.sidebarSearchRect);
    console.log('searchBoxRect:', initial.searchBoxRect);
    console.log('appBodyRect:', initial.appBodyRect);
    console.log('sidebar-search padding:', initial.searchStyles.paddingLeft, initial.searchStyles.paddingTop);
    console.log('search-box padding:', initial.searchBoxStyles.paddingLeft, initial.searchBoxStyles.paddingTop);
    console.log('wrapper padding:', initial.wrapperStyles.paddingLeft, initial.wrapperStyles.paddingTop);
    console.log('sidebar-search margin:', initial.searchStyles.marginLeft, initial.searchStyles.marginTop);
    console.log('search-box margin:', initial.searchBoxStyles.marginLeft, initial.searchBoxStyles.marginTop);

    // Type into search
    const searchInput = await page.$('#standard-search');
    await searchInput.fill('Ind AS 16');
    await page.waitForTimeout(100);

    const afterSearch = await page.evaluate(() => {
        const sidebarSearch = document.querySelector('.sidebar-search');
        const searchBox = document.querySelector('.search-box');
        const searchWrapper = document.querySelector('.search-input-wrapper');
        const standardsPanel = document.querySelector('.standards-panel');
        return {
            panelClasses: standardsPanel.className,
            panelRect: standardsPanel.getBoundingClientRect(),
            scrollRect: document.querySelector('.sidebar-scroll').getBoundingClientRect(),
            searchRect: searchWrapper.getBoundingClientRect(),
            sidebarSearchRect: sidebarSearch.getBoundingClientRect(),
            searchBoxRect: searchBox.getBoundingClientRect(),
            searchStyles: window.getComputedStyle(sidebarSearch),
            searchBoxStyles: window.getComputedStyle(searchBox),
            wrapperStyles: window.getComputedStyle(searchWrapper),
        };
    });

    console.log('\n=== AFTER SEARCH ===');
    console.log('panelClasses:', afterSearch.panelClasses);
    console.log('panelRect:', afterSearch.panelRect);
    console.log('scrollRect:', afterSearch.scrollRect);
    console.log('searchRect:', afterSearch.searchRect);
    console.log('sidebarSearchRect:', afterSearch.sidebarSearchRect);
    console.log('searchBoxRect:', afterSearch.searchBoxRect);
    console.log('sidebar-search padding:', afterSearch.searchStyles.paddingLeft, afterSearch.searchStyles.paddingTop);
    console.log('search-box padding:', afterSearch.searchBoxStyles.paddingLeft, afterSearch.searchBoxStyles.paddingTop);
    console.log('wrapper padding:', afterSearch.wrapperStyles.paddingLeft, afterSearch.wrapperStyles.paddingTop);

    // Click clear button
    const clearButton = await page.$('#search-action');
    await clearButton.click();
    await page.waitForTimeout(500);

    const afterClear = await page.evaluate(() => {
        const sidebarSearch = document.querySelector('.sidebar-search');
        const searchBox = document.querySelector('.search-box');
        const searchWrapper = document.querySelector('.search-input-wrapper');
        const standardsPanel = document.querySelector('.standards-panel');
        const appBody = document.querySelector('.app-body');
        const frameworkRail = document.querySelector('.framework-rail');
        const standardsSidebar = document.querySelector('.standards-sidebar');
        return {
            panelClasses: standardsPanel.className,
            panelRect: standardsPanel.getBoundingClientRect(),
            scrollRect: document.querySelector('.sidebar-scroll').getBoundingClientRect(),
            searchRect: searchWrapper.getBoundingClientRect(),
            sidebarSearchRect: sidebarSearch.getBoundingClientRect(),
            searchBoxRect: searchBox.getBoundingClientRect(),
            appBodyRect: appBody.getBoundingClientRect(),
            railRect: frameworkRail.getBoundingClientRect(),
            sidebarRect: standardsSidebar.getBoundingClientRect(),
            sidebarStyles: window.getComputedStyle(standardsSidebar),
            railStyles: window.getComputedStyle(frameworkRail),
            searchStyles: window.getComputedStyle(sidebarSearch),
            searchBoxStyles: window.getComputedStyle(searchBox),
            wrapperStyles: window.getComputedStyle(searchWrapper),
        };
    });

    console.log('\n=== AFTER CLEAR ===');
    console.log('panelClasses:', afterClear.panelClasses);
    console.log('panelRect:', afterClear.panelRect);
    console.log('scrollRect:', afterClear.scrollRect);
    console.log('searchRect:', afterClear.searchRect);
    console.log('sidebarSearchRect:', afterClear.sidebarSearchRect);
    console.log('searchBoxRect:', afterClear.searchBoxRect);
    console.log('railRect:', afterClear.railRect);
    console.log('sidebarRect:', afterClear.sidebarRect);
    console.log('appBodyRect:', afterClear.appBodyRect);
    console.log('sidebar-search padding:', afterClear.searchStyles.paddingLeft, afterClear.searchStyles.paddingTop);
    console.log('search-box padding:', afterClear.searchBoxStyles.paddingLeft, afterClear.searchBoxStyles.paddingTop);
    console.log('wrapper padding:', afterClear.wrapperStyles.paddingLeft, afterClear.wrapperStyles.paddingTop);
    console.log('rail marginLeft:', afterClear.railStyles.marginLeft);
    console.log('rail paddingLeft:', afterClear.railStyles.paddingLeft);
    console.log('rail borderLeftWidth:', afterClear.railStyles.borderLeftWidth);
    console.log('rail position:', afterClear.railStyles.position);
    console.log('rail left:', afterClear.railStyles.left);
    console.log('sidebar paddingLeft:', afterClear.sidebarStyles.paddingLeft);
    console.log('sidebar borderLeftWidth:', afterClear.sidebarStyles.borderLeftWidth);
    console.log('sidebar gap:', afterClear.sidebarStyles.gap);

    await browser.close();
})();
