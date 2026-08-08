import fs from 'fs';
import path from 'path';

const posters = [
  'HGB238-241a_Buchfuehrungspflicht_Inventar_Extended_Poster.html',
  'HGB242-245_AllgemeineVorschriften_Jahresabschluss_Extended_Poster.html',
  'HGB246-251_Ansatzvorschriften_Extended_Poster.html',
  'HGB252-256a_Bewertungsvorschriften_Extended_Poster.html',
  'HGB257-263_Aufbewahrung_Vorlage_Extended_Poster.html',
  'HGB264-265_AllgemeineVorschriften_Kapitalgesellschaften_Extended_Poster.html',
  'HGB266-274a_Bilanz_Extended_Poster.html',
  'HGB275-278_GuV_Extended_Poster.html',
  'HGB284-288_Anhang_Extended_Poster.html',
  'HGB289-289f_Lagebericht_Extended_Poster.html',
  'HGB290-293_Konzernabschluss_Anwendungsbereich_Extended_Poster.html',
  'HGB294-296_Konsolidierungskreis_Extended_Poster.html',
  'HGB297-299_InhaltFormKonzernabschluss_Extended_Poster.html',
  'HGB300-307_Vollkonsolidierung_Extended_Poster.html',
  'HGB308-309_BewertungKonzernabschluss_Extended_Poster.html',
  'HGB310_AnteilmaessigeKonsolidierung_Extended_Poster.html',
  'HGB311-312_AssoziierteUnternehmen_Extended_Poster.html',
  'HGB313-314_Konzernanhang_Extended_Poster.html',
  'HGB315-315d_Konzernlagebericht_Extended_Poster.html',
  'HGB315e_KonzernabschlussIFRS_Extended_Poster.html',
  'HGB316-324a_Pruefung_Extended_Poster.html',
  'HGB325-329_Offenlegung_Extended_Poster.html',
  'HGB330_Verordnungsermaechtigung_Extended_Poster.html',
  'HGB331_UnrichtigeDarstellung_Extended_Poster.html',
  'HGB331a_UnrichtigeVersicherung_Extended_Poster.html',
  'HGB332_VerletzungBerichtspflicht_Extended_Poster.html',
  'HGB333_VerletzungGeheimhaltungspflicht_Extended_Poster.html',
  'HGB333a_PflichtenAbschlusspruefungen_Extended_Poster.html',
  'HGB334_Bussgeldvorschriften_Extended_Poster.html',
  'HGB335_FestsetzungOrdnungsgeld_Extended_Poster.html',
  'HGB335a_BeschwerdeOrdnungsgeld_Extended_Poster.html',
  'HGB335b_AnwendungOHGKG_Extended_Poster.html',
  'HGB335c_MitteilungenAPAS_Extended_Poster.html',
  'HGB336-339_ErgaenzendeVorschriftenGenossenschaften_Extended_Poster.html',
  'HGB340-340o_Kreditinstitute_Extended_Poster.html',
  'HGB341-341p_VersicherungsunternehmenPensionsfonds_Extended_Poster.html',
  'HGB341q-341y_ZahlungsberichtRohstoffsektor_Extended_Poster.html',
  'HGB342-342p_Ertragsteuerinformationsbericht_Extended_Poster.html',
  'HGB342q-342r_PrivatesRechnungslegungsgremium_Extended_Poster.html',
];

