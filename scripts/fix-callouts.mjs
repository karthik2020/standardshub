import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('src/pages/hgb').filter(f => f.endsWith('.astro'));

let fixed = 0;

for (const f of files) {
  const filePath = path.join('src/pages/hgb', f);
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Find standalone callouts before the first section-header
  // Pattern: callout div(s) that appear after the TOC fragment and before the first section-header
  const sectionHeaderMatch = content.match(/<div class="section-header" id="s1"/);
  if (!sectionHeaderMatch) continue;
  
  const sectionHeaderIndex = sectionHeaderMatch.index;
  const beforeSection1 = content.slice(0, sectionHeaderIndex);
  const afterSection1 = content.slice(sectionHeaderIndex);
  
  // Find callouts in the beforeSection1 part
  const calloutRegex = /<div class="callout [^"]*">[\s\S]*?<\/div>\s*/g;
  const callouts = beforeSection1.match(calloutRegex);
  
  if (!callouts || callouts.length === 0) continue;
  
  // Remove callouts from beforeSection1
  let cleanedBefore = beforeSection1.replace(calloutRegex, '');
  
  // Find the first card in afterSection1
  const firstCardMatch = afterSection1.match(/<div class="card [^"]*">/);
  if (!firstCardMatch) continue;
  
  const firstCardIndex = afterSection1.indexOf(firstCardMatch[0]);
  const afterFirstCard = afterSection1.slice(firstCardIndex);
  
  // Find the closing </div> of the first card
  // We need to find the matching closing div for the first card
  let depth = 0;
  let cardCloseIndex = -1;
  for (let i = 0; i < afterFirstCard.length; i++) {
    if (afterFirstCard.slice(i, i + 4) === '<div') {
      depth++;
      // Skip to end of tag
      const tagEnd = afterFirstCard.indexOf('>', i);
      if (tagEnd !== -1) i = tagEnd;
    } else if (afterFirstCard.slice(i, i + 6) === '</div>') {
      depth--;
      if (depth === 0) {
        cardCloseIndex = i;
        break;
      }
    }
  }
  
  if (cardCloseIndex === -1) continue;
  
  // Build new content: cleaned before + first card opening + callouts + rest of first card + after
  const beforeCard = afterFirstCard.slice(0, firstCardMatch[0].length);
  const cardContent = afterFirstCard.slice(firstCardMatch[0].length, cardCloseIndex);
  const afterCard = afterFirstCard.slice(cardCloseIndex);
  
  // Insert callouts at the beginning of the card content
  const calloutsHtml = callouts.join('\n      ');
  const newCardContent = '\n      ' + calloutsHtml + '\n      ' + cardContent.trimStart();
  
  const newContent = cleanedBefore + beforeCard + newCardContent + afterCard;
  
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent);
    fixed++;
    console.log(`Fixed ${f}: moved ${callouts.length} callout(s) into first card`);
  }
}

console.log(`Fixed ${fixed} files`);
