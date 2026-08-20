import fs from 'fs';
import path from 'path';

const files = [
  'hgb332.astro',
  'hgb333.astro',
  'hgb333a.astro',
  'hgb334.astro',
  'hgb335.astro',
  'hgb335a.astro',
  'hgb335b.astro',
  'hgb335c.astro'
];

for (const file of files) {
  const filePath = path.join('src', 'pages', 'hgb', file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix the specific broken pattern: <div class="tr <span> or <div class="tr alt <span>
  content = content.replace(/<div class="(tr(?: alt)?) <span>/g, '<div class="$1"><span>');
  
  // Fix double class attributes from earlier conversion
  content = content.replace(/class="(tr(?: alt)?)" class="(cols-[^"]*)"/g, 'class="$1 $2"');
  
  // Remove any remaining inline styles
  content = content.replace(/\s*style="[^"]*"/g, '');
  
  // Remove double class attributes that may have been created
  content = content.replace(/class="([^"]+)" class="([^"]+)"/g, 'class="$1 $2"');
  
  fs.writeFileSync(filePath, content);
  console.log(`Fixed ${filePath}`);
}

console.log('Done');
