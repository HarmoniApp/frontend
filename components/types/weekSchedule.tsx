import Shift from './shift';

export default interface WeekSchedule {
    shifts: Shift[];
    absences: AbsenceShort[];
}

interface AbsenceShort {
    id: number;
    start: string;
    end: string;
}