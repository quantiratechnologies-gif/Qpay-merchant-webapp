import { formatSaudiCurrency, formatLocalizedDate, formatLocalizedNumber, toArabicNumerals } from './i18n';

export const formatCurrency = (amount: number, language: string = 'English'): string => {
  return formatSaudiCurrency(amount, language);
};

export const generateUTR = (): string => {
  return 'SARIE' + Math.floor(100000000000 + Math.random() * 900000000000).toString();
};

export const generateTxnId = (): string => {
  return 'SAR' + Math.floor(10000000000 + Math.random() * 90000000000).toString();
};

export const getRiyadhDateStr = (date: Date = new Date()): string => {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Riyadh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
};

export const formatDate = (date: Date, language: string = 'English'): string => {
  return formatLocalizedDate(date, language);
};

export { toArabicNumerals, formatLocalizedNumber, formatSaudiCurrency, formatLocalizedDate };

