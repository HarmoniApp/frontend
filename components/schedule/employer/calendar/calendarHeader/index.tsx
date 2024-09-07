'use client';
import React from 'react';
import styles from './main.module.scss';

interface CalendarHeaderProps {
  weekData: Date[];
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ weekData }) => {
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className={styles.calendarHeaderContainerMain}>
      <div className={styles.nameContainer}>
      </div>
      <div className={styles.calendarDayContainer}>
        {weekData.map((day, index) => (
          <div
            key={index}
            className={`${styles.dayContainer} ${isToday(day) ? styles.today : ''}`}
          >
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