const mapping = {
  'HGB238-241a_Buchfuehrungspflicht_Inventar_Extended_Poster.html': 'hgb238-241a',
  'HGB242-245_AllgemeineVorschriften_Jahresabschluss_Extended_Poster.html': 'hgb242-245',
  'HGB246-251_Ansatzvorschriften_Extended_Poster.html': 'hgb246-251',
  'HGB252-256a_Bewertungsvorschriften_Extended_Poster.html': 'hgb252-256a',
  'HGB257-263_Aufbewahrung_Vorlage_Extended_Poster.html': 'hgb257-263',
  'HGB264-265_AllgemeineVorschriften_Kapitalgesellschaften_Extended_Poster.html': 'hgb264-265',
  'HGB266-274a_Bilanz_Extended_Poster.html': 'hgb266-274a',
  'HGB275-278_GuV_Extended_Poster.html': 'hgb275-278',
  'HGB284-288_Anhang_Extended_Poster.html': 'hgb284-288',
  'HGB289-289f_Lagebericht_Extended_Poster.html': 'hgb289-289f',
  'HGB290-293_Konzernabschluss_Anwendungsbereich_Extended_Poster.html': 'hgb290-293',
  'HGB294-296_Konsolidierungskreis_Extended_Poster.html': 'hgb294-296',
  'HGB297-299_InhaltFormKonzernabschluss_Extended_Poster.html': 'hgb297-299',
  'HGB300-307_Vollkonsolidierung_Extended_Poster.html': 'hgb300-307',
  'HGB308-309_BewertungKonzernabschluss_Extended_Poster.html': 'hgb308-309',
  'HGB310_AnteilmaessigeKonsolidierung_Extended_Poster.html': 'hgb310',
  'HGB311-312_AssoziierteUnternehmen_Extended_Poster.html': 'hgb311-312',
  'HGB313-314_Konzernanhang_Extended_Poster.html': 'hgb313-314',
  'HGB315-315d_Konzernlagebericht_Extended_Poster.html': 'hgb315-315d',
  'HGB315e_KonzernabschlussIFRS_Extended_Poster.html': 'hgb315e',
  'HGB316-324a_Pruefung_Extended_Poster.html': 'hgb316-324a',
  'HGB325-329_Offenlegung_Extended_Poster.html': 'hgb325-329',
  'HGB330_Verordnungsermaechtigung_Extended_Poster.html': 'hgb330',
  'HGB331_UnrichtigeDarstellung_Extended_Poster.html': 'hgb331',
  'HGB331a_UnrichtigeVersicherung_Extended_Poster.html': 'hgb331a',
  'HGB332_VerletzungBerichtspflicht_Extended_Poster.html': 'hgb332',
  'HGB333_VerletzungGeheimhaltungspflicht_Extended_Poster.html': 'hgb333',
  'HGB333a_PflichtenAbschlusspruefungen_Extended_Poster.html': 'hgb333a',
  'HGB334_Bussgeldvorschriften_Extended_Poster.html': 'hgb334',
  'HGB335_FestsetzungOrdnungsgeld_Extended_Poster.html': 'hgb335',
  'HGB335a_BeschwerdeOrdnungsgeld_Extended_Poster.html': 'hgb335a',
  'HGB335b_AnwendungOHGKG_Extended_Poster.html': 'hgb335b',
  'HGB335c_MitteilungenAPAS_Extended_Poster.html': 'hgb335c',
  'HGB336-339_ErgaenzendeVorschriftenGenossenschaften_Extended_Poster.html': 'hgb336-339',
  'HGB340-340o_Kreditinstitute_Extended_Poster.html': 'hgb340-340o',
  'HGB341-341p_VersicherungsunternehmenPensionsfonds_Extended_Poster.html': 'hgb341-341p',
  'HGB341q-341y_ZahlungsberichtRohstoffsektor_Extended_Poster.html': 'hgb341q-341y',
  'HGB342-342p_Ertragsteuerinformationsbericht_Extended_Poster.html': 'hgb342-342p',
  'HGB342q-342r_PrivatesRechnungslegungsgremium_Extended_Poster.html': 'hgb342q-342r',
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
  
  // Handle grid-template-columns split across lines
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
  
  // Fix duplicate class attributes (merge them)
  body = body.replace(/class="([^"]*)" class="([^"]*)"/g, 'class="$1 $2"');
  
  // Build TOC items from section headers - PROPERLY ESCAPE QUOTES
  const tocItems = [];
  const sectionMatches = body.matchAll(/<div class="section-header" id="s(\d+)"><span class="num">(\d+)<\/span><h2>([^<]+)<\/h2><span class="line"><\/span><\/div>/g);
  for (const m of sectionMatches) {
    let label = m[3];
    // Escape double quotes for JavaScript string
    label = label.replace(/"/g, '\\"');
    tocItems.push(`        { id: "s${m[1]}", label: "${label}" }`);
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
