import React from 'react';
import styles from './main.module.scss';

interface Shift {
  id: number;
  start: string;
  end: string;
  user_id: number;
  role_id: number;
}

interface ShiftItemProps {
  date: string;
  shifts: Shift[];
}

const ShiftItem: React.FC<ShiftItemProps> = ({ shifts }) => {
  const formatTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={styles.shiftItem}>
      {shifts.length > 0 ? (
        shifts.map((shift) => (
          <div key={shift.id} className={styles.shiftDetails}>
            {formatTime(shift.start)} - {formatTime(shift.end)}
          </div>
        ))
      ) : (
        <div className={styles.noShift}>Brak zmiany</div>
      )}
    </div>
  );
};
export default ShiftItem;