import React from 'react';
import ShiftInfo from './shiftInfo';
import AbsenceInfo from './absenceInfo';
import Shift from '@/components/types/shift';
import AbsenceShort from '@/components/types/absenceShort';
import styles from './main.module.scss';

interface CalendarCellsProps {
    currentMonth: Date;
    shifts: Shift[];
    absences: AbsenceShort[];
}

const CalendarCells: React.FC<CalendarCellsProps> = ({ currentMonth, shifts, absences }) => {
    const today = new Date();
    let startDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
    startDay = (startDay === 0) ? 6 : startDay - 1;

    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const calendarCells = [];

    const isToday = (day: number) => {
        return (
            today.getFullYear() === currentMonth.getFullYear() &&
            today.getMonth() === currentMonth.getMonth() &&
            today.getDate() === day
        );
    };

    const renderDay = (day: number) => {
        if (isToday(day)) {
            return (
                <div className={styles.today}>
                    <label>{day}</label>
                </div>
            );
        } else {
            return <span className={styles.daySpan}>{day}</span>;
        }
    };

    for (let i = 0; i < startDay; i++) {
        calendarCells.push(<div className={styles.emptyCell} key={`empty-${i}`} />);
    }

    const isDateInRange = (date: string, start: string, end: string) => {
        const currentDate = new Date(date);
        return currentDate >= new Date(start) && currentDate <= new Date(end);
    };

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day + 1).toISOString().split('T')[0];
        const dayShifts = shifts.filter((shift) => shift.start.startsWith(date));
        const dayAbsences = absences.filter((absence) => isDateInRange(date, absence.start, absence.end));

        calendarCells.push(
            <div className={styles.calendarCell} key={day}>
                {renderDay(day)}
                <div className={styles.shiftOrAbsenceContainer}>
                    {dayShifts.map((shift) => (
                        <ShiftInfo key={shift.id} shift={shift} />
                    ))}
                    {dayAbsences.map((absence) => (
                        <AbsenceInfo key={absence.id} />
                    ))}
                </div>
            </div>
        );
    }
    return <div className={styles.calendarCells}>{calendarCells}</div>;
};
export default CalendarCells;