import fs from 'fs';
import path from 'path';

const pagesDir = 'src/pages/hgb';
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.astro') && f !== 'index.astro');
const standards = JSON.parse(fs.readFileSync('src/data/standards.json', 'utf8'));

// Build lookup of all valid URLs
const allUrls = new Set();
for (const [framework, stds] of Object.entries(standards)) {
  for (const s of stds) {
    allUrls.add(s.url);
  }
}

console.log('=== INTERNAL LINK AUDIT ===\n');
let brokenLinks = 0;

for (const f of files) {
  const content = fs.readFileSync(path.join(pagesDir, f), 'utf8');
  
  // Find all href attributes
  const hrefMatches = [...content.matchAll(/href="(\/[^"]+)"/g)];
  for (const match of hrefMatches) {
    const href = match[1];
    
    // Skip external links, anchors, and known-good patterns
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('#')) continue;
    if (href === '/' || href === '/hgb' || href.startsWith('/hgb/')) continue;
    
    // Check if it's a valid framework URL
    if (!allUrls.has(href)) {
      console.log(`  ${f}: ${href}`);
      brokenLinks++;
    }
  }
}

console.log(`\nTotal broken internal links: ${brokenLinks}`);
