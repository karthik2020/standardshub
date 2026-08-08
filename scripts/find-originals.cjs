const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const blobs = execSync('git fsck --unreachable --no-reflogs', { encoding: 'utf8' })
  .split('\n')
  .filter(line => line.startsWith('unreachable blob'))
  .map(line => line.split(' ')[2]);

const targetFiles = fs.readdirSync('src/pages/japangaap').filter(f => f.endsWith('.astro'));
const found = {};

for (const blob of blobs) {
  try {
    const content = execSync('git show ' + blob, { encoding: 'utf8' });
    for (const file of targetFiles) {
      if (content.includes(file) && !found[file]) {
        found[file] = blob;
        console.log('Found ' + file + ' in blob ' + blob);
      }
    }
  } catch (e) {
    // skip
  }
}

console.log('\nTotal found: ' + Object.keys(found).length + '/' + targetFiles.length);
console.log('\nMissing files:');
for (const file of targetFiles) {
  if (!found[file]) {
    console.log('  ' + file);
  }
}
