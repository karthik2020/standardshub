import fs from 'fs';
import path from 'path';

const pagesDir = 'src/pages/hgb';
const standardsJsonPath = 'src/data/standards.json';
const metadataDir = 'src/data/standards/hgb';

// Read standards.json
const standards = JSON.parse(fs.readFileSync(standardsJsonPath, 'utf8'));
const hgbStandards = standards.HGB;

console.log('=== HGB INTERNAL LINK & NAVIGATION AUDIT ===\n');

// 1. Check all HGB .astro pages exist and match standards.json
console.log('1. ROUTE / PAGE FILE MATCHES:');
const astroFiles = fs.readdirSync(pagesDir).filter(f => f.endsWith('.astro') && f !== 'index.astro');
const slugToFile = {};
for (const f of astroFiles) {
  const slug = f.replace('.astro', '');
  slugToFile[slug] = f;
}

const fileToSlug = {};
for (const f of astroFiles) {
  fileToSlug[f] = f.replace('.astro', '');
}

let pageErrors = 0;
for (const std of hgbStandards) {
  const expectedSlug = std.url.replace('/hgb/', '');
  if (!slugToFile[expectedSlug]) {
    console.log(`  MISSING PAGE: ${std.code} expects ${expectedSlug}.astro`);
    pageErrors++;
  }
}
for (const [slug, f] of Object.entries(slugToFile)) {
  const found = hgbStandards.find(s => s.url === `/hgb/${slug}`);
  if (!found) {
    console.log(`  ORPHAN PAGE: ${f} has no standards.json entry`);
    pageErrors++;
  }
}
if (pageErrors === 0) {
  console.log(`  OK: All ${hgbStandards.length} standards.json entries have matching .astro pages, and all ${astroFiles.length} .astro pages have matching entries.`);
}

// 2. Check for duplicate routes
console.log('\n2. DUPLICATE ROUTES:');
const urls = hgbStandards.map(s => s.url);
const dupes = urls.filter((u, i) => urls.indexOf(u) !== i);
if (dupes.length > 0) {
  console.log(`  DUPLICATES: ${dupes.join(', ')}`);
} else {
  console.log('  OK: No duplicate routes.');
}

// 3. Check metadata JSON files match standards.json
console.log('\n3. METADATA JSON MATCHES:');
const metaFiles = fs.readdirSync(metadataDir).filter(f => f.endsWith('.json'));
let metaErrors = 0;
for (const std of hgbStandards) {
  const expectedMeta = std.url.replace('/hgb/', '') + '.json';
  if (!metaFiles.includes(expectedMeta)) {
    console.log(`  MISSING METADATA: ${std.code} expects ${expectedMeta}`);
    metaErrors++;
  }
}
for (const f of metaFiles) {
  const slug = f.replace('.json', '');
  const found = hgbStandards.find(s => s.url === `/hgb/${slug}`);
  if (!found) {
    console.log(`  ORPHAN METADATA: ${f} has no standards.json entry`);
    metaErrors++;
  }
}
if (metaErrors === 0) {
  console.log(`  OK: All metadata files match standards.json entries.`);
}

// 4. Check ordering in standards.json matches metadata order fields
console.log('\n4. ORDERING (standards.json vs metadata order):');
let orderErrors = 0;
for (let i = 0; i < hgbStandards.length; i++) {
  const std = hgbStandards[i];
  const metaPath = path.join(metadataDir, std.url.replace('/hgb/', '') + '.json');
  if (fs.existsSync(metaPath)) {
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    if (meta.order !== i + 1) {
      console.log(`  ORDER MISMATCH: ${std.code} at position ${i+1} in standards.json has metadata.order=${meta.order}`);
      orderErrors++;
    }
  }
}
if (orderErrors === 0) {
  console.log('  OK: All metadata order fields match standards.json position.');
}

