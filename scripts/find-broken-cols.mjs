const fs = require("fs");
const path = require("path");

// Get all existing cols-* classes from extended.css
const css = fs.readFileSync("src/styles/extended.css", "utf8");
const existingClasses = new Set();
const regex = /\.(cols-[^\s]+)\s*\{/g;
let match;
while ((match = regex.exec(css)) !== null) {
  existingClasses.add(match[1]);
}

// Scan all astro pages for cols-* usage
const glob = require("glob");
const files = glob.sync("src/pages/**/*.astro");
const broken = {};

files.forEach((file) => {
  const content = fs.readFileSync(file, "utf8");
  const classRegex = /class="[^"]*?\b(cols-[^\s"]+)[^"]*"/g;
  let m;
  while ((m = classRegex.exec(content)) !== null) {
    const classes = m[1].split(" ");
    classes.forEach((cls) => {
      if (cls.startsWith("cols-") && !existingClasses.has(cls)) {
        if (!broken[file]) broken[file] = new Set();
        broken[file].add(cls);
      }
    });
  }
});

// Print results
Object.keys(broken).forEach((file) => {
  console.log(file + ": " + Array.from(broken[file]).join(", "));
});
