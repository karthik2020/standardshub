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
    route: "/ifrssustainability",
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
    route: "/ifrspublications",
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
    route: "/ifrsforsmes",
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
      primary: "#0F172A",
      light: "#F8FAFC",
      soft: "#F1F5F9",
      dark: "#1E293B",
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
        "Industry",
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
    route: "/ifric",
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
    route: "/sic",
    primary: "#16A34A",
    light: "#DCFCE7",
    soft: "#F0FDF4",
    dark: "#166534",
    lucideIcon: "ScrollText",
    faIcon: "scroll",
    status: "active",
  },
};

export const FRAMEWORK_ORDER = ["ias", "ifrs", "indas", "ifrssustainability", "ifrspublications", "ifrsforsmes", "usgaap", "ifric", "sic"] as const;

export type FrameworkId = keyof typeof FRAMEWORK_CONFIG;

export function getFramework(id: string): FrameworkConfig | undefined {
  const normalized = id.toLowerCase().replace(/\s+/g, "");
  return FRAMEWORK_CONFIG[normalized];
}

export function getFrameworkByCode(code: string): FrameworkConfig | undefined {
  return Object.values(FRAMEWORK_CONFIG).find((f) => f.code === code);
}
