'use client';
import React, { useState, useRef } from 'react';
import ScheduleBar from './scheduleBar';
import Calendar from './calendar';
import { Message } from 'primereact/message';
import styles from './main.module.scss';

const ScheduleEmployer: React.FC = () => {
  const [error, setError] = useState<string | null>(null);

  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const firstDayOfWeek = new Date(today.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)));
    return firstDayOfWeek;
  });

  const calendarRowRef = useRef<{ publishAll: () => void }>(null);

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

  const handlePublishAll = () => {
    if (calendarRowRef.current) {
      calendarRowRef.current.publishAll();
    }
  };

  return (
    <div className={styles.scheduleContainerMain}>
      <div className={styles.firstRowContainer}>
        <ScheduleBar
          currentWeek={currentWeek}
          onNextWeek={goToNextWeek}
          onPreviousWeek={goToPreviousWeek}
          onPublishAll={handlePublishAll}
          setError={setError}
        />
      </div>
      <div className={styles.secoundRowContainer}>
        <Calendar ref={calendarRowRef} currentWeek={currentWeek} />
      </div>
      {error && <Message severity="error" text={`Error: ${error}`} className={styles.errorMessageComponent} />}
    </div>
  );
};
export default ScheduleEmployer;