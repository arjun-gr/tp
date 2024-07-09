import * as dayjs from 'dayjs';
import { FHU_SERVICE_TYPES } from '../common/enums/client';

export function datesInPeriod(start: any, end: any, period: any) {
  if (!period) return null;
  let dates = [];
  let currentDate = dayjs(start, 'YYYY-MM-DD');
  let endDate = dayjs(end, 'YYYY-MM-DD');

  let duration = FHU_SERVICE_TYPES.find((val) => val.name == period)?.period;
  if (duration) {
    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
      if (currentDate.day() == 0) {
        console.log('Sunday :', currentDate.format('DD-MM-YYYY'));
        currentDate = currentDate.add(1, 'day');
      }
      dates.push(currentDate.format('YYYY-MM-DD'));
      currentDate = currentDate.add(duration, 'day');
    }
    return dates;
  }
}

export function getMinutesBetweenDates(startDate, endDate) {
  if (!startDate && !endDate) return null;
  const diff = endDate?.getTime() - startDate?.getTime();
  var resultInMinutes = Math.round(diff / 60000);
  return resultInMinutes;
}

export function getNewDate(days: any) {
  var someDate = new Date();
  var numberOfDaysToAdd = days;
  var result = someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
  return new Date(result);
}

export function getLastMonthFirstAndLastDay() {
  const date = new Date();
  const firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth(), 1);
  return {
    firstDay,
    lastDay,
  };
}

export function getFirstAndLastDayOfMonth(month: Date) {
  var month = new Date(month.toString());
  var firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  var lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  return { firstDay, lastDay };
}

export function addDays(date: Date, days: number) {
  if (!date || !days) return null;
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function isSameMonth(d1: Date, d2: Date) {
  const start = new Date(d1);
  const end = new Date(d2);
  if (start.getMonth() === end.getMonth()) {
    start.setMonth(start.getMonth() - 1);
    return start;
  }
  return null;
}
