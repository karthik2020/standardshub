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
};

export const FRAMEWORK_ORDER = ["ias", "ifrs", "indas"] as const;

export type FrameworkId = keyof typeof FRAMEWORK_CONFIG;

export function getFramework(id: string): FrameworkConfig | undefined {
  const normalized = id.toLowerCase().replace(/\s+/g, "");
  return FRAMEWORK_CONFIG[normalized];
}

export function getFrameworkByCode(code: string): FrameworkConfig | undefined {
  return Object.values(FRAMEWORK_CONFIG).find((f) => f.code === code);
}
