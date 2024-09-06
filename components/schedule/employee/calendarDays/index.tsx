import React from 'react';
import styles from './main.module.scss';

const daysOfWeek = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'];

const CalendarDays: React.FC = () => {
    return (
        <div className={styles.calendarDays}>
            {daysOfWeek.map((day) => (
                <div key={day} className={styles.day}>{day}</div>
            ))}
        </div>
    );
};
export default CalendarDays;