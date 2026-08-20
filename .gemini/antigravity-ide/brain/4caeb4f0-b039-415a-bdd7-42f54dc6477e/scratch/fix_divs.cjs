const fs = require('fs');
const path = require('path');

// Fix ASBE and ASPE files
function fixAsbeAspe(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace top wrap pattern
    content = content.replace(/<div class="wrap">\r?\n<\/div>/g, '<div class="wrap">');
    
    // Replace bottom wrap pattern
    content = content.replace(/<\/div>\r?\n\s*<\/div>\r?\n\s*<section id="history">/g, '</div>\n  <section id="history">');
    
    fs.writeFileSync(filePath, content, 'utf8');
}

// Fix HGB files
function fixHgb(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 1. Insert <div class="wrap"> after </Fragment>
    // We match </Fragment> followed by optional whitespace and newline
    content = content.replace(/(<\/Fragment>\r?\n\s*)/, '$1<div class="wrap">\n');
    
    // 2. Check if Section 1 needs <div class="grid">
    // If it has Section 1 header followed directly by <div class="card
    const sec1HeaderCardRegex = /(<div class="section-header" id="s1">[\s\S]*?<\/div>)(<div class="card)/;
    if (sec1HeaderCardRegex.test(content)) {
        content = content.replace(sec1HeaderCardRegex, '$1\n  <div class="grid">\n    $2');
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
}

function walkDir(dir, fixFunc) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            walkDir(fullPath, fixFunc);
        } else if (file.endsWith('.astro') && !file.includes('index.astro') && !file.includes('assbes.astro')) {
            fixFunc(fullPath);
        }
    }
}

console.log("Fixing ASBE...");
walkDir(path.resolve('src/pages/asbe'), fixAsbeAspe);

console.log("Fixing ASPE...");
walkDir(path.resolve('src/pages/aspe'), fixAsbeAspe);

console.log("Fixing HGB...");
walkDir(path.resolve('src/pages/hgb'), fixHgb);

console.log("Done fixing!");
