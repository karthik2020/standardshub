/**
 * Accounting framework.
 */
export type Framework = "IAS" | "IFRS" | "Ind AS" | "IFRS Sustainability" | "IFRS Publications" | "IFRS for SMEs" | "US GAAP" | "UK GAAP" | "ASBE" | "ASPE" | "IFRIC" | "SIC";

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

  /** Date associated with a lifecycle event */
  eventDate?: string;

  /** Target standard code for a lifecycle transition */
  transitionTo?: string;

  /** History identifier */
  history: string;

  /** One-line summary */
  summary: string;

  /**
   * Optional semantic banner shown directly below the Hero on the standard page.
   * The component maps the variant to its icon, colour, stripe and typography;
   * pages only declare the variant, title and body.
   */
  bannerNotice?: {
    variant: "success" | "warning" | "danger" | "info";
    title: string;
    body: string;
    /**
     * Optional, generic call-to-action footer. When present, the banner
     * renders a full-row link with an uppercase `label` heading (e.g.
     * "Current Standard", "Replaced By", "See Also", "Read Next") above a
     * "{code} — {title} →" row linking to `href`. Omitted entirely when absent.
     * Generic by design so future scenarios need only new metadata, not
     * component changes.
     */
    action?: {
      label: string;
      code: string;
      title: string;
      href: string;
    };
  };
}