/**
 * Taxonomy for StandardsHub
 * Approved categories for accounting standards classification
 */

export const Categories = [
  "Assets",
  "Liabilities",
  "Equity",
  "Revenue",
  "Expenses",
  "Financial Instruments",
  "Consolidation",
  "Disclosure",
  "Presentation",
  "Other"
] as const;

/**
 * Category type derived from Categories constant
 */
export type Category = typeof Categories[number];