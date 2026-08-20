import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('src/pages/hgb').filter(f => f.endsWith('.astro'));

let issues = [];

for (const f of files) {
  const c = fs.readFileSync(path.join('src/pages/hgb', f), 'utf8');
  const lines = c.split('\n');
  
  let inTable = false;
  let tableStart = 0;
  let thCols = 0;
  let trCols = 0;
  let hasTh = false;
  
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    
    if (l.includes('class="td-table"')) {
      inTable = true;
      tableStart = i + 1;
      thCols = 0;
      trCols = 0;
      hasTh = false;
    }
    
    if (inTable) {
      if (l.includes('class="th ')) {
        hasTh = true;
        const spanMatch = l.match(/<span>/g);
        thCols = spanMatch ? spanMatch.length : 0;
      }
      if (l.includes('class="tr ') || l.includes('class="tr alt')) {
        const spanMatch = l.match(/<span>/g);
        trCols = spanMatch ? spanMatch.length : 0;
        if (thCols > 0 && trCols !== thCols) {
          issues.push(`${f}:${i + 1}: Column mismatch - th has ${thCols} columns, tr has ${trCols}`);
        }
      }
      if (l.includes('</div>') && inTable) {
        // Check if this is closing the td-table
        // Simple heuristic: if next line is blank or new section
        if (!hasTh && i > tableStart) {
          issues.push(`${f}:${tableStart}: Table missing header row`);
        }
        inTable = false;
      }
    }
  }
}

if (issues.length) {
  console.log('Table issues found:');
  issues.forEach(x => console.log(x));
} else {
  console.log('No table structural issues found');
}
