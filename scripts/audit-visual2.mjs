import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('src/pages/hgb').filter(f => f.endsWith('.astro'));

let issues = [];

for (const f of files) {
  const c = fs.readFileSync(path.join('src/pages/hgb', f), 'utf8');
  const lines = c.split('\n');
  
  // Check for callouts outside cards (not inside a .card div)
  let inCard = false;
  let cardDepth = 0;
  let calloutsOutsideCards = [];
  
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    
    if (l.includes('class="card ') || l.includes('class="card"')) {
      inCard = true;
      cardDepth = 0;
    }
    
    if (inCard) {
      if (l.includes('<div') && !l.includes('</div>')) {
        cardDepth++;
      }
      if (l.includes('</div>')) {
        cardDepth--;
        if (cardDepth === 0) {
          inCard = false;
        }
      }
    }
    
    if (l.includes('class="callout') && !inCard) {
      calloutsOutsideCards.push(i + 1);
    }
  }
  
  if (calloutsOutsideCards.length > 0) {
    issues.push(`${f}: ${calloutsOutsideCards.length} callouts outside cards at lines: ${calloutsOutsideCards.join(', ')}`);
  }
  
  // Check for consistent card color classes
  const cardClasses = new Set();
  for (const l of lines) {
    if (l.includes('class="card ')) {
      const match = l.match(/class="card (ci|cs|cd|cw|cn)"/);
      if (match) cardClasses.add(match[1]);
    }
  }
  
  // Check for section-header consistency
  let sectionHeaders = 0;
  for (const l of lines) {
    if (l.includes('class="section-header"')) sectionHeaders++;
  }
  
  // Check for TOC consistency
  const tocMatch = c.match(/items=\[\s*\{[^}]*id:\s*"s1"/);
  if (!tocMatch) {
    issues.push(`${f}: TOC missing s1 item or malformed`);
  }
  
  // Check for StandardPageLayout props consistency
  if (!c.includes('issued={metadata.issued}') || !c.includes('latestAmendment={metadata.latestAmendment}')) {
    issues.push(`${f}: StandardPageLayout props inconsistent`);
  }
  
  // Check for standards-poster.css import
  if (!c.includes('import "../../styles/standards-poster.css";')) {
    issues.push(`${f}: Missing standards-poster.css import`);
  }
  
  // Check for extended.css import
  if (!c.includes('import "../../styles/extended.css";')) {
    issues.push(`${f}: Missing extended.css import`);
  }
}

console.log('Visual consistency issues found:');
issues.forEach(x => console.log(x));
