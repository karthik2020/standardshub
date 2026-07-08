/**
 * Accounting framework.
 */
export type Framework = "IAS" | "IFRS" | "Ind AS";

/**
 * Current lifecycle status of a standard.
 */
export type StandardStatus =
  | "Active"
  | "Upcoming"
  | "Superseded"
  | "Withdrawn"
  | "Exposure Draft";

/**
 * Metadata shared by all accounting standards.
 */
export interface StandardMetadata {
  /** Standard code (e.g. IAS 16, IFRS 15) */
  code: string;

  /** Display order */
  order: number;

  /** Standard title */
  title: string;

  /** URL slug */
  slug: string;

  /** Relative URL */
  url: string;

  /** IAS / IFRS / Ind AS */
  framework: Framework;

  /** Classification */
  category: string;

  /** Original issue date */
  issued: string;

  /** Latest amendment date */
  latestAmendment: string;

  /** Effective date */
  effective: string;

  /** Current lifecycle status */
  status: StandardStatus;

  /** History identifier */
  history: string;

  /** One-line summary */
  summary: string;
}