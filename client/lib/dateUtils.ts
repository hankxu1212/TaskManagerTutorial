/**
 * Parse a date string as a local date (not UTC).
 * Accepts "yyyy-MM-dd" or full ISO strings like "2025-02-10T00:00:00.000Z".
 * This prevents the off-by-one-day issue when using `new Date("yyyy-MM-dd")`.
 */
export const parseLocalDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.substring(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day);
};
