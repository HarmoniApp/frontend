import React, { useState, forwardRef } from 'react';
import CalendarHeader from './calendarHeader';
import CalendarRow from './calendarRow';
import styles from './main.module.scss';

interface CalendarProps {
  currentWeek: Date[];
}

const Calendar = forwardRef(({ currentWeek }: CalendarProps, ref) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className={styles.calendarContainerMain}>
      <div className={styles.calendarHeaderContainer}>
        <CalendarHeader weekData={currentWeek} onSearch={setSearchQuery} />
      </div>
      <div className={styles.calendarRowContainer}>
        <CalendarRow ref={ref} currentWeek={currentWeek} searchQuery={searchQuery} />
      </div>
    </div>
  );
});

export default Calendar;