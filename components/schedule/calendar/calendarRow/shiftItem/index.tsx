import React, { useState, useEffect } from 'react';
import Role from '@/components/types/role';
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

  const roleIds = shifts.map((shift) => shift.role_id);
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    if (roleIds.length > 0) {
      const roleIdsString = roleIds.join(',');
      
      fetch(`http://localhost:8080/api/v1/role?ids=${roleIdsString}`)
        .then((response) => response.json())
        .then((data) => setRoles(data))
        .catch((error) => console.error('Error fetching roles:', error));
    }
  }, [roleIds]);

  return (
    <div className={styles.shiftItem}>
      {shifts.length > 0 ? (
        shifts.map((shift) => {
          const roleName = roles.find(role => role.id === shift.role_id)?.name || 'Brak roli';
          return (
            <div key={shift.id} className={styles.shiftDetails}>
              {formatTime(shift.start)} - {formatTime(shift.end)}
              <div>{roleName}</div>
            </div>
          );
        })
      ) : (
        <div className={styles.noShift}>Brak zmiany</div>
      )}
    </div>
  );
};
export default ShiftItem;