import React, { useEffect, useState, useMemo, useImperativeHandle, forwardRef } from 'react';
import EmployeeItem from './employeeItem';
import ShiftItem from './shiftItem';
import AddShift from '../addShift';
import EditShift from '../editShift';
import WeekSchedule from '@/components/types/weekSchedule';
import User from '@/components/types/user';
import Shift from '@/components/types/shift';
import styles from './main.module.scss';
import { Card } from 'primereact/card';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import '@/styles/components/pagination.css';
import LoadingSpinner from '@/components/loadingSpinner';
import { fetchFilterUsersInSchedule, fetchUserScheduleWithAbsences } from '@/services/scheduleService';
import { useRoles } from '@/hooks/roles/useRoles';
import { useShiftManagement } from '@/hooks/shifts/useShiftManagement';
import { useShiftModals } from '@/hooks/shifts/useShiftModals';

interface CalendarRowProps {
  currentWeek: Date[];
  searchQuery: string;
}

const CalendarRow = forwardRef(({ currentWeek, searchQuery }: CalendarRowProps, ref) => {
  const { roles, loadingRoles } = useRoles();
  const [users, setUsers] = useState<User[]>([]);
  const [schedules, setSchedules] = useState<Record<number, WeekSchedule>>({});

  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const [loadingSchedules, setLoadingSchedules] = useState<boolean>(true);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);

  const {
    handleAddShift,
    handleEditShift,
    handleDeleteShift,
    handlePublishAll } = useShiftManagement({ currentWeek, setSchedules });

  const {
    isAddModalOpen,
    isEditModalOpen,
    selectedUser,
    selectedShift,
    selectedDay,
    handleAddShiftClick,
    handleEditShiftClick,
    setIsAddModalOpen,
    setIsEditModalOpen,
  } = useShiftModals();

  useEffect(() => {
    const loadData = async () => {
      setLoadingUsers(true);
      await fetchFilterUsersInSchedule({ query: searchQuery }, setUsers, setTotalPages, pageNumber, pageSize)
      setLoadingUsers(false);
    }
    loadData();
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

  useImperativeHandle(ref, () => ({
    publishAll: handlePublishAll,
  }));

  const renderedRows = useMemo(() => {

    const getMoreInfoOfEmployee = (user_id: number) => {
      const url = `http://localhost:3000/employees/user/${user_id}`;
      window.open(url, '_blank');
    };

    return users.map((user) => {
      return (
        <div key={user.id} className={styles.calendarRowContainerMain}>
          <div className={styles.employeeItemContainer} onClick={() => getMoreInfoOfEmployee(user.id)}>
            <EmployeeItem employeeId={user.employee_id} firstName={user.firstname} surname={user.surname} userId={user.id} />
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
        <LoadingSpinner wholeModal={false} />
      ) : !users || users.length === 0 ? (
        <Card title="Brak zmian" className={styles.noDataCard}></Card>
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
          onAddShift={(shiftData) => {
            handleAddShift(shiftData);
          }}
          user={selectedUser}
          day={selectedDay}
        />
      )}
      {isEditModalOpen && selectedShift && (
        <EditShift
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onEditShift={(shiftData) => {
            handleEditShift(shiftData);
          }}
          onDeleteShift={(shiftId, userId) => {
            handleDeleteShift(shiftId, userId);
          }}
          shift={selectedShift}
          firstName={users.find(user => user.id === selectedShift.user_id)?.firstname || 'Imie'}
          surname={users.find(user => user.id === selectedShift.user_id)?.surname || 'Nazwisko'}
        />
      )}
    </div>
  );
});
export default CalendarRow;