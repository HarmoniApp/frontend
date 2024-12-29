export interface Absence {
  id: number;
  start: string;
  end: string;
  status: {
    id: number;
    name: string;
  };
  submission: string;
  updated: string;
  user_id: number;
  absence_type_id: number;
  working_days: number;
  employee_id: number;
  firstname: string;
  surname: string;
}

export interface AbsenceShort {
  id: number;
  start: string;
  end: string;
}

export interface AbsenceStatus {
  id: number;
  name: string;
}

export interface AbsenceType {
  id: number;
  name: string;
}