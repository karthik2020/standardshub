import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('src/pages/hgb').filter(f => f.endsWith('.astro'));

let fixed = 0;

for (const f of files) {
  const filePath = path.join('src/pages/hgb', f);
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Fix malformed empty wrap divs: <div class="wrap">\n</div>\n</div>
  content = content.replace(/<div class="wrap">\s*<\/div>\s*<\/div>/g, '');

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    fixed++;
    console.log(`Fixed ${f}`);
  }
}
console.log(`Fixed ${fixed} files`);
