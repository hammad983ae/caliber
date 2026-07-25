const WEEKDAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export type ScheduleRule = { type: "daily" } | { type: "weekly"; weekday: number } | null;

/**
 * Trigger descriptions are free text (typed by the user, or copied verbatim
 * from their request), not a structured cron expression — e.g. "Every day at
 * 8am, block my calendar" or "Every Monday, send the weekly digest". This
 * scans for a recognizable daily/weekly cadence anywhere in the text; anything
 * else (voice phrases, form submissions, presence) has no real signal to
 * schedule against and is left null, i.e. manual-only.
 */
export function parseSchedule(description: string): ScheduleRule {
  const text = description.toLowerCase();

  for (let i = 0; i < WEEKDAYS.length; i++) {
    if (text.includes(WEEKDAYS[i])) {
      return { type: "weekly", weekday: i };
    }
  }

  if (/\bevery ?day\b|\bdaily\b|\bevery morning\b|\bevery evening\b|\bevery night\b/.test(text)) {
    return { type: "daily" };
  }

  return null;
}

/**
 * Recognizes a "new row in a spreadsheet" style trigger. There's no push
 * notification for this (see automation-runner.ts) — the runner instead
 * compares the sheet's row count against what it saw last time, once a day.
 */
export function isSheetRowTrigger(description: string): boolean {
  const text = description.toLowerCase();
  return /new (row|entry|submission|line)|row (is )?added|added to (the )?(sheet|spreadsheet)/.test(
    text,
  );
}

/**
 * The runner only checks once a day (Vercel Cron's Hobby-plan limit), so
 * "due" means: matches today's cadence, and hasn't already run today.
 */
export function isDueToday(rule: ScheduleRule, now: Date, lastRunAtISO: string | null): boolean {
  if (!rule) return false;
  if (rule.type === "weekly" && now.getUTCDay() !== rule.weekday) return false;

  if (lastRunAtISO) {
    const last = new Date(lastRunAtISO);
    const sameUTCDay =
      last.getUTCFullYear() === now.getUTCFullYear() &&
      last.getUTCMonth() === now.getUTCMonth() &&
      last.getUTCDate() === now.getUTCDate();
    if (sameUTCDay) return false;
  }

  return true;
}
