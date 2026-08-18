/**
 * Framework-level configuration.
 *
 * This is the single source of truth for framework metadata.
 * All framework display names, descriptions, routes, colours, and icons
 * should be derived from this file.
 */

export interface FrameworkConfig {
  /** Lowercase identifier used in CSS classes and data attributes. */
  id: string;
  /** Framework code (e.g. "IAS", "IFRS", "Ind AS"). */
  code: string;
  /** Short display name (e.g. "IAS"). */
  displayName: string;
  /** Full framework name (e.g. "International Accounting Standards"). */
  fullName: string;
  /** Landing page description. */
  description: string;
  /** Route path (e.g. "/ias"). */
  route: string;
  /** Primary brand colour. */
  primary: string;
  /** Light background colour. */
  light: string;
  /** Soft background colour. */
  soft: string;
  /** Dark text/icon colour. */
  dark: string;
  /** Lucide icon name for sidebar and headers. */
  lucideIcon: string;
  /** Font Awesome icon name for framework badges and cards. */
  faIcon: string;
  /** ASC Codification categories (US GAAP only). */
  categories?: readonly string[];
  /** Framework status. */
  status: "active" | "planned" | "historical";
}

export const FRAMEWORK_CONFIG: Record<string, FrameworkConfig> = {
  ias: {
    id: "ias",
    code: "IAS",
    displayName: "IAS",
    fullName: "International Accounting Standards",
    description:
      "International Accounting Standards (IAS) are a set of accounting principles issued by the IASB, covering topics such as revenue recognition, inventory valuation, and financial statement presentation.",
    route: "/ias",
    primary: "#2563EB",
    light: "#DBEAFE",
    soft: "#EFF6FF",
    dark: "#1E40AF",
    lucideIcon: "BookText",
    faIcon: "book-open",
    status: "active",
  },
  ifrs: {
    id: "ifrs",
    code: "IFRS",
    displayName: "IFRS",
    fullName: "International Financial Reporting Standards",
    description:
      "International Financial Reporting Standards (IFRS) are issued by the IFRS Foundation and include standards that converged with or replaced IAS, providing a global framework for financial reporting.",
    route: "/ifrs",
    primary: "#16A34A",
    light: "#DCFCE7",
    soft: "#F0FDF4",
    dark: "#166534",
    lucideIcon: "LibraryBig",
    faIcon: "globe",
    status: "active",
  },
  ipsas: {
    id: "ipsas",
    code: "IPSAS",
    displayName: "IPSAS",
    fullName: "International Public Sector Accounting Standards",
    description:
      "International Public Sector Accounting Standards (IPSAS) are accrual-basis financial reporting standards for public sector entities, issued by the International Public Sector Accounting Standards Board (IPSASB). They cover topics including financial statement presentation, property, plant and equipment, leases, financial instruments, employee benefits, revenue, leases, and public sector combinations.",
    route: "/ipsas",
    primary: "#0D9488",
    light: "#99F6E4",
    soft: "#CCFBF1",
    dark: "#115E59",
    lucideIcon: "BookText",
    faIcon: "book-open",
    categories: [
      "IPSAS Standards",
      "Cash Basis IPSAS",
      "RPG — Recommended Practice Guidelines",
      "SRS — Sustainability Reporting Standards",
      "Conceptual Framework",
      "Supporting / Reference Material",
    ],
    status: "active",
  },
   indas: {
    id: "indas",
    code: "Ind AS",
    displayName: "Ind AS",
    fullName: "Indian Accounting Standards",
    description:
      "Indian Accounting Standards (Ind AS) are converged with IFRS and issued by the Ministry of Corporate Affairs, aligning Indian financial reporting with international standards.",
    route: "/indas",
    primary: "#EA580C",
    light: "#FED7AA",
    soft: "#FFF7ED",
    dark: "#9A3412",
    lucideIcon: "Files",
    faIcon: "flag",
    status: "active",
  },
  ifrssustainability: {
    id: "ifrssustainability",
    code: "IFRS Sustainability",
    displayName: "IFRS Sustainability",
    fullName: "IFRS Sustainability Disclosure Standards",
    description:
      "IFRS Sustainability Disclosure Standards are issued by the International Sustainability Standards Board (ISSB) to provide a global baseline for sustainability-related financial disclosures.",
    route: "/ifrs/ifrssustainability",
    primary: "#16A34A",
    light: "#DCFCE7",
    soft: "#F0FDF4",
    dark: "#166534",
    lucideIcon: "Leaf",
    faIcon: "leaf",
    status: "active",
  },
  ifrspublications: {
    id: "ifrspublications",
    code: "IFRS Publications",
    displayName: "IFRS Publications",
    fullName: "IFRS Foundation Publications",
    description:
      "IFRS Foundation publications include the Conceptual Framework, Preface to IFRS Standards, IFRS Practice Statements, and the IFRS for SMEs Standard.",
    route: "/ifrs/ifrspublications",
    primary: "#16A34A",
    light: "#DCFCE7",
    soft: "#F0FDF4",
    dark: "#166534",
    lucideIcon: "BookOpen",
    faIcon: "book-open",
    status: "active",
  },
  ifrsforsmes: {
    id: "ifrsforsmes",
    code: "IFRS for SMEs",
    displayName: "IFRS for SMEs",
    fullName: "IFRS for Small and Medium-sized Entities",
    description:
      "The IFRS for SMEs Standard is a self-contained, simplified accounting standard developed by the IASB for entities without public accountability.",
    route: "/ifrs/ifrsforsmes",
    primary: "#16A34A",
    light: "#DCFCE7",
    soft: "#F0FDF4",
    dark: "#166534",
    lucideIcon: "Building2",
    faIcon: "building",
    status: "active",
  },
   usgaap: {
      id: "usgaap",
      code: "US GAAP",
      displayName: "US GAAP",
      fullName: "U.S. Generally Accepted Accounting Principles",
      description:
        "U.S. Generally Accepted Accounting Principles (US GAAP) are the accounting standards issued by the FASB for nongovernmental entities in the United States, organised within the FASB Accounting Standards Codification.",
      route: "/usgaap",
      primary: "#8E44AD",
      light: "#FAF5FF",
      soft: "#F3E8FF",
      dark: "#6D28D9",
      lucideIcon: "BookText",
      faIcon: "book-open",
      categories: [
        "General Principles",
        "Presentation",
        "Assets",
        "Liabilities",
        "Equity",
        "Revenue",
        "Expenses",
        "Broad Transactions",
        "Agriculture",
        "Airlines",
        "Contractors",
        "Development Stage Entities",
        "Entertainment",
        "Extractive Activities",
        "Financial Services",
        "Franchisors",
        "Health Care Entities",
        "Not-for-Profit Entities",
        "Plan Accounting",
        "Real Estate",
        "Regulated Operations",
        "Software",
        "U.S. Steamship Entities"
      ],
      status: "active",
    },
   ukgaap: {
      id: "ukgaap",
      code: "UK GAAP",
      displayName: "UK GAAP",
      fullName: "UK Generally Accepted Accounting Practice",
      description:
        "UK Generally Accepted Accounting Practice (UK GAAP) comprises the financial reporting standards applicable in the United Kingdom and Republic of Ireland, including FRS 100–105 and SORPs.",
      route: "/ukgaap",
      primary: "#0891B2",
      light: "#CFFAFE",
      soft: "#CFFAFE",
      dark: "#0E7490",
      lucideIcon: "Landmark",
      faIcon: "landmark",
      categories: [
        "Framework",
        "Standards",
        "SORPs",
      ],
      status: "active",
    },
   asbe: {
      id: "asbe",
      code: "ASBE",
      displayName: "ASBE",
      fullName: "Accounting Standards for Business Enterprises",
      description:
        "Accounting Standards for Business Enterprises (ASBE) are the Chinese accounting standards issued by the Ministry of Finance, covering topics such as inventories, fixed assets, revenue, and financial instruments.",
      route: "/asbe",
      primary: "#EC4899",
      light: "#FCE7F3",
      soft: "#FBCFE8",
      dark: "#9D174D",
      lucideIcon: "Landmark",
      faIcon: "landmark",
      categories: [
        "Framework",
        "Standards",
        "Small Business",
      ],
      status: "active",
    },
   aspe: {
      id: "aspe",
      code: "ASPE",
      displayName: "ASPE",
      fullName: "Accounting Standards for Private Enterprises",
      description:
        "Accounting Standards for Private Enterprises (ASPE) are the Canadian accounting standards for private enterprises, covering topics such as financial statement concepts, inventories, property plant equipment, revenue, and financial instruments.",
      route: "/aspe",
      primary: "#c41230",
      light: "#FEE2E2",
      soft: "#FECACA",
      dark: "#7F1D1D",
      lucideIcon: "Landmark",
      faIcon: "landmark",
      categories: [
        "General Standards",
        "Assets",
        "Liabilities, Equity, Revenue & Other",
        "Accounting Guidelines",
      ],
      status: "active",
    },
  ifric: {
    id: "ifric",
    code: "IFRIC",
    displayName: "IFRIC",
    fullName: "IFRIC Interpretations",
    description:
      "IFRIC Interpretations are issued by the IFRS Interpretations Committee to provide guidance on applying IFRS Accounting Standards, addressing specific accounting issues not explicitly covered by the standards themselves.",
    route: "/ifrs/ifric",
    primary: "#16A34A",
    light: "#DCFCE7",
    soft: "#F0FDF4",
    dark: "#166534",
    lucideIcon: "ScrollText",
    faIcon: "scroll",
    status: "active",
  },
   sic: {
     id: "sic",
     code: "SIC",
     displayName: "SIC",
     fullName: "SIC Interpretations",
     description:
       "SIC Interpretations were issued by the Standing Interpretations Committee and address specific accounting issues not explicitly covered by IAS Standards.",
     route: "/ifrs/sic",
    primary: "#16A34A",
    light: "#DCFCE7",
    soft: "#F0FDF4",
    dark: "#166534",
    lucideIcon: "ScrollText",
    faIcon: "scroll",
    status: "active",
  },
   asbj: {
    id: "asbj",
    code: "ASBJ",
    displayName: "ASBJ",
    fullName: "Accounting Standards Board of Japan",
    description:
      "Japanese Generally Accepted Accounting Principles (Japan GAAP) comprise the financial reporting standards issued by the Accounting Standards Board of Japan (ASBJ), covering topics such as financial instruments, revenue, leases, and business combinations.",
    route: "/asbj",
    primary: "#394931",
    light: "#d4d0b9",
    soft: "#afb59d",
    dark: "#90997f",
    lucideIcon: "Landmark",
    faIcon: "landmark",
    categories: [
      "ASBJ Statements",
      "JMIS Standards",
      "Implementation Guidance",
      "Practical Solutions",
    ],
    status: "active",
  },
  hgb: {
    id: "hgb",
    code: "HGB",
    displayName: "HGB",
    fullName: "Handelsgesetzbuch (German Commercial Code)",
    description:
      "The Handelsgesetzbuch (HGB) is the German Commercial Code, containing the legal framework for accounting and financial reporting in Germany.",
    route: "/hgb",
    primary: "#B58900",
    light: "#FCF8EA",
    soft: "#F4E7B0",
    dark: "#8A6800",
    lucideIcon: "Landmark",
    faIcon: "landmark",
    status: "active",
  },
  drs: {
    id: "drs",
    code: "DRS",
    displayName: "DRS",
    fullName: "Deutsche Rechnungslegungsstandards (German Accounting Standards)",
    description:
      "Deutsche Rechnungslegungsstandards (DRS) are the German Accounting Standards issued by the Accounting Standards Committee of Germany (DRSC).",
    route: "/germany/drs",
    primary: "#B58900",
    light: "#FCF8EA",
    soft: "#F4E7B0",
    dark: "#8A6800",
    lucideIcon: "Landmark",
    faIcon: "landmark",
    status: "active",
  },
};

export const FRAMEWORK_ORDER = ["ias", "ifrs", "ipsas", "indas", "usgaap", "ukgaap", "asbe", "aspe", "asbj", "hgb"] as const;

export type FrameworkId = keyof typeof FRAMEWORK_CONFIG;

export function getFramework(id: string): FrameworkConfig | undefined {
  const normalized = id.toLowerCase().replace(/\s+/g, "");
  return FRAMEWORK_CONFIG[normalized];
}

export function getFrameworkByCode(code: string): FrameworkConfig | undefined {
  return Object.values(FRAMEWORK_CONFIG).find((f) => f.code === code);
}
