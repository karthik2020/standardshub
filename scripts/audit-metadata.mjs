import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('src/data/standards/hgb').filter(f => f.endsWith('.json'));
const data = {};

for (const f of files) {
  const c = fs.readFileSync(path.join('src/data/standards/hgb', f), 'utf8');
  data[f] = JSON.parse(c);
}

console.log('=== HGB METADATA AUDIT ===\n');

// 1. Check all required fields
console.log('1. MISSING FIELDS:');
const requiredFields = ['code', 'title', 'nativeTitle', 'summary', 'covers', 'aliases', 'order', 'url', 'framework', 'category', 'slug', 'issued', 'latestAmendment', 'effective', 'history'];
for (const [f, d] of Object.entries(data)) {
  const missing = requiredFields.filter(field => !(field in d));
  if (missing.length > 0) {
    console.log(`  ${f}: Missing ${missing.join(', ')}`);
  }
}

// 2. Check code format
console.log('\n2. CODE FORMAT:');
const codePattern = /^HGB §§\d+–\d+[a-z]?$/;
for (const [f, d] of Object.entries(data)) {
  if (!codePattern.test(d.code)) {
    console.log(`  ${f}: "${d.code}" (unusual format)`);
  }
}

// 3. Check title format
console.log('\n3. TITLE FORMAT:');
const titles = Object.entries(data).map(([f, d]) => ({ file: f, title: d.title }));
titles.forEach(t => {
  if (t.title !== t.title.charAt(0).toUpperCase() + t.title.slice(1)) {
    console.log(`  ${t.file}: "${t.title}" (not title case)`);
  }
});

// 4. Check summary length
console.log('\n4. SUMMARY LENGTH:');
const summaries = Object.entries(data).map(([f, d]) => ({ file: f, len: d.summary?.length || 0 }));
const avgLen = summaries.reduce((sum, s) => sum + s.len, 0) / summaries.length;
console.log(`  Average length: ${avgLen.toFixed(0)} chars`);
summaries.forEach(s => {
  if (s.len > avgLen * 1.5) console.log(`  ${s.file}: ${s.len} chars (long)`);
  if (s.len < avgLen * 0.5) console.log(`  ${s.file}: ${s.len} chars (short)`);
});

// 5. Check aliases vs covers
console.log('\n5. ALIASES vs COVERS:');
for (const [f, d] of Object.entries(data)) {
  const covers = d.covers || [];
  const aliases = d.aliases || [];
  const missingAliases = covers.filter(c => !aliases.includes(c) && !aliases.includes('§' + c));
  if (missingAliases.length > 0) {
    console.log(`  ${f}: Covers ${covers.join(', ')} but missing aliases for ${missingAliases.join(', ')}`);
  }
}

// 6. Check ordering
console.log('\n6. ORDERING:');
const sorted = Object.entries(data).sort((a, b) => a[1].order - b[1].order);
sorted.forEach(([f, d], i) => {
  if (d.order !== i + 1) {
    console.log(`  ${f}: order=${d.order}, expected ${i + 1}`);
  }
});

// 7. Check URL format
console.log('\n7. URL FORMAT:');
for (const [f, d] of Object.entries(data)) {
  if (!d.url.startsWith('/hgb/')) {
    console.log(`  ${f}: "${d.url}" (unusual URL)`);
  }
}

// 8. Check framework field
console.log('\n8. FRAMEWORK FIELD:');
for (const [f, d] of Object.entries(data)) {
  if (d.framework !== 'HGB') {
    console.log(`  ${f}: "${d.framework}" (expected "HGB")`);
  }
}

// 9. Check category consistency
console.log('\n9. CATEGORY VALUES:');
const categories = new Set();
for (const d of Object.values(data)) {
  categories.add(d.category);
}
console.log(`  Categories used: ${[...categories].join(', ')}`);

// 10. Check nativeTitle format
console.log('\n10. NATIVETITLE FORMAT:');
for (const [f, d] of Object.entries(data)) {
  if (!d.nativeTitle.includes('•') && !d.nativeTitle.includes('–')) {
    console.log(`  ${f}: "${d.nativeTitle}" (missing separator)`);
  }
}

console.log('\n=== AUDIT COMPLETE ===');
