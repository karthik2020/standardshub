import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('src/pages/hgb').filter(f => f.endsWith('.astro'));

let foundAny = false;
for (const f of files) {
  const c = fs.readFileSync(path.join('src/pages/hgb', f), 'utf8');
  const lines = c.split('\n');
  lines.forEach((l, i) => {
    if (l.match(/style="[^"]*"/)) {
      console.log(`${f}:${i + 1}: ${l.trim().slice(0, 120)}`);
      foundAny = true;
    }
  });
}
if (!foundAny) console.log('No inline styles found');
