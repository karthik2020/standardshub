import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('src/pages/hgb').filter(f => f.endsWith('.astro'));

for (const f of files) {
  const c = fs.readFileSync(path.join('src/pages/hgb', f), 'utf8');
  if (c.includes('cols-05-18')) {
    const lines = c.split('\n');
    console.log(`\n${f}:`);
    lines.forEach((l, i) => {
      if (l.includes('cols-05-18')) {
        console.log(`  Line ${i + 1}: ${l.trim().slice(0, 120)}`);
      }
    });
  }
}
