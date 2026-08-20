const fs = require('fs');
const path = require('path');

const dir = 'src/pages/hgb';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.astro') && (f.startsWith('hgb29') || f.startsWith('hgb30') || f.startsWith('hgb31')));

for (const f of files) {
  const lines = fs.readFileSync(path.join(dir, f), 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (line.includes('label:')) {
      const match = line.match(/label:\s*"([^"]*)"/);
      if (match && match[1].includes('"')) {
        console.log(f + ':' + (i + 1) + ': ' + line.trim());
      }
    }
  });
}
