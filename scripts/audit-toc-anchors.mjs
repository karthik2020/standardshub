import fs from 'fs';
import path from 'path';

const pagesDir = 'src/pages/hgb';
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.astro') && f !== 'index.astro');

console.log('=== DEEP TOC & ANCHOR AUDIT ===\n');

let totalTocItems = 0;
let missingAnchors = 0;
let orphanAnchors = 0;
let duplicateIds = 0;
const duplicateIdSet = new Set();

for (const f of files) {
  const content = fs.readFileSync(path.join(pagesDir, f), 'utf8');
  
  // Extract TOC items - find all id/label pairs within PageToc items array
  const tocMatch = content.match(/<PageToc\s+items=\{([\s\S]*?)\}\s*\/>/);
  let tocItems = [];
  if (tocMatch) {
    const itemsBlock = tocMatch[1];
    // Match id="sN" patterns
    const idMatches = [...itemsBlock.matchAll(/id:\s*"([^"]+)"/g)];
    const labelMatches = [...itemsBlock.matchAll(/label:\s*"([^"]+)"/g)];
    
    // Pair them up by position
    const count = Math.min(idMatches.length, labelMatches.length);
    for (let i = 0; i < count; i++) {
      tocItems.push({
        id: idMatches[i][1],
        label: labelMatches[i][1]
      });
    }
  }
  
  // Extract section headers
  const headerMatches = [...content.matchAll(/<div class="section-header" id="([^"]+)">/g)];
  const headerIds = headerMatches.map(m => m[1]);
  
  // Extract ALL ids
  const allIdMatches = [...content.matchAll(/id="([^"]+)"/g)];
  const allIds = allIdMatches.map(m => m[1]);
  
  // Check for duplicate ids (excluding known layout ids)
  const idCounts = {};
  for (const id of allIds) {
    idCounts[id] = (idCounts[id] || 0) + 1;
  }
  const skipIds = ['main', 'backToTop', 'tocLauncher', 'tocSheetClose', 'sidebarOverlay', 'tocSheetBackdrop', 'search-placeholder', 'standard-search', 'search-action'];
  for (const [id, count] of Object.entries(idCounts)) {
    if (count > 1 && !skipIds.includes(id)) {
      if (!duplicateIdSet.has(`${f}:${id}`)) {
        console.log(`  DUPLICATE ID: ${f} - id="${id}" appears ${count} times`);
        duplicateIdSet.add(`${f}:${id}`);
        duplicateIds++;
      }
    }
  }
  
  // Check TOC items have matching anchors
  for (const item of tocItems) {
    totalTocItems++;
    if (!headerIds.includes(item.id)) {
      console.log(`  MISSING ANCHOR: ${f} - TOC item "${item.label}" (id="${item.id}") has no matching section-header`);
      missingAnchors++;
    }
  }
  
  // Check for orphan section headers (no TOC entry) - only report if there are TOC items
  if (tocItems.length > 0) {
    for (const headerId of headerIds) {
      const hasTocEntry = tocItems.some(item => item.id === headerId);
      if (!hasTocEntry) {
        console.log(`  ORPHAN HEADER: ${f} - section-header id="${headerId}" has no TOC entry`);
        orphanAnchors++;
      }
    }
  }
}

console.log('\n=== TOC ANCHOR SUMMARY ===');
console.log(`Total TOC items checked: ${totalTocItems}`);
console.log(`Missing anchors: ${missingAnchors}`);
console.log(`Orphan headers: ${orphanAnchors}`);
console.log(`Duplicate IDs: ${duplicateIds}`);

if (missingAnchors === 0 && orphanAnchors === 0 && duplicateIds === 0) {
  console.log('\nRESULT: All TOC anchors are valid.');
}
