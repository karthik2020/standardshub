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
  
  // Fix TOC IDs to match section IDs
  content = content.replace(/{ id: "(\d+)", label: /g, (match, num) => {
    return `{ id: "s${num}", label: `;
  });
  
  // Remove hub-sub divs and extra closing divs
  content = content.replace(/<div class="hub-sub">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*\n/g, '');
  
  // Fix broken <div class="tr <span> tags - these happen when inline style spans multiple lines
  content = content.replace(/<div class="(tr|tr alt)" <span>/g, '<div class="$1"><span>');
  
  // Fix multi-line inline grid-template-columns that weren't caught
  content = content.replace(
    /style="grid-template-columns:\s*\n\s*([\d.]+fr\s+[\d.]+fr)\s*\n\s*"/g,
    (match, ratio) => {
      const trimmed = ratio.replace(/\s+/g, ' ').trim();
      const map = {
        '0.6fr 1.7fr': 'cols-06-17',
        '0.8fr 2fr': 'cols-08-2',
        '1fr 1fr': 'cols-1-1',
        '1.2fr 1fr 1fr': 'cols-12-1-1',
        '1.6fr 1.2fr': 'cols-16-12',
        '1.6fr 1fr 1.4fr': 'cols-16-1-14'
      };
      const cls = map[trimmed] || '';
      return `class="${cls}"`;
    }
  );
  
  // Fix remaining inline style attributes on table cells that might have been missed
  content = content.replace(
    /<div class="(th|tr|tr alt)" style="grid-template-columns:([\d.]+fr\s+[\d.]+fr(?:[\s\S]*?))?"/g,
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
      return `<div class="${cls} ${colCls}"`.trim();
    }
  );
  
  // Fix standalone <div class="callout ..."> outside of wrap - move inside or wrap properly
  // These are introductory callouts that should be inside the first grid
  const calloutMatch = content.match(/(<div class="callout[^>]*>.*?<\/div>)\s*\n\s*<!-- ============ SECTION 1/);
  if (calloutMatch) {
    const callout = calloutMatch[1];
    content = content.replace(calloutMatch[0], `<!-- ============ SECTION 1`);
    // Insert callout inside first card
    content = content.replace(
      '(<div class="card ci">\n      <div class="ctitle ci">[^<]+</div>\n      <div class="principle">)',
      `$1\n      ${callout}\n`
    );
  }
  
  // Remove any remaining inline style attributes
  content = content.replace(/\s*style="[^"]*"/g, '');
  
  // Remove empty lines at start of wrap content
  content = content.replace(/(<div class="wrap">)\n+/, '$1\n');
  
  fs.writeFileSync(filePath, content);
  console.log(`Fixed ${filePath}`);
}

console.log('Done');
