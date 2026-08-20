import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('src/pages/hgb').filter(f => f.endsWith('.astro'));

// Check for grid-* classes and inline grid styles
let gridClasses = [];
let inlineGridStyles = [];

for (const f of files) {
  const c = fs.readFileSync(path.join('src/pages/hgb', f), 'utf8');
  const lines = c.split('\n');
  
  lines.forEach((l, i) => {
    if (l.match(/grid-[a-zA-Z-]+/)) {
      gridClasses.push(`${f}:${i + 1}: ${l.trim().slice(0, 100)}`);
    }
    if (l.match(/style=.*grid/)) {
      inlineGridStyles.push(`${f}:${i + 1}: ${l.trim().slice(0, 100)}`);
    }
  });
}

if (gridClasses.length) {
  console.log('Grid classes found:');
  gridClasses.forEach(x => console.log(x));
} else {
  console.log('No grid-* classes found');
}

if (inlineGridStyles.length) {
  console.log('\nInline grid styles found:');
  inlineGridStyles.forEach(x => console.log(x));
} else {
  console.log('No inline grid styles found');
}

// Check for any table elements (actual <table> tags)
let tableTags = [];
for (const f of files) {
  const c = fs.readFileSync(path.join('src/pages/hgb', f), 'utf8');
  if (c.includes('<table')) {
    tableTags.push(f);
  }
}

if (tableTags.length) {
  console.log('\nFiles with <table> tags:', tableTags);
} else {
  console.log('\nNo <table> tags found (using div-based grid tables)');
}
