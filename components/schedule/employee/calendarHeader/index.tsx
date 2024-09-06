import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import styles from './main.module.scss';

interface CalendarHeaderProps {
    currentMonth: Date;
    onPrevMonth: () => void;
    onNextMonth: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ currentMonth, onPrevMonth, onNextMonth }) => {
    const monthYear = currentMonth.toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' });

    return (
        <div className={styles.calendarHeader}>
            <button className={styles.changeMonthButton} onClick={onPrevMonth}><FontAwesomeIcon className={styles.buttonIcon} icon={faChevronLeft} /></button>
            <h2 className={styles.dateRange}>{monthYear}</h2>
            <button className={styles.changeMonthButton} onClick={onNextMonth}><FontAwesomeIcon className={styles.buttonIcon} icon={faChevronRight} /></button>
        </div>
    );
};
export default CalendarHeader;