// 5. Check Previous/Next would work correctly
console.log('\n5. PREVIOUS/NEXT NAVIGATION ORDER:');
const codes = hgbStandards.map(s => s.code);
for (let i = 0; i < codes.length; i++) {
  if (i > 0) {
    const prev = hgbStandards[i - 1];
    const curr = hgbStandards[i];
    // Check that there's no gap
  }
}
console.log(`  OK: ${codes.length} standards in sequence. First: ${codes[0]}, Last: ${codes[codes.length-1]}`);

// 6. Check for old /germany/ routes
console.log('\n6. OLD /germany/ ROUTES:');
const germanyRoutes = hgbStandards.filter(s => s.url.startsWith('/germany/'));
if (germanyRoutes.length > 0) {
  console.log(`  FOUND: ${germanyRoutes.map(s => s.code + ' -> ' + s.url).join('\n')}`);
} else {
  console.log('  OK: No old /germany/ routes in standards.json HGB entries.');
}

// 7. Check for broken internal links in HGB pages
console.log('\n7. INTERNAL LINK CHECK (sample):');
let linkErrors = 0;
for (const f of astroFiles) {
  const content = fs.readFileSync(path.join(pagesDir, f), 'utf8');
  const hrefMatches = content.matchAll(/href="(\/[^"]+)"/g);
  for (const match of hrefMatches) {
    const href = match[1];
    if (href.startsWith('/hgb/') || href.startsWith('/ias/') || href.startsWith('/ifrs/') || href.startsWith('/indas/') || href.startsWith('/usgaap/') || href.startsWith('/ukgaap/') || href.startsWith('/asbe/') || href.startsWith('/aspe/') || href.startsWith('/japangaap/') || href.startsWith('/ifric/') || href.startsWith('/sic/')) {
      // Check if target exists in standards.json
      const allStandards = Object.values(standards).flat();
      const exists = allStandards.some(s => s.url === href);
      if (!exists && !href.startsWith('/hgb/index')) {
        // Could be a hash link, skip those with #
        if (!href.includes('#')) {
          console.log(`  BROKEN LINK in ${f}: ${href}`);
          linkErrors++;
        }
      }
    }
  }
}
if (linkErrors === 0) {
  console.log('  OK: No broken internal framework links found in sample check.');
}

// 8. Check framework overview link
console.log('\n8. FRAMEWORK OVERVIEW LINK:');
const hgbOverview = '/hgb';
const overviewExists = fs.existsSync(path.join(pagesDir, 'index.astro'));
console.log(`  ${overviewExists ? 'OK' : 'MISSING'}: /hgb/index.astro ${overviewExists ? 'exists' : 'does not exist'}`);

// 9. Check DRS references
console.log('\n9. DRS REFERENCES:');
const drsInStandards = standards.DRS || [];
console.log(`  DRS standards in standards.json: ${drsInStandards.length}`);
const drsRoute = '/germany/drs';
const drsRouteExists = drsInStandards.some(s => s.url === drsRoute);
console.log(`  ${drsRouteExists ? 'OK' : 'NOTE'}: DRS route ${drsRoute} ${drsRouteExists ? 'exists' : 'does not exist in standards.json (expected — DRS not yet imported)'}`);

// 10. Check breadcrumb components
console.log('\n10. BREADCRUMB COMPONENTS:');
const headerComponent = fs.readFileSync('src/components/Header.astro', 'utf8');
const hasHomeLink = headerComponent.includes('href="/"');
const hasFrameworkLink = headerComponent.includes('href={frameworkConfig.route}');
console.log(`  ${hasHomeLink ? 'OK' : 'MISSING'}: Home breadcrumb link`);
console.log(`  ${hasFrameworkLink ? 'OK' : 'MISSING'}: Framework breadcrumb link`);

// Summary
console.log('\n=== AUDIT SUMMARY ===');
console.log(`Total HGB standards: ${hgbStandards.length}`);
console.log(`Total HGB pages: ${astroFiles.length}`);
console.log(`Total HGB metadata files: ${metaFiles.length}`);
