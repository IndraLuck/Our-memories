import { DaysTogetherInfo, Memory } from '../types';

/**
 * Calculates days, weeks, months, years, hours, and next anniversary countdown
 */
export function calculateDaysTogether(startDateStr: string, referenceDate: Date = new Date()): DaysTogetherInfo {
  if (!startDateStr) {
    return {
      days: 0,
      weeks: 0,
      months: 0,
      years: 0,
      hours: 0,
      nextAnniversaryDays: 0,
      nextAnniversaryYear: referenceDate.getFullYear(),
      formattedDate: '',
    };
  }

  // Parse YYYY-MM-DD cleanly in local time
  const [year, month, day] = startDateStr.split('-').map(Number);
  const start = new Date(year, month - 1, day, 0, 0, 0);
  const diffMs = referenceDate.getTime() - start.getTime();

  // If date is in the future
  const safeDiffMs = Math.max(0, diffMs);
  const totalDays = Math.floor(safeDiffMs / (1000 * 60 * 60 * 24));
  const totalHours = Math.floor(safeDiffMs / (1000 * 60 * 60));
  const weeks = Math.floor(totalDays / 7);

  // Approximate years and months
  const years = Math.floor(totalDays / 365.25);
  const months = Math.floor(totalDays / 30.44);

  // Calculate next anniversary
  const currentYear = referenceDate.getFullYear();
  let nextAnniversary = new Date(currentYear, month - 1, day, 0, 0, 0);
  let anniversaryYear = currentYear - year;

  if (nextAnniversary.getTime() <= referenceDate.getTime()) {
    nextAnniversary = new Date(currentYear + 1, month - 1, day, 0, 0, 0);
    anniversaryYear += 1;
  }

  const msToNextAnniversary = nextAnniversary.getTime() - referenceDate.getTime();
  const nextAnniversaryDays = Math.max(0, Math.ceil(msToNextAnniversary / (1000 * 60 * 60 * 24)));

  const formattedDate = start.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return {
    days: totalDays,
    weeks,
    months,
    years,
    hours: totalHours,
    nextAnniversaryDays,
    nextAnniversaryYear: Math.max(1, anniversaryYear),
    formattedDate,
  };
}

/**
 * Format date for friendly human reading: "October 14, 2024"
 */
export function formatFriendlyDate(dateStr: string): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Filter memories that took place on today's month and day in previous years ("On This Day")
 */
export function getOnThisDayMemories(memories: Memory[], referenceDate: Date = new Date()): { memory: Memory; yearsAgo: number }[] {
  const currentMonth = referenceDate.getMonth() + 1;
  const currentDay = referenceDate.getDate();
  const currentYear = referenceDate.getFullYear();

  return memories
    .filter((m) => !m.deletedAt)
    .filter((m) => {
      if (!m.date) return false;
      const [y, mth, d] = m.date.split('-').map(Number);
      return mth === currentMonth && d === currentDay && y < currentYear;
    })
    .map((m) => {
      const [y] = m.date.split('-').map(Number);
      return {
        memory: m,
        yearsAgo: currentYear - y,
      };
    });
}
