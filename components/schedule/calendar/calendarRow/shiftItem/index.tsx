import React from 'react';
import Shift from '@/components/types/shift';
import styles from './main.module.scss';

interface ShiftItemProps {
  date: string; 
  shifts: Shift[]; 
  absence: boolean; 
}

const ShiftItem: React.FC<ShiftItemProps> = ({ shifts, absence }) => {
  const formatTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
  };

  const getBackgroundColor = (roleName: string) => {
    switch (roleName) {
      case 'admin':
        return '#FF6347';
      case 'sup_mid':
        return '#4682B4';
      case 'user':
        return '#32CD32';
      default:
        return '#A9A9A9';
    }
  };

  const hasUnpublishedShift = shifts.some(shift => !shift.published);
  const shiftItemClass = `${styles.shiftItemContainerMain} ${absence ? styles.absence : hasUnpublishedShift ? styles.unpublished : styles.published}`;

  return (
    <div 
      className={shiftItemClass} 
      style={{ 
        backgroundColor: absence ? '#FFD700' : (shifts.length > 0 ? getBackgroundColor(shifts[0].role_name) : '#A9A9A9')
      }}
    >
      {absence ? (
        <div className={styles.absence}>Urlop</div>
      ) : shifts.length > 0 ? (
        shifts.map(shift => (
          <div key={shift.id} className={styles.shiftDetails}>
            {formatTime(shift.start)} - {formatTime(shift.end)}
            <div>{shift.role_name}</div>
          </div>
        ))
      ) : (
        <div className={styles.noShift} style={{
          cursor: hasUnpublishedShift ? 'default' : 'pointer'
        }}>Brak zmiany</div>
      )}
    </div>
  );
};
export default ShiftItem;