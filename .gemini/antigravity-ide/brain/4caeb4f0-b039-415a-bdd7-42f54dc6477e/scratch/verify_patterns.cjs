const fs = require('fs');
const path = require('path');

function checkFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    const hasTopPattern = content.includes('<div class="wrap">\r\n</div>') || content.includes('<div class="wrap">\n</div>');
    const hasBottomPattern = content.includes('</div>\r\n  </div>\r\n  <section id="history">') || content.includes('</div>\n  </div>\n  <section id="history">');
    
    console.log(`${path.basename(filePath)}: top? ${hasTopPattern}, bottom? ${hasBottomPattern}`);
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            walkDir(fullPath);
        } else if (file.endsWith('.astro') && !file.includes('index.astro') && !file.includes('assbes.astro')) {
            checkFile(fullPath);
        }
    }
}

console.log("Checking ASBE...");
walkDir(path.resolve('src/pages/asbe'));

console.log("\nChecking ASPE...");
walkDir(path.resolve('src/pages/aspe'));
