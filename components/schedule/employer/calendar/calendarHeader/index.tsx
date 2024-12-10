'use client';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import styles from './main.module.scss';

interface CalendarHeaderProps {
  weekData: Date[];
  onSearch: (query: string) => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ weekData, onSearch }) => {
  const [isMobileView, setIsMobileView] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className={styles.calendarHeaderContainerMain}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Wyszukaj"
          className={styles.searchInput}
          value={searchQuery}
          onChange={handleSearchInput}
        />
        <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon} />
      </div>
      <div className={styles.calendarDayContainer}>
        {weekData.map((day, index) => (
          <div
            key={index}
            // className={`${styles.dayContainer} ${new Date().getDate() === day.getDate() ? styles.today : ''}`}
            className={`${styles.dayContainer} ${new Date().toDateString() === day.toDateString() ? styles.today : ''}`} 
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