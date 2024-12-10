import WeekSchedule from "@/components/types/weekSchedule";

export const fetchShiftsAndAbsences = async (
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