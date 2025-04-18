export interface Employee {
  id: string;
  personalId: string; // Табельный номер
  fullName: string; // ФИО
  birthDate: string; // Дата рождения
  gender: 'Мужской' | 'Женский'; // Пол
  department: string; // Цех, участок, отдел
  position: string; // Должность
  totalExperience: string; // Стаж, общий
  positionExperience: string; // Стаж, на должности
  lastMedicalExamDate: string; // Дата медосмотра
  verdict: string; // Вердикт
  hazards: string; // Профессиональная вредность
  workingConditions: string; // Условия труда
  notes: string; // Примечание
}

export interface Department {
  id: string;
  name: string;
  subdivision?: string;
}

export interface AlcoholTest {
  id: string;
  employeeId: string;
  testDate: string;
  testTime: string;
  result: number; // Результат в промилле
  isPositive: boolean;
  deviceId: string;
  deviceCheckDate: string;
  medicalWorkerId: string;
  shiftNumber: number;
  comments?: string;
}

export interface PositiveTestRecord {
  id: string;
  registrationDate: string;
  employeeId: string;
  alcoholLevel: number; // Степень алкогольного опьянения (в промилле)
  referralId?: string; // Направление в наркологический диспансер
  referralDateTime?: string; // Дата и время направления
  territorialUnit?: string; // Наименование территориального подразделения
  examinationDate?: string; // Дата заключения медосвидетельствования
  examinationNumber?: string; // № заключения
  doctorName?: string; // ФИО врача
  examinationResult?: string; // Результат заключения
  escortName?: string; // ФИО сопровождающего
  medicalWorkerId: string; // ID медработника
}

export interface Referral {
  id: string;
  creationDateTime: string; // Дата и время составления
  location: string; // Место составления
  creatorName: string; // ФИО составителя
  employeeId: string;
  employeeDocumentType?: string; // Тип документа
  employeeDocumentNumber?: string; // Номер документа
  employeeDocumentIssueDate?: string; // Дата выдачи
  referralReason: 'alcoholIntoxication' | 'suspectedIntoxication' | 'positiveTest'; // Основание направления
  deviceDetails?: string; // Данные об использованном устройстве
  examinationType: 'primary' | 'repeated'; // Тип освидетельствования
  alcoholLevel: number; // Результат теста
}

export interface RefusalAct {
  id: string;
  creationDate: string; // Дата составления
  creationTime: string; // Время составления
  location: string; // Место составления
  creatorName: string; // ФИО составителя
  witnessName1: string; // ФИО свидетеля 1
  witnessName2: string; // ФИО свидетеля 2
  employeeId: string;
  refusalDate: string; // Дата отказа
  refusalReason: string; // Причина отказа со слов работника
}

export type DocumentType = 'alcoholTest' | 'positiveTest' | 'referral' | 'refusalAct';