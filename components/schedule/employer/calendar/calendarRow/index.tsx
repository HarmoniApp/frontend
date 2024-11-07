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
  const [modalIsOpenLoadning, setModalIsOpenLoadning] = useState(false);
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/role`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
          },
        });
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

  const fetchFilteredUsers = async (filters: { query?: string } = {}, pageNumber: number = 1, pageSize: number = 20) => {
    setLoading(true);
    const query = filters.query ? `/search?q=${filters.query}` : '';
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/simple/empId?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
        }
      });
      const data = await response.json();
      setUsers(data.content || data);
      setTotalPages(data.totalPages * pageSize);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
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
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/calendar/user/${user.id}/week?startDate=${startDate}&endDate=${endDate}`, {
              signal: newAbortController.signal,
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
              }
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
    setModalIsOpenLoadning(true);
    try {
      const tokenJWT = sessionStorage.getItem('tokenJWT');
      const resquestXsrfToken = await fetch(`http://localhost:8080/api/v1/csrf`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenJWT}`,
        },
        credentials: 'include',
      });

      if (resquestXsrfToken.ok) {
        const data = await resquestXsrfToken.json();
        const tokenXSRF = data.token;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/shift`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            'X-XSRF-TOKEN': tokenXSRF,
          },
          body: JSON.stringify({
            start: shiftData.start,
            end: shiftData.end,
            published: false,
            user_id: shiftData.userId,
            role_name: shiftData.roleName,
          }),
        });

        if (!response.ok) {
          console.error('Failed to add add shift:', response.statusText);
          throw new Error('Failed to add add shift');
        }
        setModalIsOpenLoadning(false);
        fetchUserSchedule(shiftData.userId);
      } else {
        console.error('Failed to fetch XSRF token, response not OK');
      }
    } catch (error) {
      console.error('Error adding add shift:', error);
      throw error;
    }
  };

  const handleEditShift = async (shiftData: { id: number; start: string; end: string; userId: number; roleName: string; }) => {
    setModalIsOpenLoadning(true);
    try {
      const tokenJWT = sessionStorage.getItem('tokenJWT');
      const resquestXsrfToken = await fetch(`http://localhost:8080/api/v1/csrf`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenJWT}`,
        },
        credentials: 'include',
      });

      if (resquestXsrfToken.ok) {
        const data = await resquestXsrfToken.json();
        const tokenXSRF = data.token;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/shift/${shiftData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            'X-XSRF-TOKEN': tokenXSRF,
          },
          body: JSON.stringify({
            start: shiftData.start,
            end: shiftData.end,
            published: false,
            user_id: shiftData.userId,
            role_name: shiftData.roleName,
          }),
        });
        if (!response.ok) {
          console.error('Failed to edit shift');
          throw new Error('Failed to edit shift');
        }
        setModalIsOpenLoadning(false);
        fetchUserSchedule(shiftData.userId);
      } else {
        console.error('Failed to fetch XSRF token, response not OK');
      }
    } catch (error) {
      console.error('Error editing shift:', error);
      throw error;
    }
  };

  const handleDeleteShift = async (shiftId: number, userId: number) => {
    setModalIsOpenLoadning(true);
    try {
      const tokenJWT = sessionStorage.getItem('tokenJWT');
      const resquestXsrfToken = await fetch(`http://localhost:8080/api/v1/csrf`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenJWT}`,
        },
        credentials: 'include',
      });

      if (resquestXsrfToken.ok) {
        const data = await resquestXsrfToken.json();
        const tokenXSRF = data.token;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/shift/${shiftId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            'X-XSRF-TOKEN': tokenXSRF,
          }
        });
        if (!response.ok) {
          console.error('Failed to delete shift: ', response.statusText);
          throw new Error('Failed to delete shift');
        }
        setModalIsOpenLoadning(false);
        fetchUserSchedule(userId);
      } else {
        console.error('Failed to fetch XSRF token, response not OK');
      }
    } catch (error) {
      console.error('Error deleting shift:', error);
      throw error;
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
      setModalIsOpenLoadning(true);
      try {
        const tokenJWT = sessionStorage.getItem('tokenJWT');
        const resquestXsrfToken = await fetch(`http://localhost:8080/api/v1/csrf`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenJWT}`,
          },
          credentials: 'include',
        });

        if (resquestXsrfToken.ok) {
          const data = await resquestXsrfToken.json();
          const tokenXSRF = data.token;

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/shift/${shift.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
              'X-XSRF-TOKEN': tokenXSRF,
            }
          });
          if (!response.ok) {
            console.error(`Failed to publish shift ${shift.id}`);
            throw new Error(`Failed to publish shift ${shift.id}`);
          }
          setModalIsOpenLoadning(false);
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
          console.error('Failed to fetch XSRF token, response not OK');
        }
      } catch (error) {
        console.error('Error publishing shift:', error);
        throw error;
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
      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/calendar/user/${userId}/week?startDate=${startDate}&endDate=${endDate}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
        }
      });

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
      const url = `${process.env.NEXT_PUBLIC_API_URL}/employees/user/${user_id}`;
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

      {modalIsOpenLoadning && (
        <div className={styles.loadingModalOverlay}>
          <div className={styles.loadingModalContent}>
            <div className={styles.spinnerContainer}><ProgressSpinner /></div>
          </div>
        </div>
      )}
    </div>
  );
});
export default CalendarRow;