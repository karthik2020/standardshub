import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('src/pages/hgb').filter(f => f.endsWith('.astro'));

for (const f of files) {
  const c = fs.readFileSync(path.join('src/pages/hgb', f), 'utf8');
  
  // Check if TOC references s1
  const tocMatch = c.match(/id:\s*"s1"/);
  if (!tocMatch) continue;
  
  // Check if page has section-header with id="s1"
  const hasS1 = c.includes('id="s1"');
  if (!hasS1) {
    console.log(`${f}: TOC references s1 but no section-header with id="s1" exists`);
  }
}
