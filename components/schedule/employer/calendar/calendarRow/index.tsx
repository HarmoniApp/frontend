import React, { useEffect, useState, useMemo, useImperativeHandle, forwardRef } from 'react';
import EmployeeItem from './employeeItem';
import ShiftItem from './shiftItem';
import AddShift from '../addShift';
import EditShift from '../editShift';
import WeekSchedule from '@/components/types/weekSchedule';
import User from '@/components/types/user';
import Shift from '@/components/types/shift';
import Role from '@/components/types/role';
import styles from './main.module.scss';
import { fetchRoles } from "@/services/roleService"
import { Card } from 'primereact/card';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import 'primereact/resources/themes/saga-blue/theme.css';
import '@/styles/components/pagination.css';
import LoadingSpinner from '@/components/loadingSpinner';
import { deleteShift, fetchFilterUsersInSchedule, fetchUserScheduleWithAbsences, patchPublishShifts, postShift, putShift } from '@/services/scheduleService';

interface CalendarRowProps {
  currentWeek: Date[];
  searchQuery: string;
}

const CalendarRow = forwardRef(({ currentWeek, searchQuery }: CalendarRowProps, ref) => {
  const [users, setUsers] = useState<User[]>([]);
  const [schedules, setSchedules] = useState<Record<number, WeekSchedule>>({});

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);

  const [loadingRoles, setLoadingRoles] = useState<boolean>(true);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const [loadingSchedules, setLoadingSchedules] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      setLoadingRoles(true);
      await fetchRoles(setRoles);
      setLoadingRoles(false);
    };

    loadData();
  }, []);

  const fetchFilteredUsers = async (filters: { query?: string } = {}, pageNumber: number = 1, pageSize: number = 20) => {
    setLoadingUsers(true);

    try {
      await fetchFilterUsersInSchedule(filters, setUsers, setTotalPages, pageNumber, pageSize)
    } catch (error) {
      console.error('Error while filter:', error);
    } finally {
      setLoadingUsers(false);
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
          const schedulePromises = users.map(user =>
            fetchUserScheduleWithAbsences(user.id, currentWeek)
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
    setLoading(true);
    try {
      await postShift(shiftData)
      fetchUserSchedule(shiftData.userId);
    } catch (error) {
      console.error('Error editing shift:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditShift = async (shiftData: { id: number; start: string; end: string; userId: number; roleName: string; }) => {
    setLoading(true);
    try {
      await putShift(shiftData);
      fetchUserSchedule(shiftData.userId);
    } catch (error) {
      console.error('Error editing shift:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteShift = async (shiftId: number, userId: number) => {
    setLoading(true);
    await deleteShift(shiftId, userId, fetchUserSchedule);
    setLoading(false);
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
      setLoading(true);
      try {
        await patchPublishShifts(shift.id)
        setSchedules(prevSchedules => ({
          ...prevSchedules,
          [shift.user_id]: {
            ...prevSchedules[shift.user_id],
            shifts: prevSchedules[shift.user_id].shifts.map(s =>
              s.id === shift.id ? { ...s, published: true } : s
            ),
          },
        }));
      } catch (error) {
        console.error('Error publishing shift:', error);
      } finally {
        setLoading(false);
      }
    });
  };

  useImperativeHandle(ref, () => ({
    publishAll: handlePublishAll,
  }));

  const fetchUserSchedule = async (userId: number) => {
    try {
      const data = await fetchUserScheduleWithAbsences(userId, currentWeek);

      setSchedules(prevSchedules => ({
        ...prevSchedules,
        [userId]: {
          shifts: data.shifts,
          absences: data.absences
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
        <LoadingSpinner wholeModal={false}/>
      ) : !users || users.length === 0 ? (
        <Card title="Brak danych" className={styles.noDataCard}>
            <p>Brak dostępnych danych w tej chwili.</p>
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
          {loading && <LoadingSpinner />}
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
          firstName={users.find(user => user.id === selectedShift.user_id)?.firstname || 'Imie'}
          surname={users.find(user => user.id === selectedShift.user_id)?.surname || 'Nazwisko'}
          setLoading={setLoading}
        />
      )}
    </div>
  );
});
export default CalendarRow;