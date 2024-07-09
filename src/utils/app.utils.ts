import { BadRequestException } from '@nestjs/common';
import { isArray } from 'class-validator';
import * as dayjs from 'dayjs';

const PASSWORD = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

export const REGEX = {
  PASSWORD,
};

export function arrayHasDuplicates(arr: any[]): boolean {
  let hasDuplicates = false;
  arr.forEach((c, index) => {
    if (index != arr?.indexOf(c)) {
      hasDuplicates = true;
    }
  });
  return hasDuplicates;
}

export function generateOTP(): number {
  return Math.floor(100000 + Math.random() * 900000);
}

export function convertFirstLetterCapital(value: string) {
  if (value) {
    value = value.charAt(0).toUpperCase() + value.slice(1);
  }
  return value;
}

export const getMachineName = (name: string): string => {
  return name
    ?.toLowerCase()
    ?.trim()
    ?.replace('-', ' ')
    ?.replace(/\s+/g, '_')
    .trim();
};

export const isEmail = (str: string) => {
  return str.includes('@');
};

export const formatDate = (dateString: string | Date, formatString: string) => {
  const yourDate = dayjs(dateString);
  return yourDate.format(formatString);
};

export const getSiteMetaData = async (url: string) => {
  const ogs = require('open-graph-scraper');
  const options = { url };
  try {
    const resp = await ogs(options);
    const { error, html, result, response } = resp;
    if (error) {
      throw new BadRequestException('Data not found');
    }
    return {
      ogTitle: result.ogTitle,
      ogDescription: result.ogDescription || '',
      ogImage: isArray(result.ogImage) ? result.ogImage[0].url : '',
    };
  } catch (error) {
    throw new BadRequestException('Data not found');
  }
};
interface dummyRequest {
  id: number;
  name: string;
  ticketCode?: string;
}

export const checkValueExists = (arr: any[], value: any) => {
  return arr.find((val: any) => val.name === value);
};

export const calculateDateDifference = (start: any, end: any) => {
  if (!start && !end) return null;
  const date1 = dayjs(start);
  const date2 = dayjs(end);
  const diff = date2.diff(date1, 'day', true);
  const days = Math.floor(diff);
  return days;
};

export const groupBy = (x: any, f: any) =>
  x.reduce((a: any, b: any, i: any) => ((a[f(b, i, x)] ||= []).push(b), a), {});

export function convertToNumberAndCheckNaN(value: any) {
  // Convert the value to a number
  let numberValue = Number(value);

  // Check if the number is NaN
  if (isNaN(numberValue)) {
    // If it's NaN, assign it zero
    numberValue = 0;
  }

  return numberValue;
}

export function calculateCost(
  contractStartDate: Date,
  contractEndDate: Date,
  quantity: number,
  costPerUnit: number,
  period: string = '',
) {
  const days =
    calculatePeriods(contractStartDate, contractEndDate, period) || 1;
  const totalCost = quantity * costPerUnit * days;
  return totalCost;
}

export function calculatePeriods(startDate: any, endDate: any, period = '') {
  if (!period) return 1;
  const start = dayjs(startDate);
  const end = dayjs(endDate).add(1, 'day');
  const differenceInDays = end.diff(start, 'day');
  let periodInDays;
  switch (period.toLowerCase()) {
    case 'weekly':
      periodInDays = 7;
      break;
    case '10 days':
      periodInDays = 10;
      break;
    case 'fortnightly':
      periodInDays = 14;
      break;
    case 'monthly':
      periodInDays = 30;
      break;
    default:
      return 1;
  }
  return Math.floor(differenceInDays / periodInDays);
}