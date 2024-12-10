'use client';
import React, { useState, useEffect } from 'react';
import CalendarHeader from './calendarHeader';
import CalendarDays from './calendarDays';
import CalendarCells from './calendarCells';
import WeekSchedule from '@/components/types/weekSchedule';
import { Message } from 'primereact/message';
import styles from './main.module.scss';
import { fetchShiftsAndAbsences } from '@/services/scheduleService';
interface ScheduleEmployeeProps {
    userId: number;
}

const ScheduleEmployee: React.FC<ScheduleEmployeeProps> = ({ userId }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [weekSchedule, setWeekSchedule] = useState<WeekSchedule | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            await fetchShiftsAndAbsences(currentMonth, userId, setWeekSchedule);
        }
        loadData();
    }, [currentMonth]);

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
        fetchShiftsAndAbsences(currentMonth, userId, setWeekSchedule);
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
        fetchShiftsAndAbsences(currentMonth, userId, setWeekSchedule);
    };

    return (
        <div className={styles.scheduleEmployee}>
            <CalendarHeader currentMonth={currentMonth} onPrevMonth={handlePrevMonth} onNextMonth={handleNextMonth} />
            <CalendarDays />
            {weekSchedule && (
                <CalendarCells
                    currentMonth={currentMonth}
                    shifts={weekSchedule.shifts || []}
                    absences={weekSchedule.absences || []}
                />
            )}
            {error && <Message severity="error" text={`Error: ${error}`} className={styles.errorMessageComponent} />}
        </div>
    );
};
export default ScheduleEmployee;