'use client';
import React, { useState } from 'react';
import styles from './main.module.scss';

const WeekSwitcher: React.FC = () => {
    const today = new Date();
    const [currentDate, setCurrentDate] = useState<Date>(today);

    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('pl-PL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const getStartOfWeek = (date: Date): Date => {
        const dayOfWeek = date.getDay();
        const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        return new Date(date.setDate(diff));
    };

    const getEndOfWeek = (date: Date): Date => {
        const startOfWeek = getStartOfWeek(date);
        return new Date(startOfWeek.setDate(startOfWeek.getDate() + 6));
    };

    const goToPreviousWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() - 7);
        setCurrentDate(newDate);
    };

    const goToNextWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + 7);
        setCurrentDate(newDate);
    };

    const startOfWeek = getStartOfWeek(currentDate);
    const endOfWeek = getEndOfWeek(currentDate);

    return (
        <div className={styles.weekSwitcher}>
            <button onClick={goToPreviousWeek}>&lt; Poprzedni</button>
            <span>
                {formatDate(startOfWeek)} - {formatDate(endOfWeek)}
            </span>
            <button onClick={goToNextWeek}>Następny &gt;</button>
        </div>
    );
};

export default WeekSwitcher;
