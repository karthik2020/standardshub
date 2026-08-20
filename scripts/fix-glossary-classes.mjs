import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('src/pages/hgb').filter(f => f.endsWith('.astro'));
let fixed = 0;
for (const f of files) {
  const filePath = path.join('src/pages/hgb', f);
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  content = content.replace(/class="glossary-item" class="glossary-item--last"/g, 'class="glossary-item glossary-item--last"');
  content = content.replace(/class="glossary-item--last" class="glossary-item"/g, 'class="glossary-item glossary-item--last"');
  if (content !== original) {
    fs.writeFileSync(filePath, content);
    fixed++;
    console.log(`Fixed ${f}`);
  }
}
console.log(`Fixed ${fixed} files`);
