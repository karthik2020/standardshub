import fs from 'fs';
const f = 'src/pages/hgb/hgb242-245.astro';
const content = fs.readFileSync(f, 'utf8');
const section1Comment = content.match(/<!--\s*={20}\s*SECTION 1\s*={20}\s*-->/);
console.log('Comment found:', !!section1Comment);
if (section1Comment) {
  const commentIndex = section1Comment.index;
  const afterComment = content.slice(commentIndex + section1Comment[0].length);
  console.log('After comment starts with:', JSON.stringify(afterComment.slice(0, 50)));
  const firstCardMatch = afterComment.match(/<div class="(card|grid) /);
  console.log('First card match:', firstCardMatch);
}
