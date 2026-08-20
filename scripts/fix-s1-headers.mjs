import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('src/pages/hgb').filter(f => f.endsWith('.astro'));

let fixed = 0;

for (const f of files) {
  const filePath = path.join('src/pages/hgb', f);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if already has s1 section header
  if (content.includes('id="s1"')) continue;
  
  // Find TOC label for s1
  const tocMatch = content.match(/\{\s*id:\s*"s1"\s*,\s*label:\s*"([^"]+)"/);
  if (!tocMatch) continue;
  
  const s1Label = tocMatch[1];
  
  // Find the Section 1 comment
  const section1Comment = content.match(/<!--\s*=+\s*SECTION 1\s*=+\s*-->/);
  if (!section1Comment) continue;
  
  const commentIndex = section1Comment.index;
  const commentEnd = commentIndex + section1Comment[0].length;
  const afterComment = content.slice(commentEnd);
  
  // Find the first card or grid after the comment
  const firstCardMatch = afterComment.match(/<div class="(card|grid) /);
  if (!firstCardMatch) continue;
  
  const insertIndex = commentEnd + afterComment.indexOf(firstCardMatch[0]);
  
  // Insert section-header before the first card/grid
  const sectionHeader = `\n  <div class="section-header" id="s1"><span class="num">1</span><h2>${s1Label}</h2><span class="line"></span></div>`;
  
  content = content.slice(0, insertIndex) + sectionHeader + content.slice(insertIndex);
  
  fs.writeFileSync(filePath, content);
  fixed++;
  console.log(`Fixed ${f}: added s1 section header`);
}

console.log(`Fixed ${fixed} files`);
