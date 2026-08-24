import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..", "..", "..");
const fallbackRoot = process.cwd();
const root = (() => {
  try {
    if (readFileSync(join(__dirname, "..", "..", "..", "package.json"), "utf-8")) {
      return join(__dirname, "..", "..", "..");
    }
  } catch {
    // fallback to cwd
  }
  return fallbackRoot;
})();

interface Standard {
  code: string;
  title: string;
  url: string;
  category?: string;
  status?: string;
}

function safe(v: any): string {
  return typeof v === "string" ? v : "";
}

function standardToMarkdown(standard: Standard, metadata: any, framework: string): string {
  const lines: string[] = [];

  lines.push("---");
  lines.push(`title: "${safe(metadata.title || standard.title)}"`);
  lines.push(`description: "${safe(metadata.summary || metadata.description || "")}"`);
  lines.push(`code: "${safe(standard.code)}"`);
  lines.push(`framework: "${safe(framework)}"`);
  lines.push(`url: "${safe(standard.url)}"`);
  if (metadata.issued) lines.push(`issued: "${safe(metadata.issued)}"`);
  if (metadata.latestAmendment) lines.push(`latestAmendment: "${safe(metadata.latestAmendment)}"`);
  if (metadata.status) lines.push(`status: "${safe(metadata.status)}"`);
  if (metadata.category) lines.push(`category: "${safe(metadata.category)}"`);
  lines.push("---");
  lines.push("");

  lines.push(`# ${safe(metadata.title || standard.title)}`);
  lines.push("");

  if (metadata.summary) {
    lines.push(metadata.summary);
    lines.push("");
  }

  if (metadata.description) {
    lines.push(metadata.description);
    lines.push("");
  }

  if (standard.status) {
    lines.push(`**Status:** ${standard.status}`);
    lines.push("");
  }

  if (metadata.issued) {
    lines.push(`**Issued:** ${metadata.issued}`);
    lines.push("");
  }

  if (metadata.latestAmendment) {
    lines.push(`**Latest Amendment:** ${metadata.latestAmendment}`);
    lines.push("");
  }

  if (metadata.effective) {
    lines.push(`**Effective:** ${metadata.effective}`);
    lines.push("");
  }

  if (metadata.covers && metadata.covers.length > 0) {
    lines.push("## Covered Sections");
    lines.push("");
    metadata.covers.forEach((c: string) => {
      lines.push(`- ${c}`);
    });
    lines.push("");
  }

  if (metadata.history) {
    lines.push("## History & Development");
    lines.push("");
    lines.push(`History identifier: \`${safe(metadata.history)}\``);
    lines.push("");
  }

  if (metadata.bannerNotice) {
    lines.push("## Notice");
    lines.push("");
    lines.push(`**${safe(metadata.bannerNotice.variant)}:** ${safe(metadata.bannerNotice.title)}`);
    lines.push("");
    lines.push(metadata.bannerNotice.body);
    lines.push("");
  }

  return lines.join("\n");
}

const standardsPath = join(root, "src", "data", "standards.json");
const standards = JSON.parse(readFileSync(standardsPath, "utf-8")) as Record<string, Standard[]>;
const outputDir = join(root, "public", "markdown");

const frameworks: Record<string, string> = {
  ias: "IAS",
  ifrs: "IFRS",
  indas: "IndAS",
  ifrssustainability: "IFRSSustainability",
  ifrspublications: "IFRSPublications",
  ifrsforsmes: "IFRSForSMEs",
  usgaap: "USGAAP",
  ukgaap: "UKGAAP",
  asbe: "ASBE",
  aspe: "ASPE",
  ifric: "IFRIC",
  sic: "SIC",
  asbj: "ASBJ",
  hgb: "HGB",
  drs: "DRS",
  ipsas: "IPSAS",
};

let count = 0;

for (const [fwId, fwName] of Object.entries(frameworks)) {
  const list = standards[fwName] || [];
  for (const standard of list) {
    let metadata: any = {};
    try {
      const metaPath = join(root, "src", "data", "standards", fwId, `${standard.url.split("/").pop()}.json`);
      metadata = JSON.parse(readFileSync(metaPath, "utf-8"));
    } catch {
      // metadata file not found
    }

    const markdown = standardToMarkdown(standard, metadata, fwName);
    const tokenCount = Math.ceil(markdown.length / 4);

    const outputPath = join(outputDir, fwId, `${standard.url.split("/").pop()}.md`);
    mkdirSync(join(outputPath, ".."), { recursive: true });
    writeFileSync(outputPath, markdown + "\n");
    count++;
  }
}

console.log(`Generated ${count} markdown files in ${outputDir}`);
