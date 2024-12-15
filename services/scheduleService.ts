import WeekSchedule from "@/components/types/weekSchedule";
import { fetchCsrfToken } from "./csrfService";
import Shift from "@/components/types/shift";
import AbsenceShort from "@/components/types/absenceShort";
import User from "@/components/types/user";
import { toast } from "react-toastify";

export const fetchUserPublishedSchedule = async (
    currentMonth: Date,
    userId: number,
    setWeekSchedule: (schedule: WeekSchedule | null) => void): Promise<void> => {

    const getMonthStartAndEnd = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth() + 1;
        const startDate = `${year}-${month.toString().padStart(2, '0')}-01T00:00`;
        const lastDayOfMonth = new Date(year, month, 0).getDate();
        const endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDayOfMonth}T23:59`;

        return { startDate, endDate };
    };

    try {
        const { startDate, endDate } = getMonthStartAndEnd();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/calendar/user/${userId}/week?startDate=${startDate}&endDate=${endDate}&published=true`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            }
        });
        const data: WeekSchedule = await response.json();
        setWeekSchedule(data);
    } catch (error) {
        console.error('Error fetching week schedule:', error);
    }
};

export const fetchUserScheduleWithAbsences = async (
    userId: number,
    currentWeek: Date[]): Promise<{ shifts: Shift[], absences: AbsenceShort[] }> => {
    try {
        const startDate = currentWeek[0].toISOString().split('T')[0] + 'T00:00:00';
        const endDate = currentWeek[currentWeek.length - 1].toISOString().split('T')[0] + 'T23:59:59';
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/calendar/user/${userId}/week?startDate=${startDate}&endDate=${endDate}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            },
        });

        const data = await response.json();
        return {
            shifts: data.shifts || [],
            absences: data.absences || []
        };
    } catch (error) {
        console.error(`Error fetching schedule for user ${userId}:`, error);
        throw error;
    }
};

export const fetchFilterUsersInSchedule = async (
    filters: { query?: string } = {},
    setUsers: (users: User[]) => void,
    setTotalPages: (pages: number) => void,
    pageNumber: number,
    pageSize: number): Promise<void> => {
    try {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/simple/empId?pageNumber=${pageNumber}&pageSize=${pageSize}`;

        if (filters.query && filters.query.trim() !== '') {
            url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/simple/empId/search?q=${filters.query}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            },
        });

        if (!response.ok) {
            console.error('Failed to fetch filter schedule:', response.statusText);
            throw new Error('Failed to fetch filter schedule');
        }
        const responseData = await response.json();
        const usersData = responseData.content || responseData;
        setUsers(usersData);
        setTotalPages(responseData.totalPages * pageSize);
    } catch (error) {
        console.error(`Error fetching schedule:`, error);
        throw error;
    }
};

export const postShift = async (
    shiftData: { start: string; end: string; userId: number; roleName: string }
): Promise<void> => {
    await toast.promise(
        (async () => {
            try {
                const tokenXSRF = await fetchCsrfToken();

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/shift`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                        'X-XSRF-TOKEN': tokenXSRF,
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        start: shiftData.start,
                        end: shiftData.end,
                        published: false,
                        user_id: shiftData.userId,
                        role_name: shiftData.roleName,
                    }),
                });

                if (!response.ok) {
                    const errorResponse = await response.json();
                    const errorMessage = errorResponse.message || 'Wystąpił błąd podczas dodawania zmiany.';
                    throw new Error(errorMessage);
                }
            } catch (error) {
                console.error('Error adding schedule:', error);
                throw error;
            }
        })(),
        {
            pending: 'Dodawanie zmiany...',
            success: 'Zmiana została dodana!',
            error: {
                render({ data }) {
                    const errorMessage = data instanceof Error ? data.message : 'Wystąpił błąd podczas dodawania zmiany.';
                    return errorMessage;
                },
            },
        }
    );
};

export const putShift = async (
    shiftData: { id: number; start: string; end: string; userId: number; roleName: string }
): Promise<void> => {
    await toast.promise(
        (async () => {
            try {
                const tokenXSRF = await fetchCsrfToken();

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/shift/${shiftData.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                        'X-XSRF-TOKEN': tokenXSRF,
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        start: shiftData.start,
                        end: shiftData.end,
                        published: false,
                        user_id: shiftData.userId,
                        role_name: shiftData.roleName,
                    }),
                });

                if (!response.ok) {
                    const errorResponse = await response.json();
                    const errorMessage = errorResponse.message || 'Wystąpił błąd podczas edytowania zmiany.';
                    throw new Error(errorMessage);
                }
            } catch (error) {
                console.error('Error updating schedule:', error);
                throw error;
            }
        })(),
        {
            pending: 'Aktualizowanie zmiany...',
            success: 'Zmiana została zaktualizowana!'
        }
    );
};

export const patchPublishShifts = async (
    shiftId: number
): Promise<void> => {
    await toast.promise(
        (async () => {
            try {
                const tokenXSRF = await fetchCsrfToken();

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/shift/${shiftId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                        'X-XSRF-TOKEN': tokenXSRF,
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    const errorResponse = await response.json();
                    const errorMessage = errorResponse.message || 'Wystąpił błąd podczas publikowania zmiany.';
                    throw new Error(errorMessage);
                }
            } catch (error) {
                console.error('Error publishing schedule:', error);
                throw error;
            }
        })(),
        {
            pending: 'Publikowanie zmiany...',
            success: 'Zmiana została opublikowana!'
        }
    );
};

export const deleteShift = async (
    shiftId: number,
    userId: number,
    fetchUserSchedule: (userId: number) => void
): Promise<void> => {
    await toast.promise(
        (async () => {
            try {
                const tokenXSRF = await fetchCsrfToken();

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/shift/${shiftId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                        'X-XSRF-TOKEN': tokenXSRF,
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    const errorResponse = await response.json();
                    const errorMessage = errorResponse.message || 'Wystąpił błąd podczas usuwania zmiany.';
                    throw new Error(errorMessage);
                }
                await fetchUserSchedule(userId);
            } catch (error) {
                console.error('Error deleting schedule:', error);
                throw error;
            }
        })(),
        {
            pending: 'Usuwanie zmiany...',
            success: 'Zmiana została usunięta!'
        }
    );
};