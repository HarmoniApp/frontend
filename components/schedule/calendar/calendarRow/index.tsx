import React, { useEffect, useState, useMemo } from 'react';
import EmployeeItem from './employeeItem';
import ShiftItem from './shiftItem';
import WeekSchedule from '@/components/types/weekSchedule';
import User from '@/components/types/user';
import styles from './main.module.scss';
interface CalendarRowProps {
  currentWeek: Date[];
}

const CalendarRow: React.FC<CalendarRowProps> = ({ currentWeek }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [schedules, setSchedules] = useState<Record<number, WeekSchedule>>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/user/simple');
        const data: User[] = await response.json();
        console.log('Fetched users:', data);
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      const fetchSchedules = async () => {
        try {
          const startDate = currentWeek[0].toISOString().split('T')[0] + 'T00:00:00';
          const endDate = currentWeek[currentWeek.length - 1].toISOString().split('T')[0] + 'T23:59:59';
          
          const schedulePromises = users.map(user => 
            fetch(`http://localhost:8080/api/v1/calendar/user/${user.id}/week?startDate=${startDate}&endDate=${endDate}`)
              .then(response => response.json())
              .then(data => {
                console.log(`Fetched schedule for user ${user.id}:`, data);
                return { userId: user.id, data: data };
              })
              .catch(error => {
                console.error(`Error fetching schedule for user ${user.id}:`, error);
                return { userId: user.id, data: { shifts: [], absences: [] } };
              })
          );

          const results = await Promise.all(schedulePromises);
          const schedulesMap: Record<number, WeekSchedule> = {};

          results.forEach(({ userId, data }) => {
            schedulesMap[userId] = {
              shifts: data.shifts || [],
              absences: data.absences || []
            };
          });

          console.log('Final schedules map:', schedulesMap);
          setSchedules(schedulesMap);
        } catch (error) {
          console.error('Error fetching schedules:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchSchedules();
    }
  }, [users, currentWeek]);

  const renderedRows = useMemo(() => {
    if (loading) {
      return <div>Ładowanie danych...</div>;
    }

    return users.map((user) => (
      <div key={user.id} className={styles.userRow}>
        <div className={styles.nameContainer}>
          <EmployeeItem firstName={user.firstname} surname={user.surname}/>
        </div>
        <div className={styles.shiftContainer}>
          {currentWeek.map((day) => {
            const dayStr = day.toISOString().split('T')[0];
            const userShifts = schedules[user.id]?.shifts.filter((shift) => shift.start.startsWith(dayStr)) || [];
            const userAbsences = schedules[user.id]?.absences.filter((absence) => 
              new Date(absence.start) <= day && new Date(absence.end) >= day
            ) || [];

            return (
              <ShiftItem
                key={dayStr}
                date={dayStr}
                shifts={userAbsences.length > 0 ? [] : userShifts}
                absence={userAbsences.length > 0}
              />
            );
          })}
        </div>
      </div>
    ));
  }, [users, schedules, currentWeek, loading]);

  return (
    <div className={styles.calendarRow}>
      {renderedRows}
    </div>
  );
};
export default CalendarRow;