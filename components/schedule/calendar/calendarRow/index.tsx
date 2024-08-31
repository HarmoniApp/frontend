import React, { useEffect, useState, useMemo } from 'react';
import EmployeeItem from './employeeItem';
import ShiftItem from './shiftItem';
import AddShift from '@/components/schedule/calendar/addShift';
import EditShift from '@/components/schedule/calendar/editShift';
import WeekSchedule from '@/components/types/weekSchedule';
import User from '@/components/types/user';
import Shift from '@/components/types/shift';
import styles from './main.module.scss';

interface CalendarRowProps {
  currentWeek: Date[];
}

const CalendarRow: React.FC<CalendarRowProps> = ({ currentWeek }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [schedules, setSchedules] = useState<Record<number, WeekSchedule>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>('');

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

  const handleAddShiftClick = (user: User, day: string) => {
    setSelectedUser(user);
    setSelectedDay(day);
    setIsAddModalOpen(true);
  };

  const handleEditShiftClick = (shift: Shift) => {
    console.log('Clicked shift to edit:', shift);
    setSelectedShift(shift);
    setIsEditModalOpen(true);
    console.log('isEditModalOpen set to true');
  };

  const handleAddShift = async (shiftData: { start: string; end: string; userId: number; roleName: string; }) => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/shift', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          start: shiftData.start,
          end: shiftData.end,
          published: false,
          user_id: shiftData.userId,
          role_name: shiftData.roleName,
        }),
      });

      if (response.ok) {
        console.log('Shift added successfully', shiftData);
        const fetchUserSchedule = async () => {
          try {
            const startDate = currentWeek[0].toISOString().split('T')[0] + 'T00:00:00';
            const endDate = currentWeek[currentWeek.length - 1].toISOString().split('T')[0] + 'T23:59:59';
            const userResponse = await fetch(`http://localhost:8080/api/v1/calendar/user/${shiftData.userId}/week?startDate=${startDate}&endDate=${endDate}`);

            if (!userResponse.ok) {
              throw new Error(`Failed to fetch schedule for user ${shiftData.userId}`);
            }

            const data = await userResponse.json();
            console.log(`Fetched updated schedule for user ${shiftData.userId}:`, data);

            setSchedules(prevSchedules => ({
              ...prevSchedules,
              [shiftData.userId]: {
                shifts: data.shifts || [],
                absences: data.absences || []
              }
            }));
          } catch (error) {
            console.error(`Error fetching schedule for user ${shiftData.userId}:`, error);
          }
        };

        fetchUserSchedule();
      } else {
        console.error('Failed to add shift');
      }
    } catch (error) {
      console.error('Error adding shift:', error);
    }
  };

  const handleEditShift = async (shiftData: { id: number; start: string; end: string; userId: number; roleName: string; }) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/shift/${shiftData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          start: shiftData.start,
          end: shiftData.end,
          published: false,
          user_id: shiftData.userId,
          role_name: shiftData.roleName,
        }),
      });

      if (response.ok) {
        console.log('Shift edited successfully', shiftData);
        const fetchUserSchedule = async () => {
          try {
            const startDate = currentWeek[0].toISOString().split('T')[0] + 'T00:00:00';
            const endDate = currentWeek[currentWeek.length - 1].toISOString().split('T')[0] + 'T23:59:59';
            const userResponse = await fetch(`http://localhost:8080/api/v1/calendar/user/${shiftData.userId}/week?startDate=${startDate}&endDate=${endDate}`);

            if (!userResponse.ok) {
              throw new Error(`Failed to fetch schedule for user ${shiftData.userId}`);
            }

            const data = await userResponse.json();
            console.log(`Fetched updated schedule for user ${shiftData.userId}:`, data);

            setSchedules(prevSchedules => ({
              ...prevSchedules,
              [shiftData.userId]: {
                shifts: data.shifts || [],
                absences: data.absences || []
              }
            }));
          } catch (error) {
            console.error(`Error fetching schedule for user ${shiftData.userId}:`, error);
          }
        };

        fetchUserSchedule();
      } else {
        console.error('Failed to edit shift');
      }
    } catch (error) {
      console.error('Error editing shift:', error);
    }
  };

  const renderedRows = useMemo(() => {
    if (loading) {
      return <div>Ładowanie danych...</div>;
    }

    return users.map((user) => (
      <div key={user.id} className={styles.userRow}>
        <div className={styles.nameContainer}>
          <EmployeeItem firstName={user.firstname} surname={user.surname} />
        </div>
        <div className={styles.shiftContainer}>
          {currentWeek.map((day) => {
            const dayStr = day.toISOString().split('T')[0];

            const userShifts = schedules[user.id]?.shifts.filter((shift) => shift.start.startsWith(dayStr)) || [];
            const userAbsences = schedules[user.id]?.absences.filter((absence) =>
              new Date(absence.start) <= day && new Date(absence.end) >= day
            ) || [];

            return (
              <div key={dayStr}>
                {userShifts.length === 0 ? (
                  <div onClick={() => handleAddShiftClick(user, dayStr)}>
                    <ShiftItem
                      date={dayStr}
                      shifts={[]}
                      absence={userAbsences.length > 0}
                    />
                  </div>
                ) : (
                  userShifts.map(shift => (
                    <div key={shift.id} onClick={() => handleEditShiftClick(shift)}>
                      <ShiftItem
                        date={dayStr}
                        shifts={[shift]}
                        absence={userAbsences.length > 0}
                      />
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </div>
      </div>
    ));
  }, [users, schedules, currentWeek, loading]);

  return (
    <div className={styles.calendarRow}>
      {renderedRows}
      {isAddModalOpen && selectedUser && selectedDay && (
        <AddShift
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddShift={handleAddShift}
          user={selectedUser}
          day={selectedDay}
        />
      )}
      {isEditModalOpen && selectedShift && (
        <EditShift
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onEditShift={handleEditShift}
          shift={selectedShift}
          firstName={users.find(user => user.id === selectedShift.user_id)?.firstname || ''}
          surname={users.find(user => user.id === selectedShift.user_id)?.surname || ''}
        />
      )}
    </div>
  );
};
export default CalendarRow;