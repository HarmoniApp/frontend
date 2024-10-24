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

import { ProgressSpinner } from 'primereact/progressspinner';
import { Card } from 'primereact/card';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import 'primereact/resources/themes/saga-blue/theme.css';
import './main.css';

interface CalendarRowProps {
  currentWeek: Date[];
  searchQuery: string;
}

const CalendarRow = forwardRef(({ currentWeek, searchQuery }: CalendarRowProps, ref) => {
  const [users, setUsers] = useState<User[]>([]);
  const [schedules, setSchedules] = useState<Record<number, WeekSchedule>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingRoles, setLoadingRoles] = useState<boolean>(true);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const [loadingSchedules, setLoadingSchedules] = useState<boolean>(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [roles, setRoles] = useState<RoleWithColour[]>([]);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchRoles = async () => {
      setLoadingRoles(true);
      try {
        const response = await fetch('http://localhost:8080/api/v1/role');
        const data = await response.json();
        setRoles(data);
      } catch (error) {
        console.error('Error fetching roles:', error);
      } finally {
        setLoadingRoles(false);
      }
    };

    fetchRoles();
  }, []);

  const fetchFilteredUsers = (filters: { query?: string } = {}, pageNumber: number = 1, pageSize: number = 20) => {
    setLoadingUsers(true);

    let url = `http://localhost:8080/api/v1/user/simple/empId?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    if (filters.query && filters.query.trim() !== '') {
      url = `http://localhost:8080/api/v1/user/simple/empId/search?q=${filters.query}`;
    }

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(responseData => {
        const usersData = responseData.content || responseData;

        if (Array.isArray(usersData)) {
          setUsers(usersData);
        } else {
          console.error('Unexpected response format, expected an array but got:', usersData);
          setUsers([]);
        }
        setTotalPages(responseData.totalPages * pageSize);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      })
      .finally(() => {
        setLoadingUsers(false);
      });
  };

  useEffect(() => {
    fetchFilteredUsers({ query: searchQuery }, pageNumber, pageSize);
  }, [searchQuery, pageNumber, pageSize]);

  useEffect(() => {
    if (users.length > 0) {
      setLoadingSchedules(true);
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
          setLoadingSchedules(false);
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
    const getMoreInfoOfEmployee = (user_id: number) => {
      const url = `http://localhost:3000/employees/user/${user_id}`;
      window.open(url, '_blank');
    };

    return users.map((user) => {
      return (
        <div key={user.id} className={styles.calendarRowContainerMain}>
          <div className={styles.employeeItemContainer} onClick={() => getMoreInfoOfEmployee(user.id)}>
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
      );
    });
  }, [users, schedules, currentWeek, loadingUsers, loadingRoles, loadingSchedules]);

  return (
    <div>
      {loadingUsers || loadingRoles || loadingSchedules ? (
        <div className={styles.spinnerContainer}><ProgressSpinner /></div>
      ) : !users || users.length === 0 ? (
        <Card title="No Data" className={styles.noDataCard}>
          <p>There is no data available at the moment.</p>
        </Card>
      ) : (
        <>
          {renderedRows}
          <Paginator
            first={(pageNumber - 1) * pageSize}
            rows={pageSize}
            totalRecords={totalPages}
            rowsPerPageOptions={[20, 50, 100]}
            onPageChange={(event: PaginatorPageChangeEvent) => {
              setPageNumber(Math.floor(event.first / event.rows) + 1);
              setPageSize(event.rows);
            }}
          />
        </>
      )}

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
          firstName={users.find(user => user.id === selectedShift.user_id)?.firstname || 'test'}
          surname={users.find(user => user.id === selectedShift.user_id)?.surname || 'test'}
        />
      )}
    </div>
  );
});
export default CalendarRow;