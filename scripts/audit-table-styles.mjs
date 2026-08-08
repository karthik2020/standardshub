import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('src/pages/hgb').filter(f => f.endsWith('.astro'));

let issues = [];

for (const f of files) {
  const c = fs.readFileSync(path.join('src/pages/hgb', f), 'utf8');
  const lines = c.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    
    // Check for inline styles on table rows
    if (l.includes('class="th ') && l.includes('style=')) {
      issues.push(`${f}:${i + 1}: th with inline style: ${l.trim().slice(0, 100)}`);
    }
    if ((l.includes('class="tr ') || l.includes('class="tr alt')) && l.includes('style=')) {
      issues.push(`${f}:${i + 1}: tr with inline style: ${l.trim().slice(0, 100)}`);
    }
    
    // Check for tables without td-table wrapper
    if ((l.includes('class="th ') || l.includes('class="tr ') || l.includes('class="tr alt')) && !l.includes('td-table')) {
      // This is complex to check properly without parsing HTML structure
      // Skip for now
    }
  }
}

if (issues.length) {
  console.log('Table style issues found:');
  issues.forEach(x => console.log(x));
} else {
  console.log('No table inline style issues found');
}

// Count tables per page
let totalTables = 0;
for (const f of files) {
  const content = fs.readFileSync(path.join('src/pages/hgb', f), 'utf8');
  const count = (content.match(/class="td-table"/g) || []).length;
  if (count > 0) {
    console.log(`${f}: ${count} tables`);
    totalTables += count;
  }
}
console.log(`\nTotal tables across all HGB pages: ${totalTables}`);
