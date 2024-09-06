import Shift from './shift';
import AbsenceShort from './absenceShort';

export default interface WeekSchedule {
    shifts: Shift[];
    absences: AbsenceShort[];
}