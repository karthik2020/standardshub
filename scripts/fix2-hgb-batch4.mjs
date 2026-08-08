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
  
  // Fix double class attributes from conversion (e.g., class="tr alt" class="cols-...")
  content = content.replace(/class="(tr|th|tr alt)" class="(cols-[^"]*)"/g, 'class="$1 $2"');
  
  // Fix broken <div class="tr <span> patterns
  content = content.replace(/class="(tr|tr alt)" <span>/g, 'class="$1"><span>');
  
  // Fix any remaining inline grid-template-columns on single lines
  content = content.replace(
    /<div class="(th|tr|tr alt)" style="grid-template-columns:([\d.]+fr\s+[\d.]+fr)"[^>]*>/g,
    (match, cls, ratio) => {
      const trimmed = ratio.replace(/\s+/g, ' ').trim();
      const map = {
        '0.6fr 1.7fr': 'cols-06-17',
        '0.8fr 2fr': 'cols-08-2',
        '1fr 1fr': 'cols-1-1',
        '1.2fr 1fr 1fr': 'cols-12-1-1',
        '1.6fr 1.2fr': 'cols-16-12',
        '1.6fr 1fr 1.4fr': 'cols-16-1-14'
      };
      const colCls = map[trimmed] || '';
      return `<div class="${cls}${colCls ? ' ' + colCls : ''}"`;
    }
  );
  
  // Fix multi-line inline styles
  content = content.replace(
    /<div class="(th|tr|tr alt)" style="grid-template-columns:\s*\n\s*([\d.]+fr\s+[\d.]+fr)\s*\n\s*"/g,
    (match, cls, ratio) => {
      const trimmed = ratio.replace(/\s+/g, ' ').trim();
      const map = {
        '0.6fr 1.7fr': 'cols-06-17',
        '0.8fr 2fr': 'cols-08-2',
        '1fr 1fr': 'cols-1-1',
        '1.2fr 1fr 1fr': 'cols-12-1-1',
        '1.6fr 1.2fr': 'cols-16-12',
        '1.6fr 1fr 1.4fr': 'cols-16-1-14'
      };
      const colCls = map[trimmed] || '';
      return `<div class="${cls}${colCls ? ' ' + colCls : ''}"`;
    }
  );
  
  // Remove any remaining inline style attributes
  content = content.replace(/\s*style="[^"]*"/g, '');
  
  // Remove any remaining class="xxx" class="yyy" double class issues
  content = content.replace(/class="([^"]+)" class="([^"]+)"/g, 'class="$1 $2"');
  
  fs.writeFileSync(filePath, content);
  console.log(`Fixed ${filePath}`);
}

console.log('Done');
