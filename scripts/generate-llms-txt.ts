import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

const projectRoot = process.cwd();
const markdownDir = join(projectRoot, "public", "markdown");

interface Framework {
  id: string;
  code: string;
  fullName: string;
}

const frameworks: Framework[] = [
  { id: "ias", code: "IAS", fullName: "International Accounting Standards" },
  { id: "ifrs", code: "IFRS", fullName: "International Financial Reporting Standards" },
  { id: "ipsas", code: "IPSAS", fullName: "International Public Sector Accounting Standards" },
  { id: "indas", code: "Ind AS", fullName: "Indian Accounting Standards" },
  { id: "ifrssustainability", code: "IFRS Sustainability", fullName: "IFRS Sustainability Disclosure Standards" },
  { id: "ifrspublications", code: "IFRS Publications", fullName: "IFRS Foundation Publications" },
  { id: "ifrsforsmes", code: "IFRS for SMEs", fullName: "IFRS for Small and Medium-sized Entities" },
  { id: "usgaap", code: "US GAAP", fullName: "U.S. Generally Accepted Accounting Principles" },
  { id: "ukgaap", code: "UK GAAP", fullName: "UK Generally Accepted Accounting Practice" },
  { id: "asbe", code: "ASBE", fullName: "Accounting Standards for Business Enterprises" },
  { id: "aspe", code: "ASPE", fullName: "Accounting Standards for Private Enterprises" },
  { id: "ifric", code: "IFRIC", fullName: "IFRIC Interpretations" },
  { id: "sic", code: "SIC", fullName: "SIC Interpretations" },
  { id: "asbj", code: "ASBJ", fullName: "Accounting Standards Board of Japan" },
  { id: "hgb", code: "HGB", fullName: "Handelsgesetzbuch (German Commercial Code)" },
  { id: "drs", code: "DRS", fullName: "Deutsche Rechnungslegungsstandards" },
];

const lines: string[] = [];
lines.push("# StandardsHub - LLM-Friendly Content Index");
lines.push("");
lines.push("This file lists all markdown representations of accounting standards available on StandardsHub.");
lines.push("Agents can request these pages with `Accept: text/markdown` header.");
lines.push("");
lines.push("## Frameworks");
lines.push("");

for (const fw of frameworks) {
  const fwDir = join(markdownDir, fw.id);
  let count = 0;
  try {
    const files = readdirSync(fwDir);
    count = files.filter((f) => f.endsWith(".md")).length;
  } catch {
    count = 0;
  }
  lines.push(`- ${fw.code} - ${fw.fullName} (${count} standards)`);
}

lines.push("");
lines.push("## Usage");
lines.push("");
lines.push("To fetch a markdown version of any page:");
lines.push("");
lines.push("```bash");
lines.push("curl -H \"Accept: text/markdown\" https://standardshub.in/usgaap/asc105");
lines.push("```");
lines.push("");
lines.push("Or access the static markdown files directly:");
lines.push("");
lines.push("```");
lines.push("https://standardshub.in/markdown/usgaap/asc105.md");
lines.push("https://standardshub.in/markdown/ias/ias1.md");
lines.push("```");
lines.push("");

writeFileSync(join(projectRoot, "public", "llms.txt"), lines.join("\n"));
console.log("Generated llms.txt");
