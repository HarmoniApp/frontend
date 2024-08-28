'use client';
import React from 'react';
import styles from './main.module.scss';
interface CalendarHeaderProps {
  weekData: Date[];
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ weekData }) => {
  return (
    <div className={styles.calendarHeaderContainerMain}>
      <div className={styles.nameContainer}>
        <p>IMIE I NAZWISKO</p>
      </div>
      <div className={styles.calendarDayContainer}>
      {weekData.map((day, index) => (
        <div key={index} className={styles.dayContainer}>
          <div className={styles.dayName}>
            {day.toLocaleDateString('pl-PL', { weekday: 'long' })}
          </div>
          <div className={styles.dayDate}>
            {day.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' })}
          </div>
        </div>
      ))}
      </div>
    </div>
  );
};
export default CalendarHeader;