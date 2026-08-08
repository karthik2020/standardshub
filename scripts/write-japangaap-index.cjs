const fs = require("fs");

const content = `---
import StandardLayout from "../../layouts/StandardLayout.astro";
import StandardCard from "../../components/StandardCard.astro";
import { FRAMEWORK_CONFIG, getFramework } from "../../data/frameworks";
import standards from "../../data/standards.json";
import { palette } from "../../data/standardVisuals";

const framework = getFramework("japangaap")!;
---

<StandardLayout code={framework.code} title={framework.fullName} framework={framework.code}>
  <h1>{framework.fullName}</h1>

  <p class="category-description">
    {framework.description}
  </p>

  <div class="standards-group">
    <h2 class="standards-group-title">Japanese GAAP Standards</h2>
    <div class="standards-grid">
      {standards["japangaap"].map((item, index) => (
        <StandardCard
          href={item.url}
          code={item.code}
          title={item.title}
          framework="japangaap"
          theme={palette[index % palette.length]}
        />
      ))}
    </div>
  </div>
</StandardLayout>
`;

fs.writeFileSync("src/pages/japangaap/index.astro", content);
const data = fs.readFileSync("src/pages/japangaap/index.astro");
console.log("File written. Size:", data.length, "Null bytes:", [...data].filter((b) => b === 0).length);
