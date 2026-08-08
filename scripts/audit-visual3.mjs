import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('src/pages/hgb').filter(f => f.endsWith('.astro'));

let issues = [];

for (const f of files) {
  const c = fs.readFileSync(path.join('src/pages/hgb', f), 'utf8');
  const lines = c.split('\n');
  
  // Check for empty wrap divs
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '<div class="wrap">' && 
        lines[i+1] && lines[i+1].trim() === '</div>') {
      issues.push(`${f}:${i + 1}: Empty wrap div`);
    }
  }
  
  // Check for consistent StandardPageLayout props
  const requiredProps = ['code', 'standardType', 'title', 'description', 'issued', 'latestAmendment', 'summary', 'subtitle', 'covers'];
  for (const prop of requiredProps) {
    if (!c.includes(`${prop}={metadata.${prop}}`)) {
      issues.push(`${f}: Missing StandardPageLayout prop: ${prop}`);
    }
  }
  
  // Check for required imports
  if (!c.includes('import "../../styles/standards-poster.css";')) {
    issues.push(`${f}: Missing standards-poster.css import`);
  }
  if (!c.includes('import "../../styles/extended.css";')) {
    issues.push(`${f}: Missing extended.css import`);
  }
  if (!c.includes('import PageToc from "../../components/PageToc.astro";')) {
    issues.push(`${f}: Missing PageToc import`);
  }
  
  // Check for section headers with proper numbering
  let sectionNum = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('class="section-header"')) {
      sectionNum++;
      const expectedId = `s${sectionNum}`;
      if (!lines[i].includes(`id="${expectedId}"`)) {
        issues.push(`${f}:${i + 1}: Section header ${sectionNum} has wrong or missing id (expected ${expectedId})`);
      }
    }
  }
  
  // Check for TOC items matching sections
  const tocMatch = c.match(/items=\[\s*\{[^}]*id:\s*"s1"[^}]*\}/);
  if (!tocMatch) {
    issues.push(`${f}: TOC missing first item or malformed`);
  }
  
  // Check for callouts without variant class (except the generic one used in hgb342q-342r)
  const calloutMatches = c.matchAll(/<div class="callout(?!\s+(info|warn|danger|suc))"/g);
  for (const m of calloutMatches) {
    issues.push(`${f}: Callout without variant class: ${m[0]}`);
  }
  
  // Check for consistent card usage (every section should have a grid with cards)
  const sectionHeaders = c.match(/class="section-header"/g);
  const grids = c.match(/class="grid"/g);
  if (sectionHeaders && grids && sectionHeaders.length !== grids.length) {
    // Not all sections have grids, but let's check if it's a pattern
    // Some sections might have single cards without grid wrapper
  }
  
  // Check for glossary section
  if (!c.includes('Quick-Reference Glossary') && !c.includes('glossary-item')) {
    issues.push(`${f}: Missing glossary section`);
  }
}

if (issues.length) {
  console.log('Visual consistency issues found:');
  issues.forEach(x => console.log(x));
} else {
  console.log('No visual consistency issues found');
}
