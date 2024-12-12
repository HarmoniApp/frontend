'use client';
import React, { useState, useEffect } from 'react';
import CalendarHeader from './calendarHeader';
import CalendarDays from './calendarDays';
import CalendarCells from './calendarCells';
import WeekSchedule from '@/components/types/weekSchedule';
import styles from './main.module.scss';
import { fetchUserPublishedSchedule } from '@/services/scheduleService';
import LoadingSpinner from '@/components/loadingSpinner';
interface ScheduleEmployeeProps {
    userId: number;
}

const ScheduleEmployee: React.FC<ScheduleEmployeeProps> = ({ userId }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [weekSchedule, setWeekSchedule] = useState<WeekSchedule | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await fetchUserPublishedSchedule(currentMonth, userId, setWeekSchedule);
            setLoading(false);
        }
        loadData();
    }, [currentMonth]);

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
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
            {loading && <LoadingSpinner />}
        </div>
    );
};
export default ScheduleEmployee;