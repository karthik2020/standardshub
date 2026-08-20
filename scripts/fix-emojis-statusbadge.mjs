import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('src/pages/hgb').filter(f => f.endsWith('.astro'));
let fixed = 0;

for (const f of files) {
  const filePath = path.join('src/pages/hgb', f);
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Remove emojis from callout text
  content = content.replace(/<div class="callout (info|warn|danger|suc)">(✅|⚠️|🚫|ℹ️|✕)\s*/g, '<div class="callout $1">');

  // Remove status-badge divs (poster-specific)
  content = content.replace(/<div class="status-badge">[\s\S]*?<\/div>\s*/g, '');

  // Remove any remaining bare emoji characters at start of lines within callouts
  // This handles cases where emojis might appear elsewhere
  content = content.replace(/(<div class="callout (info|warn|danger|suc)">)([✅⚠️🚫ℹ️✕]\s*)/g, '$1$3'.replace(/[✅⚠️🚫ℹ️✕]\s*/, ''));

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    fixed++;
    console.log(`Fixed ${f}`);
  }
}
console.log(`Fixed ${fixed} files`);
