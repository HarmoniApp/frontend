import React, { useEffect, useState } from 'react';
import EmployeeItem from './employeeItem';
import ShiftItem from './shiftItem';
import styles from './main.module.scss';

interface User {
  id: number;
  firstname: string;
  surname: string;
}

interface Shift {
  id: number;
  start: string;
  end: string;
  user_id: number;
  role_id: number;
}

interface CalendarRowProps {
  currentWeek: Date[];
}

const CalendarRow: React.FC<CalendarRowProps> = ({ currentWeek }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [shifts, setShifts] = useState<Record<number, Shift[]>>({});

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/user/simple')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      const startDate = currentWeek[0].toISOString().split('T')[0];
      const endDate = currentWeek[currentWeek.length - 1].toISOString().split('T')[0];

      users.forEach((user) => {
        fetch(`http://localhost:8080/api/v1/shift/range?start=${startDate}T00:00&end=${endDate}T23:00&user_id=${user.id}`)
          .then((response) => response.json())
          .then((data) => {
            setShifts((prevShifts) => ({
              ...prevShifts,
              [user.id]: data,
            }));
          })
          .catch((error) => console.error('Error fetching shifts:', error));
      });
    }
  }, [users, currentWeek]);

  return (
    <div className={styles.calendarRow}>
      {users.map((user) => (
        <div key={user.id} className={styles.userRow}>
          <div className={styles.nameContainer}>
            <EmployeeItem name={`${user.firstname} ${user.surname}`} />
          </div>
          <div className={styles.shiftContainer}>
            {currentWeek.map((day) => (
              <ShiftItem
                key={day.toISOString()}
                date={day.toISOString().split('T')[0]}
                shifts={shifts[user.id]?.filter((shift) => shift.start.startsWith(day.toISOString().split('T')[0])) || []}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
export default CalendarRow;