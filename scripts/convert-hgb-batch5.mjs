import fs from 'fs';
import path from 'path';

const posters = [
  'HGB336-339_ErgaenzendeVorschriftenGenossenschaften_Extended_Poster.html',
  'HGB340-340o_Kreditinstitute_Extended_Poster.html',
  'HGB341-341p_VersicherungsunternehmenPensionsfonds_Extended_Poster.html',
  'HGB341q-341y_ZahlungsberichtRohstoffsektor_Extended_Poster.html',
  'HGB342-342p_Ertragsteuerinformationsbericht_Extended_Poster.html',
  'HGB342q-342r_PrivatesRechnungslegungsgremium_Extended_Poster.html'
];

const mapping = {
  'HGB336-339_ErgaenzendeVorschriftenGenossenschaften_Extended_Poster.html': 'hgb336-339',
  'HGB340-340o_Kreditinstitute_Extended_Poster.html': 'hgb340-340o',
  'HGB341-341p_VersicherungsunternehmenPensionsfonds_Extended_Poster.html': 'hgb341-341p',
  'HGB341q-341y_ZahlungsberichtRohstoffsektor_Extended_Poster.html': 'hgb341q-341y',
  'HGB342-342p_Ertragsteuerinformationsbericht_Extended_Poster.html': 'hgb342-342p',
  'HGB342q-342r_PrivatesRechnungslegungsgremium_Extended_Poster.html': 'hgb342q-342r'
};

const gridMap = {
  '0.6fr 1.7fr': 'cols-06-17',
  '0.5fr 1.8fr': 'cols-05-18',
  '0.7fr 1.6fr': 'cols-07-16',
  '0.8fr 2fr': 'cols-08-2',
  '1fr 1fr': 'cols-1-1',
  '1.2fr 1fr 1fr': 'cols-12-1-1',
  '1.6fr 1.2fr': 'cols-16-12',
  '1.6fr 1fr 1.4fr': 'cols-16-1-14'
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
  for (const [ratio, cls] of Object.entries(gridMap)) {
    const escapedRatio = ratio.replace(/\./g, '\\.');
    const regex = new RegExp(`style="grid-template-columns:${escapedRatio};"`, 'g');
    body = body.replace(regex, `class="${cls}"`);
  }
  
  // Also handle grid-template-columns that appear split across lines
  body = body.replace(/style="grid-template-columns:\s*\n\s*([\d.]+fr\s+[\d.]+fr)\s*\n\s*"/g, (match, ratio) => {
    const trimmed = ratio.replace(/\s+/g, ' ').trim();
    for (const [r, c] of Object.entries(gridMap)) {
      if (r.replace(/\s+/g, ' ') === trimmed) {
        return `class="${c}"`;
      }
    }
    return match;
  });
  
  // Remove any remaining inline style attributes
  body = body.replace(/\s*style="[^"]*"/g, '');
  
  // Fix emoji callouts to StandardsHub callouts
  body = body.replace(/<div class="callout info">[^<]*✅/g, '<div class="callout suc callout--chip callout--flush">✅');
  body = body.replace(/<div class="callout warn">[^<]*⚠️/g, '<div class="callout warn callout--chip callout--flush">⚠️');
  body = body.replace(/<div class="callout danger">[^<]*🚫/g, '<div class="callout danger callout--chip callout--flush">🚫');
  body = body.replace(/<div class="callout suc">[^<]*✅/g, '<div class="callout suc callout--chip callout--flush">✅');
  
  // Build TOC items from section headers
  const tocItems = [];
  const sectionMatches = body.matchAll(/<div class="section-header" id="s(\d+)"><span class="num">(\d+)<\/span><h2>([^<]+)<\/h2><span class="line"><\/span><\/div>/g);
  for (const m of sectionMatches) {
    tocItems.push(`        { id: "s${m[1]}", label: "${m[1]}. ${m[2]}" }`);
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
