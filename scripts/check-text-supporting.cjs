const fs = require("fs");
const path = require("path");

const hgbDir = "src/pages/hgb";
const files = fs.readdirSync(hgbDir).filter((f) => f.endsWith(".astro"));
let issues = 0;

for (const file of files) {
  const content = fs.readFileSync(path.join(hgbDir, file), "utf8");
  const regex = /<div class="text-supporting">([\s\S]*?)<\/div>/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const inner = match[1];
    if (
      inner.includes("<div") ||
      inner.includes("<table") ||
      inner.includes("<ul") ||
      inner.includes("<ol") ||
      inner.includes("<li") ||
      inner.includes("<span")
    ) {
      console.log("ISSUE in " + file + ": nested block element found");
      console.log("  Content: " + inner.substring(0, 100));
      issues++;
    }
  }
}

console.log("Total issues: " + issues);
