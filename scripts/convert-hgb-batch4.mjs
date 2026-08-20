import fs from 'fs';
import path from 'path';

const posters = [
  'HGB332_VerletzungBerichtspflicht_Extended_Poster.html',
  'HGB333_VerletzungGeheimhaltungspflicht_Extended_Poster.html',
  'HGB333a_PflichtenAbschlusspruefungen_Extended_Poster.html',
  'HGB334_Bussgeldvorschriften_Extended_Poster.html',
  'HGB335_FestsetzungOrdnungsgeld_Extended_Poster.html',
  'HGB335a_BeschwerdeOrdnungsgeld_Extended_Poster.html',
  'HGB335b_AnwendungOHGKG_Extended_Poster.html',
  'HGB335c_MitteilungenAPAS_Extended_Poster.html'
];

const mapping = {
  'HGB332_VerletzungBerichtspflicht_Extended_Poster.html': 'hgb332',
  'HGB333_VerletzungGeheimhaltungspflicht_Extended_Poster.html': 'hgb333',
  'HGB333a_PflichtenAbschlusspruefungen_Extended_Poster.html': 'hgb333a',
  'HGB334_Bussgeldvorschriften_Extended_Poster.html': 'hgb334',
  'HGB335_FestsetzungOrdnungsgeld_Extended_Poster.html': 'hgb335',
  'HGB335a_BeschwerdeOrdnungsgeld_Extended_Poster.html': 'hgb335a',
  'HGB335b_AnwendungOHGKG_Extended_Poster.html': 'hgb335b',
  'HGB335c_MitteilungenAPAS_Extended_Poster.html': 'hgb335c'
};

for (const poster of posters) {
  const slug = mapping[poster];
  const inputPath = path.join('documents', 'HGB', poster);
  const outputPath = path.join('src', 'pages', 'hgb', `${slug}.astro`);
  
  let html = fs.readFileSync(inputPath, 'utf8');
  
  // Extract content between </head> and </html>
  const start = html.indexOf('</head>') + 7;
  const end = html.lastIndexOf('</html>');
  let body = html.slice(start, end).trim();
  
  // Remove <body> tag
  body = body.replace(/^<body>/, '').replace(/<\/body>$/, '').trim();
  
  // Remove footer-note divs
  body = body.replace(/<div class="footer-note">[\s\S]*?<\/div>/g, '');
  
  // Remove hub divs (poster-only header)
  body = body.replace(/<div class="hub">[\s\S]*?<\/div>\s*/, '');
  
  // Remove toc divs (poster-only toc)
  body = body.replace(/<div class="toc">[\s\S]*?<\/div>\s*/, '');
  
  // Remove wrap div wrapper if present
  body = body.replace(/^<div class="wrap">/, '').replace(/<\/div>$/, '').trim();
  
  // Replace inline grid-template-columns with cols-* classes
  const gridMap = {
    '0.6fr 1.7fr': 'cols-06-17',
    '0.8fr 2fr': 'cols-08-2',
    '1fr 1fr': 'cols-1-1',
    '1.2fr 1fr 1fr': 'cols-12-1-1',
    '1.6fr 1.2fr': 'cols-16-12',
    '1.6fr 1fr 1.4fr': 'cols-16-1-14'
  };
  
  for (const [ratio, cls] of Object.entries(gridMap)) {
    const regex = new RegExp(`style="grid-template-columns:${ratio.replace(/\./g, '\\.')}"`, 'g');
    body = body.replace(regex, `class="${cls}"`);
  }
  
  // Also handle grid-template-columns that appear split across lines
  body = body.replace(/style="grid-template-columns:\s*([\d.]+fr\s+[\d.]+fr)"\s*>/g, (match, ratio) => {
    const trimmed = ratio.replace(/\s+/g, ' ').trim();
    for (const [r, c] of Object.entries(gridMap)) {
      if (r.replace(/\s+/g, ' ') === trimmed) {
        return `class="${c}">`;
      }
    }
    return match;
  });
  
  // Remove remaining inline style attributes on td-table cells
  body = body.replace(/<div class="th [^"]*" style="[^"]*">/g, '<div class="th ');
  body = body.replace(/<div class="tr [^"]*" style="[^"]*">/g, '<div class="tr ');
  body = body.replace(/<div class="tr alt [^"]*" style="[^"]*">/g, '<div class="tr alt ');
  
  // Remove any remaining inline style attributes
  body = body.replace(/\s*style="[^"]*"/g, '');
  
  // Fix emoji callouts to StandardsHub callouts
  body = body.replace(/<div class="callout info">[^<]*✅/g, '<div class="callout suc callout--chip callout--flush">✅');
  body = body.replace(/<div class="callout warn">[^<]*⚠️/g, '<div class="callout warn callout--chip callout--flush">⚠️');
  body = body.replace(/<div class="callout danger">[^<]*🚫/g, '<div class="callout danger callout--chip callout--flush">🚫');
  body = body.replace(/<div class="callout suc">[^<]*✅/g, '<div class="callout suc callout--chip callout--flush">✅');
  
  // Build TOC items from section headers
  const tocItems = [];
  const sectionMatches = body.matchAll(/<div class="section-header" id="[^"]*"><span class="num">(\d+)<\/span><h2>([^<]+)<\/h2><span class="line"><\/span><\/div>/g);
  for (const m of sectionMatches) {
    tocItems.push(`        { id: "${m[1]}", label: "${m[1]}. ${m[2]}" }`);
  }
  
  const tocBlock = tocItems.join(',\n');
  
  const astro = `---
import StandardPageLayout from "../../layouts/StandardPageLayout.astro";
import PageToc from "../../components/PageToc.astro";
import "../../styles/standards-poster.css";
import "../../styles/extended.css";
import metadata from "../../data/standards/hgb/${slug}.json";
---

<StandardPageLayout
  code={metadata.code}
  standardType={metadata.framework}
  title={metadata.title}
  description={metadata.summary}
  issued={metadata.issued}
  latestAmendment={metadata.latestAmendment}
  summary={metadata.summary}
  subtitle={metadata.nativeTitle}
  covers={metadata.covers}
>
  <Fragment slot="toc">
    <PageToc
      items={[
${tocBlock}
      ]}
    />
  </Fragment>
  <div class="wrap">
${body}
  </div>
</StandardPageLayout>
`;
  
  fs.writeFileSync(outputPath, astro);
  console.log(`Created ${outputPath}`);
}

console.log('Done');
