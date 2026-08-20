import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('src/pages/hgb').filter(f => f.endsWith('.astro'));

const cols05_18 = [];
const cols06_17 = [];
const cols16_12 = [];

for (const f of files) {
  const c = fs.readFileSync(path.join('src/pages/hgb', f), 'utf8');
  if (c.includes('cols-05-18')) cols05_18.push(f);
  if (c.includes('cols-06-17')) cols06_17.push(f);
  if (c.includes('cols-16-12')) cols16_12.push(f);
}

console.log('cols-05-18 pages:', cols05_18);
console.log('\ncols-06-17 pages:', cols06_17);
console.log('\ncols-16-12 pages:', cols16_12);
