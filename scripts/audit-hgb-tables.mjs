import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('src/pages/hgb').filter(f => f.endsWith('.astro'));
const classSet = new Set();
const classCount = {};

for (const f of files) {
  const c = fs.readFileSync(path.join('src/pages/hgb', f), 'utf8');
  const matches = c.matchAll(/cols-[a-zA-Z0-9_-]+/g);
  for (const m of matches) {
    const cls = m[0];
    classSet.add(cls);
    classCount[cls] = (classCount[cls] || 0) + 1;
  }
}

console.log('All unique cols-* classes in HGB pages:');
for (const cls of [...classSet].sort()) {
  console.log(`  ${cls}: ${classCount[cls]} occurrences`);
}

console.log('\nTotal unique classes:', classSet.size);
