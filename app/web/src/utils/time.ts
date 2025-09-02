import { toZonedTime, formatInTimeZone } from 'date-fns-tz';

export const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export function localDatetimeToUtcIso(value: string): string {
  const local = new Date(`${value}:00`); // создаём локальную дату
  return new Date(local.getTime() - local.getTimezoneOffset() * 60000).toISOString();
}

export function utcIsoToLocalString(iso: string, formatStr = "yyyy-MM-dd HH:mm (zzz)") {
  const date = new Date(iso);
  const zoned = toZonedTime(date, userTimeZone);
  return formatInTimeZone(zoned, userTimeZone, formatStr);
}
