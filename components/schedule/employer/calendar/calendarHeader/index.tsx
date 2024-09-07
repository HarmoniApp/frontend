'use client';
import React, { useState, useEffect } from 'react';
import styles from './main.module.scss';

interface CalendarHeaderProps {
  weekData: Date[];
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ weekData }) => {
  const [isMobileView, setIsMobileView] = useState(false);

  const fullDayNames = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'];
  const shortDayNames = ['Pn', 'Wt', 'Śr', 'Czw', 'Pt', 'Sb', 'Nd'];

  const getDayIndex = (date: Date) => {
    const day = date.getDay();
    return day === 0 ? 6 : day - 1;
  };

  const handleResize = () => {
    setIsMobileView(window.innerWidth <= 768);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      <div className={styles.nameContainer}></div>
      <div className={styles.calendarDayContainer}>
        {weekData.map((day, index) => (
          <div
            key={index}
            className={`${styles.dayContainer} ${isToday(day) ? styles.today : ''}`}
          >
            <div className={styles.dayName}>
              {isMobileView ? shortDayNames[getDayIndex(day)] : fullDayNames[getDayIndex(day)]}
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