'use client';
import React, { useState } from 'react';
import ScheduleBar from '@/components/schedule/scheduleBar';
import Calendar from '@/components/schedule/calendar';
import styles from './main.module.scss';

const SchedulePage: React.FC = () => {
    const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
      const today = new Date();
      const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1));
      return firstDayOfWeek;
    });
  
    const getWeekDays = (startDate: Date): Date[] => {
      const weekDays = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(startDate);
        day.setDate(startDate.getDate() + i);
        weekDays.push(day);
      }
      return weekDays;
    };
  
    const currentWeek = getWeekDays(currentWeekStart);
  
    const goToNextWeek = () => {
      setCurrentWeekStart(new Date(currentWeekStart.setDate(currentWeekStart.getDate() + 7)));
    };
  
    const goToPreviousWeek = () => {
      setCurrentWeekStart(new Date(currentWeekStart.setDate(currentWeekStart.getDate() - 7)));
    };

    return (
        <div className={styles.scheduleContainerMain}>
          <div className={styles.firstRowContainer}>
            <ScheduleBar currentWeek={currentWeek} onNextWeek={goToNextWeek} onPreviousWeek={goToPreviousWeek} />
          </div>
          <div className={styles.secoundRowContainer}>
            <Calendar weekData={currentWeek} />
          </div>
        </div>
    );
};

export default SchedulePage;
