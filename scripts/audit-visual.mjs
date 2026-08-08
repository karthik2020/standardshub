import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('src/pages/hgb').filter(f => f.endsWith('.astro'));

let issues = [];

for (const f of files) {
  const c = fs.readFileSync(path.join('src/pages/hgb', f), 'utf8');
  const lines = c.split('\n');
  
  // Check for malformed wrap divs (empty wrap followed by orphan closing div)
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '<div class="wrap">' && 
        lines[i+1] && lines[i+1].trim() === '</div>' &&
        lines[i+2] && lines[i+2].trim() === '</div>') {
      issues.push(`${f}:${i + 1}: Malformed empty wrap div`);
    }
  }
  
  // Check for callouts outside of cards (not inside a .card div)
  let inCard = false;
  let cardDepth = 0;
  
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
      issues.push(`${f}:${i + 1}: Callout outside of card: ${l.trim().slice(0, 80)}`);
    }
  }
  
  // Check for section headers without section numbers
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('class="section-header"')) {
      const nextLine = lines[i + 1];
      if (nextLine && !nextLine.includes('<span class="num">')) {
        issues.push(`${f}:${i + 1}: Section header missing section number`);
      }
    }
  }
}

if (issues.length) {
  console.log('Visual inconsistencies found:');
  issues.forEach(x => console.log(x));
} else {
  console.log('No visual inconsistencies found');
}
