import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarPlus, faPersonThroughWindow } from '@fortawesome/free-solid-svg-icons';
import Shift from '@/components/types/shift';
import RoleWithColour from '@/components/types/roleWithColour';
import styles from './main.module.scss';

interface ShiftItemProps {
  date: string;
  shifts: Shift[];
  absence: boolean;
  roles: RoleWithColour[];
}

const ShiftItem: React.FC<ShiftItemProps> = ({ shifts, absence, roles }) => {
  const formatTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
  };

  const getBackgroundColor = (roleName: string) => {
    const role = roles.find(role => role.name === roleName);
    return role ? role.color : '#A9A9A9';
  };

  const hasUnpublishedShift = shifts.some(shift => !shift.published);
  const shiftItemClass = `${styles.shiftItemContainerMain} ${absence ? styles.absence : hasUnpublishedShift ? styles.unpublished : styles.published}`;

  return (
    <div
      className={shiftItemClass}
      style={{
        backgroundColor: absence ? '#FFD700' : (shifts.length > 0 ? getBackgroundColor(shifts[0].role_name) : '#A9A9A9'),
        backgroundImage: shifts.length > 0 && !absence && !shifts[0].published ?
          'repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.2) 0, rgba(255, 255, 255, 0.2) 10px, transparent 10px, transparent 20px)'
          : 'none'
      }}
    >
      {absence ? (
        <div className={styles.absence}>
          <FontAwesomeIcon className={styles.buttonIcon} icon={faPersonThroughWindow} />
          <p className={styles.absenceParagraph}>Urlop</p>
        </div>
      ) : shifts.length > 0 ? (
        shifts.map(shift => (
          <div key={shift.id} className={styles.shiftDetails}>
            <p className={styles.shiftTimeParagraph}>{formatTime(shift.start)} - {formatTime(shift.end)}</p>
            <p className={styles.shiftRoleParagraph}>{shift.role_name}</p>
          </div>
        ))
      ) : (
        <div className={styles.noShift}><FontAwesomeIcon className={styles.buttonIcon} icon={faCalendarPlus} /></div>
      )}
    </div>
  );
};
export default ShiftItem;