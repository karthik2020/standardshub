import fs from 'fs';

const standards = JSON.parse(fs.readFileSync('src/data/standards.json', 'utf8'));
const hgb = standards.HGB;

console.log('=== DUPLICATE ALIAS CHECK ===\n');

const aliasToCodes = {};
for (const std of hgb) {
  for (const alias of std.aliases) {
    if (!aliasToCodes[alias]) {
      aliasToCodes[alias] = [];
    }
    aliasToCodes[alias].push(std.code);
  }
}

let duplicateCount = 0;
for (const [alias, codes] of Object.entries(aliasToCodes)) {
  if (codes.length > 1) {
    console.log(`  DUPLICATE ALIAS: "${alias}" -> ${codes.join(', ')}`);
    duplicateCount++;
  }
}

if (duplicateCount === 0) {
  console.log('  OK: No duplicate aliases across HGB standards.');
}

console.log(`\nTotal aliases: ${Object.keys(aliasToCodes).length}`);
console.log(`Total duplicates: ${duplicateCount}`);
