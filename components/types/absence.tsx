export default interface Absence {
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
  }