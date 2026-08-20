const fs = require("fs");

const content = `---
import StandardPageLayout from "../../layouts/StandardPageLayout.astro";
import PageToc from "../../components/PageToc.astro";
import "../../styles/standards-poster.css";
import "../../styles/extended.css";
import metadata from "../../data/standards/japangaap/asbj01.json";
---

<StandardPageLayout
  code={metadata.code}
  standardType={metadata.framework}
  title={metadata.title}
  description={metadata.summary}
  issued={metadata.issued}
  latestAmendment={metadata.latestAmendment}
  status={metadata.status}
  summary={metadata.summary}
  bannerNotice={metadata.bannerNotice}
>
  <Fragment slot="toc">
    <PageToc
      items={[
        { id: "s1", label: "Conceptual Framework Linkage" },
        { id: "s2", label: "Scope & Applicability" },
        { id: "s3", label: "Presentation Requirements" },
        { id: "s4", label: "Disclosure Requirements" },
        { id: "s5", label: "Critical Judgments & Estimates" },
        { id: "s6", label: "J-GAAP vs IFRS - Full Comparison" },
        { id: "s7", label: "Statement Mapping" },
        { id: "s8", label: "Related Standards" }
      ]}
    />
  </Fragment>
  <div class="wrap">

    <div class="section-header" id="s1"><span class="num">1</span><h2>Conceptual Framework Linkage</h2><span class="line"></span></div>
    <div class="grid">
      <div class="card ci"><div class="ctitle ci">The foundation of Japanese GAAP financial presentation</div>
        <div class="principle">ASBJ Statement No. 1 establishes the framework for the preparation and presentation of financial statements under J-GAAP, setting out the overall requirements for financial position, performance, and cash flow information.</div>
        <div class="elabel">KEY CONCEPTS</div>
        <div class="check-list"><span><strong>Going concern</strong> - financial statements are prepared on a going concern basis unless management intends to liquidate the entity</span><span><strong>Accrual basis</strong> - transactions are recognised when they occur, not when cash is received or paid</span><span><strong>Materiality</strong> - information is material if its omission or misstatement could influence economic decisions</span></div>
      </div>
      <div class="card cs"><div class="ctitle cs">The core presentation objective</div>
        <div class="formula-box"><div class="f-eq">Financial statements provide information about: assets, liabilities, equity, income, expenses, and cash flows</div></div>
        <div class="callout info">ASBJ Statement No. 1 is broadly converged with IAS 1, with minor Japanese-specific presentation adaptations.</div>
      </div>
    </div>

    <div class="section-header" id="s2"><span class="num">2</span><h2>Scope &amp; Applicability</h2><span class="line"></span></div>
    <div class="grid">
      <div class="card cw span2"><div class="ctitle cw">Who must apply this standard</div>
        <div class="text-supporting">ASBJ Statement No. 1 applies to all entities preparing financial statements under J-GAAP, unless specific exemptions apply. It sets the overall framework within which more specific standards operate.</div>
      </div>
    </div>

    <div class="section-header" id="s3"><span class="num">3</span><h2>Presentation Requirements</h2><span class="line"></span></div>
    <div class="grid"><div class="card cd span2"><div class="ctitle cd">The mandatory statement set</div>
      <div class="td-table"><div class="th cols-16-12"><span>Statement</span><span>Purpose</span></div>
        <div class="tr cols-16-12"><span>Balance Sheet</span><span>Shows financial position at a point in time</span></div>
        <div class="tr alt cols-16-12"><span>Income Statement</span><span>Shows performance over a period</span></div>
        <div class="tr cols-16-12"><span>Cash Flow Statement</span><span>Shows cash generation and use</span></div>
        <div class="tr alt cols-16-12"><span>Statement of Changes in Equity</span><span>Shows movements in equity</span></div>
      </div>
    </div></div>

    <div class="section-header" id="s4"><span class="num">4</span><h2>Disclosure Requirements</h2><span class="line"></span></div>
    <div class="grid"><div class="card ci span2"><div class="ctitle ci">Key disclosures</div>
      <div class="text-supporting">Significant accounting policies must be disclosed, including measurement bases and estimation techniques. Comparative information must be presented for the preceding period.</div>
    </div></div>

    <div class="section-header" id="s5"><span class="num">5</span><h2>Critical Judgments &amp; Estimates</h2><span class="line"></span></div>
    <div class="grid"><div class="card cw span2"><div class="ctitle cw">Where management judgement matters</div>
      <div class="text-supporting">Management must exercise judgement in applying accounting policies, particularly in areas involving estimates, going concern assessments, and materiality determinations.</div>
    </div></div>

    <div class="section-header" id="s6"><span class="num">6</span><h2>J-GAAP vs IFRS - Full Comparison</h2><span class="line"></span></div>
    <div class="grid"><div class="card cs span2"><div class="ctitle cs">Comparison with IAS 1</div>
      <div class="td-table"><div class="th cols-12-1-1"><span>Feature</span><span>J-GAAP</span><span>IAS 1</span></div>
        <div class="tr cols-12-1-1"><span>Statement of financial position</span><span>Balance Sheet</span><span>Statement of financial position</span></div>
        <div class="tr alt cols-12-1-1"><span>Statement of profit or loss</span><span>Income Statement</span><span>Statement of profit or loss</span></div>
      </div>
    </div></div>

    <div class="section-header" id="s7"><span class="num">7</span><h2>Statement Mapping</h2><span class="line"></span></div>
    <div class="grid"><div class="card cd span2"><div class="ctitle cd">Where every ASBJ 1 adjustment lands</div>
      <div class="td-table"><div class="th cols-16-1-14"><span>Item</span><span>Statement(s) affected</span><span>Notes</span></div>
        <div class="tr cols-16-1-14"><span>Presentation framework compliance</span><span><span class="badge bs">Balance Sheet</span> <span class="badge bp">Income Statement</span></span><span>Cross-cutting requirement</span></div>
      </div>
    </div></div>

    <div class="section-header" id="s8"><span class="num">8</span><h2>Related Standards</h2><span class="line"></span></div>
    <div class="grid">
      <div class="card cw"><div class="ctitle cw">Cross-reference map</div>
        <div class="td-table"><div class="th cols-08-2"><span>Standard</span><span>Connection</span></div>
          <div class="tr cols-08-2"><span>IAS 1</span><span>The international equivalent standard</span></div>
          <div class="tr alt cols-08-2"><span>ASBJ Statement No. 2</span><span>Builds on the presentation framework</span></div>
        </div>
      </div>
    </div>

  </div>
</StandardPageLayout>
`;

fs.writeFileSync("src/pages/japangaap/asbj01.astro", content);
const data = fs.readFileSync("src/pages/japangaap/asbj01.astro");
console.log("File written. Size:", data.length, "Null bytes:", [...data].filter((b) => b === 0).length);
