const fs = require('fs');
const c = fs.readFileSync('src/pages/japangaap/asbj01.astro', 'utf8');
const matches = [...c.matchAll(/<div class="tr(?: [^>]*)?">/g)];
console.log('tr elements in asbj01:', matches.length);
matches.forEach((m, i) => {
  const hasGrid = m[0].includes('grid-');
  console.log(`${i}: ${m[0]} ${hasGrid ? '' : '(NO GRID CLASS)'}`);
});
