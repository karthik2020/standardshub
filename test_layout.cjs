const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const htmlPath = path.join(__dirname, 'dist', 'indas', 'indas1', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
const window = dom.window;
const document = window.document;

// Wait for scripts to run
setTimeout(() => {
    const searchInput = document.getElementById('standard-search');
    const clearButton = document.getElementById('search-action');
    const sidebarScroll = document.querySelector('.sidebar-scroll');
    const standardsPanel = document.querySelector('.standards-panel');
    const frameworkRail = document.querySelector('.framework-rail');

    console.log('=== INITIAL STATE ===');
    console.log('standards-panel classes:', standardsPanel.className);
    console.log('sidebar-scroll offsetLeft:', sidebarScroll.offsetLeft);
    console.log('sidebar-scroll offsetWidth:', sidebarScroll.offsetWidth);
    console.log('sidebar-scroll clientWidth:', sidebarScroll.clientWidth);
    console.log('standards-panel offsetLeft:', standardsPanel.offsetLeft);
    console.log('standards-panel offsetWidth:', standardsPanel.offsetWidth);
    console.log('framework-rail offsetWidth:', frameworkRail.offsetWidth);

    // Simulate typing "IAS 16"
    searchInput.value = 'IAS 16';
    searchInput.dispatchEvent(new window.Event('input', { bubbles: true }));

    console.log('\n=== AFTER TYPING "IAS 16" ===');
    console.log('standards-panel classes:', standardsPanel.className);
    console.log('sidebar-scroll offsetLeft:', sidebarScroll.offsetLeft);
    console.log('sidebar-scroll offsetWidth:', sidebarScroll.offsetWidth);
    console.log('sidebar-scroll clientWidth:', sidebarScroll.clientWidth);
    console.log('standards-panel offsetLeft:', standardsPanel.offsetLeft);
    console.log('standards-panel offsetWidth:', standardsPanel.offsetWidth);

    // Simulate clear button click
    clearButton.click();

    console.log('\n=== AFTER CLEAR ===');
    console.log('standards-panel classes:', standardsPanel.className);
    console.log('sidebar-scroll offsetLeft:', sidebarScroll.offsetLeft);
    console.log('sidebar-scroll offsetWidth:', sidebarScroll.offsetWidth);
    console.log('sidebar-scroll clientWidth:', sidebarScroll.clientWidth);
    console.log('standards-panel offsetLeft:', standardsPanel.offsetLeft);
    console.log('standards-panel offsetWidth:', standardsPanel.offsetWidth);

    const shift = sidebarScroll.offsetLeft - 196; // approximate expected
    console.log('\n=== Shift detected:', shift, '===');

    // Let's also inspect computed styles
    const scrollStyles = window.getComputedStyle(sidebarScroll);
    const panelStyles = window.getComputedStyle(standardsPanel);
    console.log('\nsidebar-scroll marginLeft:', scrollStyles.marginLeft);
    console.log('sidebar-scroll paddingLeft:', scrollStyles.paddingLeft);
    console.log('sidebar-scroll borderLeftWidth:', scrollStyles.borderLeftWidth);
    console.log('standards-panel marginLeft:', panelStyles.marginLeft);
    console.log('standards-panel paddingLeft:', panelStyles.paddingLeft);

    // Check all fw-panel display values
    document.querySelectorAll('.fw-panel').forEach((panel, i) => {
        console.log(`fw-panel[${i}] display:`, window.getComputedStyle(panel).display);
    });

    // Check all section display values
    document.querySelectorAll('.section').forEach((section, i) => {
        const display = section.style.display || window.getComputedStyle(section).display;
        console.log(`section[${i}] display:`, display);
    });

}, 100);
