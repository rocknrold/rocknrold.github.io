// Date math for values that must never be hard-coded ("4+ years", role
// durations, copyright year). Everything derives from start dates in
// src/data/resume.ts and the current date.

/** "YYYY-MM" → months since year 0, so differences are plain subtraction. */
const monthIndex = (ym: string) => {
  const [y, m] = ym.split("-").map(Number);
  return y * 12 + (m - 1);
};

const currentMonthIndex = (now: Date) => now.getFullYear() * 12 + now.getMonth();

/** Whole years elapsed since `start` (e.g. Feb 2022 → Oct 2026 = 4). */
export function yearsSince(start: string, now: Date): number {
  return Math.max(0, Math.floor((currentMonthIndex(now) - monthIndex(start)) / 12));
}

/**
 * Length of a role, counting both the first and last month, the way
 * LinkedIn does: Feb 2022 – Jan 2023 is "1 yr", Jun – Aug 2022 is "3 mos".
 */
export function roleDuration(start: string, end: string | null, now: Date): string {
  const last = end ? monthIndex(end) : currentMonthIndex(now);
  const months = Math.max(1, last - monthIndex(start) + 1);
  const y = Math.floor(months / 12);
  const m = months % 12;
  const parts = [];
  if (y) parts.push(`${y} ${y === 1 ? "yr" : "yrs"}`);
  if (m) parts.push(`${m} ${m === 1 ? "mo" : "mos"}`);
  return parts.join(" ");
}
