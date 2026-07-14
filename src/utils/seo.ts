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

export function resolveSeo(input: SeoInput, pathname: string): ResolvedSeo {
  return {
    title: buildPageTitle(input.title),
    description: input.description ?? SITE.description,
    canonical: buildCanonical(input.canonical, pathname),
    robots: buildRobots(input.robots),
    ogType: buildOgType(input.ogType),
    ogImage: buildOgImage(input.ogImage),
    twitterCard: buildTwitterCard(input.twitterCard),
  };
}
