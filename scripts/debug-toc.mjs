import fs from 'fs';
const content = fs.readFileSync('src/pages/hgb/hgb238-241a.astro', 'utf8');
const tocMatch = content.match(/<PageToc\s+items=\{([\s\S]*?)\}\s*\/>/);
if (tocMatch) {
  const itemMatches = [...tocMatch[1].matchAll(/\{\s*id:\s*"([^"]+)"\s*,\s*label:\s*"([^"]+)"\s*\}/g)];
  console.log('Found ' + itemMatches.length + ' TOC items');
  itemMatches.forEach((m, i) => console.log(i + ': id=' + m[1] + ', label=' + m[2]));
} else {
  console.log('No TOC match found');
}
