import fs from 'fs';
import path from 'path';

const files = [
  'hgb332.astro',
  'hgb333.astro',
  'hgb333a.astro',
  'hgb334.astro',
  'hgb335.astro',
  'hgb335a.astro',
  'hgb335b.astro',
  'hgb335c.astro'
];

for (const file of files) {
  const filePath = path.join('src', 'pages', 'hgb', file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove hub-sub divs
  content = content.replace(/<div class="hub-sub">[\s\S]*?<\/div>\s*/g, '');
  
  // Remove any empty lines left behind at the start of wrap
  content = content.replace(/(<div class="wrap">)\n+/, '$1\n');
  
  fs.writeFileSync(filePath, content);
  console.log(`Fixed ${filePath}`);
}

console.log('Done');
