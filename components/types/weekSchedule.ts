import { Shift } from '@/components/types/shift';
import { AbsenceShort } from '@/components/types/absence';
export interface WeekSchedule {
    shifts: Shift[];
    absences: AbsenceShort[];
}