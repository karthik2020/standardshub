import fs from 'fs';
import path from 'path';

const files = [
  'hgb336-339.astro',
  'hgb340-340o.astro',
  'hgb341-341p.astro',
  'hgb341q-341y.astro',
  'hgb342-342p.astro',
  'hgb342q-342r.astro'
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
