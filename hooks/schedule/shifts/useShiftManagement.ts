import { WeekSchedule } from "@/components/types/weekSchedule";
import { deleteShift, fetchUserScheduleWithAbsences, patchPublishShifts, postShift, putShift } from "@/services/scheduleService";
import { formatDate } from "@/utils/formatDate";

interface UseShiftManagementProps {
    currentWeek: Date[];
    setSchedules: React.Dispatch<React.SetStateAction<Record<number, WeekSchedule>>>;
}

export const useShiftManagement = ({ currentWeek, setSchedules }: UseShiftManagementProps) => {
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

    const handleAddShift = async (shiftData: { start: string; end: string; userId: number; roleName: string; }) => {
        try {
            await postShift(shiftData)
            fetchUserSchedule(shiftData.userId);
        } catch (error) {
            console.error('Error editing shift:', error);
        }
    };

    const handleEditShift = async (shiftData: { id: number; start: string; end: string; userId: number; roleName: string; }) => {
        try {
            await putShift(shiftData);
            fetchUserSchedule(shiftData.userId);
        } catch (error) {
            console.error('Error editing shift:', error);
        }
    };

    const handleDeleteShift = async (shiftId: number, userId: number) => {
        await deleteShift(shiftId, userId, fetchUserSchedule);
    };

    const handlePublishAll = async () => {
        try {
            const start = formatDate(currentWeek[0]);
            const end = formatDate(currentWeek[currentWeek.length - 1]);
            await patchPublishShifts(start, end)

            setSchedules(prevSchedules => {
                const updatedSchedules = { ...prevSchedules };
                Object.values(updatedSchedules).forEach(schedule => {
                    schedule.shifts = schedule.shifts.map(shift =>
                        !shift.published ? { ...shift, published: true } : shift
                    );
                });
                return updatedSchedules;
            });
        } catch (error) {
            console.error('Error publishing shift:', error);
        }
    };

    return {
        handleAddShift,
        handleEditShift,
        handleDeleteShift,
        handlePublishAll,
    };
}