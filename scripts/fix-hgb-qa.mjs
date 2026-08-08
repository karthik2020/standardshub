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
  'hgb335c.astro',
  'hgb336-339.astro',
  'hgb340-340o.astro',
  'hgb341-341p.astro',
  'hgb341q-341y.astro',
  'hgb342-342p.astro',
  'hgb342q-342r.astro',
];

for (const file of files) {
  const filePath = path.join('src', 'pages', 'hgb', file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix 1: Remove malformed wrap div + orphan closing div
  // Pattern: <div class="wrap">\n</div>\n  </div>
  content = content.replace(/<div class="wrap">\n<\/div>\n  <\/div>\n/g, '\n');
  
  // Fix 2: Merge duplicate class attributes
  // Pattern: class="th" class="cols-..." or class="tr..." class="cols-..."
  content = content.replace(/class="(th|tr|tr alt)" class="(cols-[^"]+)"/g, 'class="$1 $2"');
  
  // Fix 3: Fix generic TOC labels by extracting actual section headers
  const tocItems = [];
  const sectionMatches = content.matchAll(/<div class="section-header" id="s(\d+)"><span class="num">(\d+)<\/span><h2>([^<]+)<\/h2><span class="line"><\/span><\/div>/g);
  for (const m of sectionMatches) {
    tocItems.push(`        { id: "s${m[1]}", label: "${m[3]}" }`);
  }
  
  if (tocItems.length > 0) {
    const tocBlock = tocItems.join(',\n');
    // Replace the items array in PageToc
    content = content.replace(
      /(<PageToc\s+items=\{\[)[\s\S]*?(\]\}\s*\/>)/,
      `$1\n${tocBlock},\n          $2`
    );
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`Fixed ${filePath}`);
}

console.log('Done');
