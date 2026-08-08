const fs = require("fs");
const path = require("path");

const hgbDir = "src/pages/hgb";
const files = fs.readdirSync(hgbDir).filter((f) => f.endsWith(".astro"));

let totalFixed = 0;

files.forEach((file) => {
  const filePath = path.join(hgbDir, file);
  let content = fs.readFileSync(filePath, "utf8");
  let fileModified = false;
  
  // Simple approach: find <div>...</div> patterns that:
  // 1. Are inside a .card block
  // 2. Don't have a class attribute
  // 3. Don't contain nested block elements
  // 4. Are not empty
  
  // We'll process line by line and track if we're inside a card
  const lines = content.split('\n');
  let inCard = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Track card nesting
    if (line.includes('class="card')) {
      inCard++;
    }
    if (inCard > 0 && line.match(/<\/div>\s*<\/div>/)) {
      inCard--;
    }
    
    if (inCard > 0) {
      // Look for plain <div>...</div>
      const match = line.match(/^(\s*)<div>(.*?)<\/div>\s*$/);
      if (match) {
        const indent = match[1];
        const inner = match[2].trim();
        
        // Skip if contains block elements
        if (
          inner.includes('<div') ||
          inner.includes('<table') ||
          inner.includes('<ul') ||
          inner.includes('<ol') ||
          inner.includes('<li') ||
          inner.includes('<span') ||
          inner.includes('<h')
        ) {
          continue;
        }
        
        // Skip empty
        if (!inner) continue;
        
        // This is a plain div with text
        lines[i] = `${indent}<div class="text-supporting">${inner}</div>`;
        fileModified = true;
        totalFixed++;
      }
    }
  }
  
  if (fileModified) {
    fs.writeFileSync(filePath, lines.join('\n'), "utf8");
    console.log(`Fixed: ${file}`);
  }
});

console.log(`\nTotal divs fixed: ${totalFixed}`);
