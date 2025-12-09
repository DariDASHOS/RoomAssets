// frontend/src/utils/time.ts
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';

export const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export function localDatetimeToUtcIso(value: string): string {
  return new Date(value).toISOString();
}

export function utcIsoToLocalString(iso: string, formatStr = "dd-MM-yyyy HH:mm") {
  const date = new Date(iso);
  const zoned = toZonedTime(date, userTimeZone);
  return formatInTimeZone(zoned, userTimeZone, formatStr);
}
