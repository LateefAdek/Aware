import { TIME_BLOCKS } from "@/lib/constants";
import type { TimeBlock } from "@/types";

/**
 * Derives the student time block context from a given Date.
 * Blocks: Early Morning, Morning, Afternoon, Evening, Late Night Study, Night
 */
export function getTimeBlock(date: Date = new Date()): TimeBlock {
  const hour = date.getHours();
  for (const block of TIME_BLOCKS) {
    if (block.start <= block.end) {
      if (hour >= block.start && hour < block.end) {
        return block.label as TimeBlock;
      }
    } else {
      // Wraps midnight (e.g. Night: 0-5)
      if (hour >= block.start || hour < block.end) {
        return block.label as TimeBlock;
      }
    }
  }
  return "Morning";
}

/**
 * Formats a date for display (e.g. "Monday, June 3")
 */
export function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

/**
 * Returns the short day label for the 7-day heatmap (e.g. "Mon")
 */
export function getShortDay(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

/**
 * Returns array of the last N days as Date objects (today last)
 */
export function getLastNDays(n: number): Date[] {
  const days: Date[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    days.push(d);
  }
  return days;
}

/**
 * Checks if two dates are the same calendar day
 */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Formats a timestamp into a readable time string (e.g. "2:34 PM")
 */
export function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Returns a greeting based on the current hour
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return "Still up?";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Good night";
}

/**
 * Checks if 3 or more of the last N mood logs are Drained (4) or Struggling (5)
 */
export function hasBurnoutPattern(
  recentMoodCodes: number[],
  windowSize = 3
): boolean {
  const last = recentMoodCodes.slice(-windowSize);
  return last.filter((code) => code >= 4).length >= windowSize;
}
