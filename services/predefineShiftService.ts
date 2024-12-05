import PredefinedShift from "@/components/types/predefinedShifts";

export const formatTimeToHHMM = (time: string): string => {
    if (!time) return '00:00';
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
};

export const fetchPredefinedShifts = async (
    setShifts: (roles: PredefinedShift[]) => void): Promise<void> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/predefine-shift`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            },
        });
        if (!response.ok) throw new Error('Failed to fetch predefinedShifts');
        const data = await response.json();
        const validatedData = data.map((shift: PredefinedShift) => ({
            ...shift,
            start: formatTimeToHHMM(shift.start || '00:00'),
            end: formatTimeToHHMM(shift.end || '00:00'),
          }));
        setShifts(validatedData);
    } catch (error) {
        console.error('Error fetching predefined shifts:', error);
    }
};