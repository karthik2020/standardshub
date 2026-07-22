import { SITE } from "../config/site";

export interface SeoInput {
  /** Page-specific title shown before " | {site name}". Omit for the home page. */
  title?: string;
  /** Page-specific meta description. Falls back to the site default. */
  description?: string;
  /** Absolute or root-relative canonical URL. Falls back to the current path. */
  canonical?: string;
  /** Robots directive. Falls back to the site default. */
  robots?: string;
  /** Open Graph type. Falls back to the site default ("website"). */
  ogType?: string;
  /** Root-relative Open Graph image path. Falls back to the site default image. */
  ogImage?: string;
  /** Twitter/X card type. Falls back to the site default ("summary_large_image"). */
  twitterCard?: string;
  /** Standard page context used to auto-generate the description. Only supplied for standard pages. */
  standard?: { code: string; title: string; dateModified?: string };
}

export interface ResolvedSeo {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  ogType: string;
  ogImage: string;
  twitterCard: string;
}

/** Structured-data schema applied to a page. `null` means no JSON-LD is emitted. */
export type SeoPageType = "website" | "collection" | "article" | null;

/**
 * Builds the full document title.
 *
 * Home (no title):      "StandardsHub | Accounting Standards Reference Library"
 * Every other page:     "{title} | StandardsHub"
 */
export function buildPageTitle(title?: string): string {
  if (!title) {
    return `${SITE.name} | ${SITE.tagline}`;
  }
  return `${title} | ${SITE.name}`;
}

/**
 * Resolves the canonical URL.
 *
 * Uses an explicit value when supplied, otherwise derives it from the site
 * base URL plus the current path, or falls back to the path alone when no
 * base URL is configured yet.
 */
export function buildCanonical(canonical: string | undefined, pathname: string): string {
  if (canonical) {
    return canonical;
  }
  if (SITE.url) {
    return new URL(pathname, SITE.url).toString();
  }
  return pathname;
}

export function buildRobots(robots?: string): string {
  return robots ?? SITE.defaultRobots;
}

export function buildOgType(ogType?: string): string {
  return ogType ?? SITE.ogType;
}

/**
 * Resolves the absolute Open Graph image URL.
 *
 * Uses an explicit (root-relative) path when supplied, otherwise the site
 * default image. The URL is made absolute against the configured site base
 * URL so social crawlers receive a fully-qualified address.
 */
export function buildOgImage(ogImage: string | undefined): string {
  const image = ogImage ?? SITE.ogImage;
  return new URL(image, SITE.url).toString();
}

export function buildTwitterCard(twitterCard?: string): string {
  return twitterCard ?? SITE.twitterCard;
}

/**
 * Builds the auto-generated description for a standard page.
 *
 * Format: "Learn {code} {title} with simplified notes, key concepts, examples and exam-focused summaries."
 */
export function generateStandardDescription(code: string, title: string): string {
  return `Learn ${code} ${title} with simplified notes, key concepts, examples and exam-focused summaries.`;
}

/**
 * Resolves the meta description.
 *
 * Priority:
 *   1. An explicit (manual) description, used exactly as supplied.
 *   2. An auto-generated description for standard pages (when a standard context is present).
 *   3. The site-wide default description for every other page.
 */
export function buildDescription(input: SeoInput): string {
  if (input.description) {
    return input.description;
  }
  if (input.standard) {
    return generateStandardDescription(input.standard.code, input.standard.title);
  }
  return SITE.description;
}

export function resolveSeo(input: SeoInput, pathname: string): ResolvedSeo {
  return {
    title: buildPageTitle(input.title),
    description: buildDescription(input),
    canonical: buildCanonical(input.canonical, pathname),
    robots: buildRobots(input.robots),
    ogType: buildOgType(input.ogType),
    ogImage: buildOgImage(input.ogImage),
    twitterCard: buildTwitterCard(input.twitterCard),
  };
}

/**
 * Determines which structured-data schema a page should use, derived entirely
 * from signals the layouts already supply — no page-specific JSON-LD logic.
 *
 *   - Standard pages (a `standard` context is present)         → "article"
 *   - The home page (code "Home", framework "home")            → "website"
 *   - Framework landing pages (code === framework)             → "collection"
 *   - The 404 page (code "404") and everything else            → null (no JSON-LD)
 */
export function detectSeoType(input: {
  code?: string;
  framework?: string;
  standard?: SeoInput["standard"];
  hideFramework?: boolean;
}): SeoPageType {
  if (input.standard) {
    return "article";
  }
  if (input.code?.toLowerCase() === "404") {
    return null;
  }
  if (input.code?.toLowerCase() === "home") {
    return "website";
  }
  if (
    input.code &&
    input.framework &&
    input.code.toLowerCase() === input.framework.toLowerCase()
  ) {
    return "collection";
  }
  return null;
}

/**
 * Builds the JSON-LD structured-data object for a page, reusing the resolved
 * title, description, canonical URL and Open Graph image. Returns `null` when a
 * page should not emit structured data (e.g. 404).
 */
export function buildJsonLd(type: SeoPageType, seo: ResolvedSeo, standard?: SeoInput["standard"]): object | null {
  if (!type) {
    return null;
  }

  const publisher = {
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
  };

  if (type === "website") {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE.name,
      url: seo.canonical,
      description: seo.description,
      publisher,
    };
  }

  if (type === "collection") {
    return {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: seo.title,
      description: seo.description,
      url: seo.canonical,
      mainEntity: {
        "@type": "ItemList",
        name: "Accounting Standards",
        description: "A collection of accounting standards.",
      },
    };
  }

  const article: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: seo.title,
    description: seo.description,
    url: seo.canonical,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": seo.canonical,
    },
    author: {
      "@type": "Organization",
      name: SITE.author,
    },
    publisher,
    image: seo.ogImage,
    inLanguage: "en",
  };

  if (standard?.dateModified) {
    article.dateModified = standard.dateModified;
  }

  return article;
}
