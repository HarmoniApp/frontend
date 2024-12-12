import React from 'react';
import CustomButton from '@/components/customButton';
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
            <CustomButton icon="chevronLeft" writing="" action={onPrevMonth}/>
            <h2 className={styles.dateRange}>{monthYear}</h2>
            <CustomButton icon="chevronRight" writing="" action={onNextMonth}/>
        </div>
    );
};
export default CalendarHeader;