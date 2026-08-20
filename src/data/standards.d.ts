/**
 * Type declarations for StandardsHub data files.
 */

export interface StandardSummary {
  code: string;
  title: string;
  url: string;
  category: string;
  status?: string;
  aliases?: string[];
}

export interface StandardsJson {
  [framework: string]: StandardSummary[];
}
