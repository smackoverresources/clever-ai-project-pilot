import {
  format,
  formatDistance,
  formatRelative,
  isValid,
  parseISO,
  differenceInDays,
  differenceInBusinessDays,
  addDays,
  addBusinessDays,
  isAfter,
  isBefore,
  isToday,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from 'date-fns';

// Format dates
export function formatDate(date: Date | string, formatString = 'PPP') {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return isValid(parsedDate) ? format(parsedDate, formatString) : '';
}

export function formatDistanceToNow(date: Date | string) {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return isValid(parsedDate)
    ? formatDistance(parsedDate, new Date(), { addSuffix: true })
    : '';
}

export function formatRelativeToNow(date: Date | string) {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return isValid(parsedDate)
    ? formatRelative(parsedDate, new Date())
    : '';
}

// Date calculations
export function getDaysDifference(
  startDate: Date | string,
  endDate: Date | string,
  businessDaysOnly = false
) {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;

  if (!isValid(start) || !isValid(end)) return 0;

  return businessDaysOnly
    ? differenceInBusinessDays(end, start)
    : differenceInDays(end, start);
}

export function addDaysToDate(
  date: Date | string,
  days: number,
  businessDaysOnly = false
) {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(parsedDate)) return null;

  return businessDaysOnly
    ? addBusinessDays(parsedDate, days)
    : addDays(parsedDate, days);
}

// Date comparisons
export function isDateAfter(
  date: Date | string,
  compareDate: Date | string = new Date()
) {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  const parsedCompareDate =
    typeof compareDate === 'string' ? parseISO(compareDate) : compareDate;

  return isValid(parsedDate) && isValid(parsedCompareDate)
    ? isAfter(parsedDate, parsedCompareDate)
    : false;
}

export function isDateBefore(
  date: Date | string,
  compareDate: Date | string = new Date()
) {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  const parsedCompareDate =
    typeof compareDate === 'string' ? parseISO(compareDate) : compareDate;

  return isValid(parsedDate) && isValid(parsedCompareDate)
    ? isBefore(parsedDate, parsedCompareDate)
    : false;
}

export function isDateToday(date: Date | string) {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return isValid(parsedDate) ? isToday(parsedDate) : false;
}

// Date ranges
export function getDayRange(date: Date | string = new Date()) {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsedDate)) return null;

  return {
    start: startOfDay(parsedDate),
    end: endOfDay(parsedDate),
  };
}

export function getWeekRange(date: Date | string = new Date()) {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsedDate)) return null;

  return {
    start: startOfWeek(parsedDate, { weekStartsOn: 1 }), // Start week on Monday
    end: endOfWeek(parsedDate, { weekStartsOn: 1 }),
  };
}

export function getMonthRange(date: Date | string = new Date()) {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsedDate)) return null;

  return {
    start: startOfMonth(parsedDate),
    end: endOfMonth(parsedDate),
  };
}

// Date validation
export function isValidDate(date: any): date is Date {
  return date instanceof Date && isValid(date);
}

export function parseDate(date: string | Date): Date | null {
  if (date instanceof Date) return isValid(date) ? date : null;
  try {
    const parsedDate = parseISO(date);
    return isValid(parsedDate) ? parsedDate : null;
  } catch {
    return null;
  }
} 