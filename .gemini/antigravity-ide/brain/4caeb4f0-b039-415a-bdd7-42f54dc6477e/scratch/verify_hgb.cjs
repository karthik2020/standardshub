const fs = require('fs');
const path = require('path');

function checkFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Find Section 1 header and card transition
    const sec1CardMatch = /<\/h2><span class="line"><\/span><\/div><div class class="card/i.test(content) || 
                         /<\/h2><span class="line"><\/span><\/div><div class="card/i.test(content);
                         
    // Find bottom div close pattern
    const bottomCloseMatch = /<\/div>\r?\n<\/StandardPageLayout>/i.test(content);
    
    console.log(`${path.basename(filePath)}: sec1Card? ${sec1CardMatch}, bottomClose? ${bottomCloseMatch}`);
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            walkDir(fullPath);
        } else if (file.endsWith('.astro') && !file.includes('index.astro')) {
            checkFile(fullPath);
        }
    }
}

console.log("Checking HGB...");
walkDir(path.resolve('src/pages/hgb'));
