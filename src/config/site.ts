export interface SiteConfig {
  /** Brand name appended to every page title, e.g. "StandardsHub". */
  name: string;
  /** Short positioning line used for the home title, e.g. "Accounting Standards Reference Library". */
  tagline: string;
  /** Default meta description used when a page does not supply its own. */
  description: string;
  /** Content for the meta author tag. */
  author: string;
  /** Canonical site base URL (no trailing slash), e.g. "https://standardshub.example". */
  url: string;
  /** Background colour for browser chrome (theme-color). */
  themeColor: string;
  /** Default robots directive applied to pages that do not override it. */
  defaultRobots: string;
  /** Value for the application-name meta tag. */
  applicationName: string;
}

export const SITE: SiteConfig = {
  name: "StandardsHub",
  tagline: "Accounting Standards Reference Library",
  description:
    "StandardsHub is a reference library for accounting standards, with clear, structured explanations of IAS, IFRS and Ind AS, worked examples and cross-standard links.",
  author: "StandardsHub",
  url: "",
  themeColor: "#ffffff",
  defaultRobots: "index, follow",
  applicationName: "StandardsHub",
};
