import { Employee } from '../types';

// Функция для парсинга CSV файла с сотрудниками
export const parseEmployeeCSV = (csvContent: string): Employee[] => {
  const rows = csvContent.split('\n');
  if (rows.length <= 1) {
    return [];
  }

  // Пропускаем заголовок (первую строку)
  const dataRows = rows.slice(1);
  
  return dataRows
    .filter(row => row.trim() !== '') // Пропускаем пустые строки
    .map((row, index) => {
      const columns = row.split(',').map(col => col.trim());
      
      // Проверяем, что у нас есть необходимое количество столбцов
      if (columns.length < 12) {
        console.error(`Row ${index + 1} has invalid number of columns`);
        return null;
      }
      
      try {
        return {
          id: (index + 1).toString(),
          personalId: columns[0], // Табельный номер
          fullName: columns[1], // ФИО
          birthDate: columns[2], // Дата рождения
          gender: columns[3] as 'Мужской' | 'Женский', // Пол
          department: columns[4], // Цех, участок, отдел
          position: columns[5], // Должность
          totalExperience: columns[6], // Стаж, общий
          positionExperience: columns[7], // Стаж, на должности
          lastMedicalExamDate: columns[8], // Дата медосмотра
          verdict: columns[9], // Вердикт
          hazards: columns[10], // Профессиональная вредность
          workingConditions: columns[11], // Условия труда
          notes: columns[12] || '', // Примечание
        };
      } catch (error) {
        console.error(`Error parsing row ${index + 1}: ${error}`);
        return null;
      }
    })
    .filter((employee): employee is Employee => employee !== null);
};

// Функция для получения шаблона CSV файла
export const getEmployeeCSVTemplate = (): string => {
  return `Табельный номер,ФИО,Дата рождения,Пол,Цех\\, участок\\, отдел,Должность,Стаж общий,Стаж на должности,Дата медосмотра,Вердикт,Профессиональная вредность,Условия труда,Примечание
10235,Иванов Иван Иванович,15.05.1980,Мужской,Цех №1,Оператор станка,12 лет,5 лет,10.03.2023,Годен,Повышенный уровень шума,Класс 3.1,Надземный`;
};