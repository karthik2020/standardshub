const fs = require("fs");
const path = require("path");

const pagesDir = "src/pages/japangaap";
const files = fs.readdirSync(pagesDir).filter((f) => f.endsWith(".astro"));

const issues = [];

files.forEach((file) => {
  const content = fs.readFileSync(path.join(pagesDir, file), "utf8");
  const tableRegex = /<div class="td-table">([\s\S]*?)<\/div>\s*<\/div>/g;
  let tableMatch;

  while ((tableMatch = tableRegex.exec(content)) !== null) {
    const tableHtml = tableMatch[1];
    const thMatch = /<div class="th\s+(cols-[^\s"]+)/.exec(tableHtml);
    if (!thMatch) continue;

    const headerClass = thMatch[1];
    const rowRegex = /<div class="tr(?:\s+alt)?\s+(cols-[^\s"]+)/g;
    let rowMatch;
    const rowClasses = new Set();

    while ((rowMatch = rowRegex.exec(tableHtml)) !== null) {
      rowClasses.add(rowMatch[1]);
    }

    if (rowClasses.size > 1 || [...rowClasses][0] !== headerClass) {
      issues.push({
        file,
        headerClass,
        rowClasses: [...rowClasses],
        tableSnippet: tableHtml.substring(0, 300),
      });
    }
  }
});

if (issues.length === 0) {
  console.log("No mismatched tables found.");
} else {
  console.log(`Found ${issues.length} tables with mismatched cols-* classes:\n`);
  issues.forEach((issue, i) => {
    console.log(`--- Issue ${i + 1}: ${issue.file} ---`);
    console.log(`Header: ${issue.headerClass}`);
    console.log(`Rows: ${issue.rowClasses.join(", ")}`);
    console.log(`Snippet: ${issue.tableSnippet.substring(0, 200)}...\n`);
  });
}
