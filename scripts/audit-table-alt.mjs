import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('src/pages/hgb').filter(f => f.endsWith('.astro'));

let issues = [];

for (const f of files) {
  const c = fs.readFileSync(path.join('src/pages/hgb', f), 'utf8');
  const lines = c.split('\n');
  
  let inTable = false;
  let tableStart = 0;
  let rowCount = 0;
  let hasAlt = false;
  
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    
    if (l.includes('class="td-table"')) {
      inTable = true;
      tableStart = i + 1;
      rowCount = 0;
      hasAlt = false;
    }
    
    if (inTable) {
      if (l.includes('class="tr ') || l.includes('class="tr alt')) {
        rowCount++;
        if (l.includes('class="tr alt')) hasAlt = true;
      }
      if (l.includes('</div>') && inTable && i > tableStart + 5) {
        // Check if table has alternating rows when it has data rows
        if (rowCount > 1 && !hasAlt) {
          issues.push(`${f}:${tableStart}: Table with ${rowCount} rows has no alt rows`);
        }
        inTable = false;
      }
    }
  }
}

if (issues.length) {
  console.log('Tables without alternating rows:');
  issues.forEach(x => console.log(x));
} else {
  console.log('All multi-row tables have alternating rows');
}
