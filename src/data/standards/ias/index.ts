/**
 * IAS Standards Metadata Index
 * Exports all IAS standards metadata as a typed array
 */

import type { StandardMetadata } from "../types";

// Import all IAS metadata files
import ias1 from "./ias1.json";
import ias2 from "./ias2.json";
import ias3 from "./ias3.json";
import ias4 from "./ias4.json";
import ias5 from "./ias5.json";
import ias6 from "./ias6.json";
import ias7 from "./ias7.json";
import ias8 from "./ias8.json";
import ias10 from "./ias10.json";
import ias12 from "./ias12.json";
import ias16 from "./ias16.json";
import ias17 from "./ias17.json";
import ias19 from "./ias19.json";
import ias20 from "./ias20.json";
import ias21 from "./ias21.json";
import ias23 from "./ias23.json";
import ias24 from "./ias24.json";
import ias26 from "./ias26.json";
import ias27 from "./ias27.json";
import ias28 from "./ias28.json";
import ias29 from "./ias29.json";
import ias31 from "./ias31.json";
import ias32 from "./ias32.json";
import ias33 from "./ias33.json";
import ias34 from "./ias34.json";
import ias35 from "./ias35.json";
import ias36 from "./ias36.json";
import ias37 from "./ias37.json";
import ias38 from "./ias38.json";
import ias39 from "./ias39.json";
import ias40 from "./ias40.json";
import ias41 from "./ias41.json";

/**
 * Array of all IAS standards metadata
 * Sorted by the 'order' property for consistent display
 */
export const IASStandards: StandardMetadata[] = [
  ias1 as StandardMetadata,
  ias2 as StandardMetadata,
  ias3 as StandardMetadata,
  ias4 as StandardMetadata,
  ias5 as StandardMetadata,
  ias6 as StandardMetadata,
  ias7 as StandardMetadata,
  ias8 as StandardMetadata,
  ias10 as StandardMetadata,
  ias12 as StandardMetadata,
  ias16 as StandardMetadata,
  ias17 as StandardMetadata,
  ias19 as StandardMetadata,
  ias20 as StandardMetadata,
  ias21 as StandardMetadata,
  ias23 as StandardMetadata,
  ias24 as StandardMetadata,
  ias26 as StandardMetadata,
  ias27 as StandardMetadata,
  ias28 as StandardMetadata,
  ias29 as StandardMetadata,
  ias31 as StandardMetadata,
  ias32 as StandardMetadata,
  ias33 as StandardMetadata,
  ias34 as StandardMetadata,
  ias35 as StandardMetadata,
  ias36 as StandardMetadata,
  ias37 as StandardMetadata,
  ias38 as StandardMetadata,
  ias39 as StandardMetadata,
  ias40 as StandardMetadata,
  ias41 as StandardMetadata,
].sort((a, b) => (a.order || 999) - (b.order || 999));

/**
 * Helper function to find a standard by its code
 */
export function findIASStandardByCode(code: string): StandardMetadata | undefined {
  return IASStandards.find(standard => standard.code === code);
}

/**
 * Helper function to get standards by category
 */
export function getIASStandardsByCategory(category: string): StandardMetadata[] {
  return IASStandards.filter(standard => standard.category === category);
}

/**
 * Helper function to get all unique categories from IAS standards
 */
export function getIASCategories(): string[] {
  const categories = IASStandards
    .map(standard => standard.category)
    .filter((category): category is string => !!category);
  
  return [...new Set(categories)].sort();
}