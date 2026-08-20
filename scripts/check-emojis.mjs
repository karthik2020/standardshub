import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('src/pages/hgb').filter(f => f.endsWith('.astro'));
const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{2300}-\u{23FF}]|[\u{2190}-\u{21FF}]|[\u{2000}-\u{206F}]|[\u{FE00}-\u{FE0F}]/gu;

let foundAny = false;
for (const f of files) {
  const c = fs.readFileSync(path.join('src/pages/hgb', f), 'utf8');
  const lines = c.split('\n');
  lines.forEach((l, i) => {
    const matches = l.match(emojiRegex);
    if (matches) {
      console.log(`${f}:${i + 1}: ${l.trim().slice(0, 100)}`);
      foundAny = true;
    }
  });
}
if (!foundAny) console.log('No emojis found');
