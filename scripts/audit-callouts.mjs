import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('src/pages/hgb').filter(f => f.endsWith('.astro'));

for (const f of files) {
  const c = fs.readFileSync(path.join('src/pages/hgb', f), 'utf8');
  
  // Check for callout placement relative to cards
  // A callout is "outside card" if it appears before the first card or after all cards close
  const lines = c.split('\n');
  let calloutsOutside = [];
  let inCard = false;
  let cardDepth = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    
    // Track card depth properly
    const openDivs = (l.match(/<div\b/g) || []).length;
    const closeDivs = (l.match(/<\/div>/g) || []).length;
    
    if (l.includes('class="card ') || l.includes('class="card"')) {
      inCard = true;
      cardDepth = 1; // This div itself counts as depth 1
      // Account for any additional divs on this line
      const extraOpens = openDivs - 1; // subtract the card div itself
      cardDepth += extraOpens;
      // Account for closes on this line
      cardDepth -= closeDivs;
      continue;
    }
    
    if (inCard) {
      cardDepth += openDivs;
      cardDepth -= closeDivs;
      if (cardDepth <= 0) {
        inCard = false;
        cardDepth = 0;
      }
    }
    
    if (l.includes('class="callout') && !inCard) {
      calloutsOutside.push(i + 1);
    }
  }
  
  if (calloutsOutside.length > 0) {
    console.log(`${f}: ${calloutsOutside.length} callouts outside cards at lines: ${calloutsOutside.join(', ')}`);
  }
}
