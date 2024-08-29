import React, { useState, useEffect } from 'react';
import styles from './main.module.scss';

interface Shift {
  id: number;
  start: string;
  end: string;
  user_id: number;
  role_id: number;
}

interface Role {
  id: number;
  name: string;
  is_sup: boolean;
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

  const [roles, setRoles] = useState<Record<number, string>>({});

  useEffect(() => {
    const fetchRoles = async () => {
      const rolePromises = shifts.map(shift =>
        fetch(`http://localhost:8080/api/v1/role/${shift.role_id}`)
          .then(response => response.json())
          .then((data: Role) => ({ id: shift.role_id, name: data.name }))
          .catch(error => console.error(`Error fetching role ${shift.role_id}:`, error))
      );

      const roleData = await Promise.all(rolePromises);
      const roleMap: Record<number, string> = {};
      roleData.forEach(role => {
        if (role) {
          roleMap[role.id] = role.name;
        }
      });
      setRoles(roleMap);
    };

    if (shifts.length > 0) {
      fetchRoles();
    }
  }, [shifts]);

  return (
    <div className={styles.shiftItemContainerMain}>
      {shifts.length > 0 ? (
        shifts.map(shift => (
          <div key={shift.id} className={styles.shiftDetails}>
            {formatTime(shift.start)} - {formatTime(shift.end)}
            <div>{roles[shift.role_id] || 'Loading...'}</div>
          </div>
        ))
      ) : (
        <div className={styles.noShift}>Brak zmiany</div>
      )}
    </div>
  );
};

export default ShiftItem;