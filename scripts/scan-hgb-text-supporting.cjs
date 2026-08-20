const fs = require("fs");
const path = require("path");

const hgbDir = "src/pages/hgb";
const files = fs.readdirSync(hgbDir).filter((f) => f.endsWith(".astro"));

let totalCandidates = 0;
const results = [];

files.forEach((file) => {
  const content = fs.readFileSync(path.join(hgbDir, file), "utf8");
  
  // Find card blocks
  const cardRegex = /<div class="card[^"]*">([\s\S]*?)<\/div>\s*<\/div>/g;
  let cardMatch;
  
  while ((cardMatch = cardRegex.exec(content)) !== null) {
    const cardContent = cardMatch[1];
    
    // Find plain divs inside cards (no class attribute, or empty class)
    const plainDivRegex = /<div>(.*?)<\/div>/gs;
    let plainDivMatch;
    
    while ((plainDivMatch = plainDivRegex.exec(cardContent)) !== null) {
      const divContent = plainDivMatch[1].trim();
      
      // Skip if it contains block-level elements that should not be wrapped
      if (
        divContent.startsWith("<") &&
        (divContent.includes("<div") ||
         divContent.includes("<table") ||
         divContent.includes("<h") ||
         divContent.includes("<ul") ||
         divContent.includes("<ol") ||
         divContent.includes("<li"))
      ) {
        continue;
      }
      
      // Skip empty or whitespace-only
      if (!divContent) continue;
      
      totalCandidates++;
      results.push({
        file,
        snippet: divContent.substring(0, 100) + (divContent.length > 100 ? "..." : ""),
      });
    }
  }
});

console.log(`Found ${totalCandidates} candidate plain divs across ${files.length} HGB files:\n`);
results.slice(0, 50).forEach((r, i) => {
  console.log(`${i + 1}. ${r.file}: ${r.snippet}`);
});

if (results.length > 50) {
  console.log(`\n... and ${results.length - 50} more`);
}
