const fs = require("fs");
const path = require("path");

const pagesDir = "src/pages/japangaap";
const files = fs.readdirSync(pagesDir).filter((f) => f.endsWith(".astro"));

let totalFixed = 0;

files.forEach((file) => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, "utf8");
  let modified = false;

  const tableRegex = /<div class="td-table">([\s\S]*?)<\/div>\s*<\/div>/g;
  let tableMatch;

  while ((tableMatch = tableRegex.exec(content)) !== null) {
    const tableHtml = tableMatch[1];
    const thMatch = /<div class="th\s+(cols-[^\s"]+)/.exec(tableHtml);
    if (!thMatch) continue;

    const headerClass = thMatch[1];
    let tableFixed = false;

    const fixedTable = tableHtml.replace(
      /<div class="tr(?:\s+alt)?\s+(cols-[^\s"]+)/g,
      (match, rowClass) => {
        if (rowClass !== headerClass) {
          tableFixed = true;
          return match.replace(rowClass, headerClass);
        }
        return match;
      }
    );

    if (tableFixed) {
      content = content.replace(tableMatch[0], fixedTable);
      modified = true;
      totalFixed++;
      console.log(`Fixed table in ${file}: header=${headerClass}`);
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, "utf8");
  }
});

console.log(`\nTotal tables fixed: ${totalFixed}`);
