import WeekSchedule from "@/components/types/weekSchedule";
import { fetchCsrfToken } from "./csrfService";
import Shift from "@/components/types/shift";
import AbsenceShort from "@/components/types/absenceShort";

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

export const fetchUserSchedule = async (
    userId: number,
    currentWeek: Date[]): Promise<{ shifts: Shift[], absences: AbsenceShort[] }> => {
    try {
        const startDate = currentWeek[0].toISOString().split('T')[0] + 'T00:00:00';
        const endDate = currentWeek[currentWeek.length - 1].toISOString().split('T')[0] + 'T23:59:59';
        const tokenJWT = sessionStorage.getItem('tokenJWT');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/calendar/user/${userId}/week?startDate=${startDate}&endDate=${endDate}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenJWT}`,
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


export const deleteShift = async (
    shiftId: number,
    userId: number,
    fetchUsersSchedule: (userId: number) => void,
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
        fetchUsersSchedule(userId);
    } catch (error) {
        console.error('Error deleting shift:', error);
    } finally {
        setLoading(false);
    }
};