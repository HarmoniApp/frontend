import { useState, useEffect } from 'react';
import { WeekSchedule } from '@/components/types/weekSchedule';
import { User } from '@/components/types/user';
import { fetchUserScheduleWithAbsences } from '@/services/scheduleService';

interface UseScheduleManagementProps {
    users: User[];
    currentWeek: Date[];
}

export const useSchedule = ({ users, currentWeek }: UseScheduleManagementProps) => {
    const [schedules, setSchedules] = useState<Record<number, WeekSchedule>>({});
    const [loadingSchedules, setLoadingSchedules] = useState<boolean>(false);
    const [abortController, setAbortController] = useState<AbortController | null>(null);

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
                    const schedulePromises = users.map(async (user) => {
                        try {
                            const data = await fetchUserScheduleWithAbsences(user.id, currentWeek);
                            return { userId: user.id, data };
                        } catch (error) {
                            if (error instanceof Error && error.name === 'AbortError') {
                                console.warn(`Fetch aborted for user ${user.id}`);
                            } else {
                                console.error(`Error fetching schedule for user ${user.id}:`, error);
                            }
                            return { userId: user.id, data: { shifts: [], absences: [] } };
                        }
                    });

                    const results = await Promise.all(schedulePromises);
                    const schedulesMap: Record<number, WeekSchedule> = {};

                    results.forEach(({ userId, data }) => {
                        schedulesMap[userId] = {
                            shifts: data.shifts || [],
                            absences: data.absences || [],
                        };
                    });
                    await setSchedules(schedulesMap);
                } catch (error) {
                    console.error('Error fetching schedules:', error);
                } finally {
                    setLoadingSchedules(false);
                }
            };
            fetchSchedules();
        }
    }, [users, currentWeek]);

    return {
        schedules,
        loadingSchedules,
        setSchedules,
    };
};