'use client';
import React, { useState, useEffect } from 'react';
import CalendarHeader from './calendarHeader';
import CalendarDays from './calendarDays';
import CalendarCells from './calendarCells';
import WeekSchedule from '@/components/types/weekSchedule';
import styles from './main.module.scss';
interface ScheduleEmployeeProps {
    userId: number;
}

const ScheduleEmployee: React.FC<ScheduleEmployeeProps> = ({ userId }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [weekSchedule, setWeekSchedule] = useState<WeekSchedule | null>(null);

    const getMonthStartAndEnd = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth() + 1; 
        const startDate = `${year}-${month.toString().padStart(2, '0')}-01T00:00`;
        const lastDayOfMonth = new Date(year, month, 0).getDate();
        const endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDayOfMonth}T23:59`;
      
        return { startDate, endDate };
      };

    const fetchShiftsAndAbsences = async () => {
        try {
            const { startDate, endDate } = getMonthStartAndEnd();
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/calendar/user/${userId}/week?startDate=${startDate}&endDate=${endDate}&published=true`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                }
            });
            const data: WeekSchedule = await response.json();
            setWeekSchedule(data);
        } catch (error) {
            console.error('Error fetching week schedule:', error);
        }
    };

    useEffect(() => {
        fetchShiftsAndAbsences();
    }, [currentMonth]); 

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
        fetchShiftsAndAbsences(); 
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
        fetchShiftsAndAbsences();
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
        </div>
    );
};
export default ScheduleEmployee;