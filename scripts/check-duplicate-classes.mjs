import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('src/pages/hgb').filter(f => f.endsWith('.astro'));
for (const f of files) {
  const c = fs.readFileSync(path.join('src/pages/hgb', f), 'utf8');
  const lines = c.split('\n');
  lines.forEach((l, i) => {
    if (l.match(/class="[^"]*" class="[^"]*"/)) {
      console.log(f + ':' + (i + 1) + ': ' + l.trim());
    }
  });
}
