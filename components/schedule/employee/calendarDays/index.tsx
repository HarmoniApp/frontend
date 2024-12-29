import React, { useState, useEffect } from 'react';
import styles from './main.module.scss';
import { shortDayNames, fullDayNames } from '@/utils/calendarDayAndMonthNames';

const CalendarDays: React.FC = () => {
    const [isMobileView, setIsMobileView] = useState(false);

    const handleResize = () => {
        setIsMobileView(window.innerWidth <= 768);
    };

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className={styles.calendarDays}>
            {(isMobileView ? shortDayNames : fullDayNames).map((day) => (
                <div key={day} className={styles.day}>{day}</div>
            ))}
        </div>
    );
};
export default CalendarDays;