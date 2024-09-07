import React, { useEffect, useState, useMemo, useImperativeHandle, forwardRef } from 'react';
import EmployeeItem from './employeeItem';
import ShiftItem from './shiftItem';
import AddShift from '../addShift';
import EditShift from '../editShift';
import WeekSchedule from '@/components/types/weekSchedule';
import User from '@/components/types/user';
import Shift from '@/components/types/shift';
import RoleWithColour from '@/components/types/roleWithColour';
import styles from './main.module.scss';

interface CalendarRowProps {
  currentWeek: Date[];
}

const CalendarRow = forwardRef(({ currentWeek }: CalendarRowProps, ref) => {
  const [users, setUsers] = useState<User[]>([]);
  const [schedules, setSchedules] = useState<Record<number, WeekSchedule>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [roles, setRoles] = useState<RoleWithColour[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/role');
        const data = await response.json();
        setRoles(data);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/user/simple/empId');
        const data: User[] = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      if (abortController) {
        abortController.abort();
      }

      const newAbortController = new AbortController(); 
      setAbortController(newAbortController);
      const fetchSchedules = async () => {
        try {
          const startDate = currentWeek[0].toISOString().split('T')[0] + 'T00:00:00';
          const endDate = currentWeek[currentWeek.length - 1].toISOString().split('T')[0] + 'T23:59:59';

          const schedulePromises = users.map(user =>
            fetch(`http://localhost:8080/api/v1/calendar/user/${user.id}/week?startDate=${startDate}&endDate=${endDate}`, {
              signal: newAbortController.signal,
            })
              .then(response => {
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                return response.json();
              })
              .then(data => {
                return { userId: user.id, data: data };
              })
              .catch(error => {
                if (error.name === 'AbortError') {
                } else {
                  console.error(`Error fetching schedule for user ${user.id}:`, error);
                }
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
    setSelectedShift(shift);
    setIsEditModalOpen(true);
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
        fetchUserSchedule(shiftData.userId);
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
        fetchUserSchedule(shiftData.userId);
      } else {
        console.error('Failed to edit shift');
      }
    } catch (error) {
      console.error('Error editing shift:', error);
    }
  };

  const handleDeleteShift = async (shiftId: number, userId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/shift/${shiftId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchUserSchedule(userId);
      } else {
        console.error('Failed to delete shift');
      }
    } catch (error) {
      console.error('Error deleting shift:', error);
    }
  };

  const handlePublishAll = async () => {
    const shiftsToPublish: Shift[] = [];

    Object.values(schedules).forEach(schedule => {
      schedule.shifts.forEach(shift => {
        if (!shift.published) {
          shiftsToPublish.push(shift);
        }
      });
    });

    shiftsToPublish.forEach(async (shift) => {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/shift/${shift.id}`, {
          method: 'PATCH',
        });

        if (response.ok) {
          setSchedules(prevSchedules => ({
            ...prevSchedules,
            [shift.user_id]: {
              ...prevSchedules[shift.user_id],
              shifts: prevSchedules[shift.user_id].shifts.map(s => 
                s.id === shift.id ? { ...s, published: true } : s
              ),
            },
          }));
        } else {
          console.error(`Failed to publish shift ${shift.id}`);
        }
      } catch (error) {
        console.error('Error publishing shift:', error);
      }
    });
  };

  useImperativeHandle(ref, () => ({
    publishAll: handlePublishAll,
  }));

  const fetchUserSchedule = async (userId: number) => {
    try {
      const startDate = currentWeek[0].toISOString().split('T')[0] + 'T00:00:00';
      const endDate = currentWeek[currentWeek.length - 1].toISOString().split('T')[0] + 'T23:59:59';
      const userResponse = await fetch(`http://localhost:8080/api/v1/calendar/user/${userId}/week?startDate=${startDate}&endDate=${endDate}`);

      if (!userResponse.ok) {
        throw new Error(`Failed to fetch schedule for user ${userId}`);
      }

      const data = await userResponse.json();

      setSchedules(prevSchedules => ({
        ...prevSchedules,
        [userId]: {
          shifts: data.shifts || [],
          absences: data.absences || []
        }
      }));
    } catch (error) {
      console.error(`Error fetching schedule for user ${userId}:`, error);
    }
  };

  const renderedRows = useMemo(() => {
    if (loading) {
      return <div>Ładowanie danych...</div>;
    }
  
    return users.map((user) => (
      <div key={user.id} className={styles.calendarRowContainerMain}>
        <div className={styles.employeeItemContainer}>
          <EmployeeItem employeeId={user.employee_id} firstName={user.firstname} surname={user.surname} />
        </div>
        <div className={styles.shiftItemContainer}>
          {currentWeek.map((day) => {
            const dayStr = day.toISOString().split('T')[0];
  
            const userShifts = schedules[user.id]?.shifts.filter((shift) => shift.start.startsWith(dayStr)) || [];
            const userAbsences = schedules[user.id]?.absences.filter((absence) =>
              new Date(absence.start) <= day && new Date(absence.end) >= day
            ) || [];
  
            const isAbsence = userAbsences.length > 0;
  
            return (
              <div key={dayStr} className={styles.shiftsItems}>
                {userShifts.length === 0 ? (
                  <div
                    onClick={() => !isAbsence && handleAddShiftClick(user, dayStr)}
                  >
                    <ShiftItem
                      date={dayStr}
                      shifts={[]}
                      absence={isAbsence}
                      roles={roles}
                    />
                  </div>
                ) : (
                  userShifts.map(shift => (
                    <div key={shift.id} onClick={() => handleEditShiftClick(shift)}>
                      <ShiftItem
                        date={dayStr}
                        shifts={[shift]}
                        absence={isAbsence}
                        roles={roles}
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
    <div>
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
          onDeleteShift={handleDeleteShift}
          shift={selectedShift}
          firstName={users.find(user => user.id === selectedShift.user_id)?.firstname || ''}
          surname={users.find(user => user.id === selectedShift.user_id)?.surname || ''}
        />
      )}
    </div>
  );
});
export default CalendarRow;