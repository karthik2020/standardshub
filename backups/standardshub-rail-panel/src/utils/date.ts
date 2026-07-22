const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Format an accounting standard date consistently.
 *
 * @param value - A date string in YYYY, YYYY-MM, or YYYY-MM-DD format.
 * @param style - "default" (e.g. 20 May 2020) or "short" (e.g. May 2020).
 * @returns The formatted date, or an empty string for missing/invalid input.
 */
export function formatStandardDate(
  value?: string,
  style: "default" | "short" = "default"
): string {
  if (!value) return "";

  const parts = value.split("-").filter(Boolean);

  if (parts.length === 1) {
    const [year] = parts;
    if (!/^\d{4}$/.test(year)) return "";
    return year;
  }

  if (parts.length === 2) {
    const [year, month] = parts;
    const m = Number(month);
    if (!/^\d{4}$/.test(year) || !/^\d{1,2}$/.test(month) || m < 1 || m > 12) {
      return "";
    }
    const monthName = MONTHS[m - 1];
    return style === "short" ? `${monthName} ${year}` : `${monthName} ${year}`;
  }

  if (parts.length === 3) {
    const [year, month, day] = parts;
    const m = Number(month);
    const d = Number(day);
    if (
      !/^\d{4}$/.test(year) ||
      !/^\d{1,2}$/.test(month) ||
      !/^\d{1,2}$/.test(day) ||
      m < 1 ||
      m > 12 ||
      d < 1 ||
      d > 31
    ) {
      return "";
    }
    const monthName = MONTHS[m - 1];
    if (style === "short") return `${monthName} ${year}`;
    return `${d} ${monthName} ${year}`;
  }

  return "";
}
