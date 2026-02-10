/**
 * Parse a yyyy-MM-dd string as a local date (not UTC).
 * This prevents the off-by-one-day issue when using `new Date("yyyy-MM-dd")`.
 */
export const parseLocalDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};
