import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

// Форматирование даты в российский формат
export const formatDate = (date: Date | string): string => {
  if (typeof date === 'string') {
    // Проверяем, если строка уже в формате DD.MM.YYYY
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(date)) {
      return date;
    }
    // Иначе пытаемся распарсить строку в дату
    date = new Date(date);
  }
  
  return format(date, 'dd.MM.yyyy', { locale: ru });
};

// Форматирование времени
export const formatTime = (date: Date | string): string => {
  if (typeof date === 'string') {
    // Проверяем, если строка уже в формате HH:MM
    if (/^\d{2}:\d{2}$/.test(date)) {
      return date;
    }
    // Иначе пытаемся распарсить строку в дату
    date = new Date(date);
  }
  
  return format(date, 'HH:mm', { locale: ru });
};

// Форматирование даты и времени
export const formatDateTime = (date: Date | string): string => {
  if (typeof date === 'string') {
    // Проверяем, если строка уже в формате DD.MM.YYYY HH:MM
    if (/^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}$/.test(date)) {
      return date;
    }
    // Иначе пытаемся распарсить строку в дату
    date = new Date(date);
  }
  
  return format(date, 'dd.MM.yyyy HH:mm', { locale: ru });
};

// Форматирование результата алкогольного теста
export const formatAlcoholLevel = (level: number): string => {
  return level.toFixed(2) + ' ‰';
};

// Получение полного названия месяца
export const getMonthName = (month: number): string => {
  const date = new Date();
  date.setMonth(month);
  return format(date, 'LLLL', { locale: ru });
};

// Получение текущей даты в формате DD.MM.YYYY
export const getCurrentDate = (): string => {
  return formatDate(new Date());
};

// Получение текущего времени в формате HH:MM
export const getCurrentTime = (): string => {
  return formatTime(new Date());
};

// Преобразование строки даты из формата DD.MM.YYYY в объект Date
export const parseRussianDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split('.').map(Number);
  return new Date(year, month - 1, day);
};

// Валидация формата даты DD.MM.YYYY
export const isValidDateFormat = (dateString: string): boolean => {
  return /^\d{2}\.\d{2}\.\d{4}$/.test(dateString);
};

// Валидация формата времени HH:MM
export const isValidTimeFormat = (timeString: string): boolean => {
  return /^\d{2}:\d{2}$/.test(timeString);
};