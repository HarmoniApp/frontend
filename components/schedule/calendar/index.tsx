import React, { forwardRef } from 'react';
import CalendarHeader from '@/components/schedule/calendar/calendarHeader';
import CalendarRow from '@/components/schedule/calendar/calendarRow';
import styles from './main.module.scss';

interface CalendarProps {
    currentWeek: Date[];
}

const Calendar = forwardRef(({ currentWeek }: CalendarProps, ref) => {
    return (
        <div className={styles.calendarContainerMain}>
            <div className={styles.calendarHeaderContainer}>
                <CalendarHeader weekData={currentWeek} />
            </div>
            <div className={styles.calendarRowContainer}>
                <CalendarRow ref={ref} currentWeek={currentWeek} />
            </div>
        </div>
    );
});
export default Calendar;