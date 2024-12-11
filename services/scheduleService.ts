import WeekSchedule from "@/components/types/weekSchedule";
import { fetchCsrfToken } from "./csrfService";
import Shift from "@/components/types/shift";
import AbsenceShort from "@/components/types/absenceShort";
import User from "@/components/types/user";

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
    shiftData: { start: string; end: string; userId: number; roleName: string; }): Promise<void> => {

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
            console.error('Failed to add add shift:', response.statusText);
            throw new Error('Failed to add add shift');
        }
    } catch (error) {
        console.error(`Error while generate`, error);
    }
};

export const putShift = async (
    shiftData: { id: number; start: string; end: string; userId: number; roleName: string; }): Promise<void> => {

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
            console.error('Failed to edit shift');
            throw new Error('Failed to edit shift');
        }
    } catch (error) {
        console.error(`Error while edit shift`, error);
    }
};

export const deleteShift = async (
    shiftId: number,
    userId: number,
    fetchUserSchedule: (userId: number) => void,
    setLoading: (loading: boolean) => void): Promise<void> => {

    setLoading(true);
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
            console.error('Failed to delete shift: ', response.statusText);
            throw new Error('Failed to delete shift');
        }
        setLoading(false);
        fetchUserSchedule(userId);
    } catch (error) {
        console.error('Error deleting shift:', error);
    } finally {
        setLoading(false);
    }
};
