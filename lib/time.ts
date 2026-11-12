/** Formats milliseconds as MM:SS (or H:MM:SS after one hour). */
export function formatClock(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (value: number) => String(value).padStart(2, "0");
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;
}

/** Monday = 0 ... Sunday = 6. */
export function weekdayIndex(date: Date): number {
  return (date.getDay() + 6) % 7;
}

/** Midnight of the Monday that starts the week of `date`. */
export function startOfWeek(date: Date): Date {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  start.setDate(start.getDate() - weekdayIndex(date));
  return start;
}

export function dayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
