import PredefinedShift from "@/components/types/predefinedShifts";
import { fetchCsrfToken } from "./csrfService";

export const formatTimeToHHMM = (time: string): string => {
    if (!time) return '00:00';
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
};

export const fetchPredefinedShifts = async (
    setShifts: (shifts: PredefinedShift[]) => void): Promise<void> => {
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

export const postPredefineShift = async (
    values: any,
    setPredefineShifts: (shifts: PredefinedShift[]) => void): Promise<void> => {

    const formattedValues = {
        ...values,
        start: formatTimeToHHMM(values.start),
        end: formatTimeToHHMM(values.end),
    };
    try {
        const tokenXSRF = await fetchCsrfToken();

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/predefine-shift`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                'X-XSRF-TOKEN': tokenXSRF,
            },
            credentials: 'include',
            body: JSON.stringify(formattedValues),
        });
        if (!response.ok) {
            console.error('Failed to add shift:', response.statusText);
            throw new Error('Failed to add shift');
        }
        const data = await response.json();
        await fetchPredefinedShifts(setPredefineShifts);
    } catch (error) {
        console.error(`Error while generate`, error);
    }
};

export const putPredefineShift = async (
    values: any,
    setPredefineShifts: (shifts: PredefinedShift[]) => void): Promise<void> => {

    const formattedValues = {
        ...values,
        start: formatTimeToHHMM(values.start),
        end: formatTimeToHHMM(values.end),
    };
    try {
        const tokenXSRF = await fetchCsrfToken();

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/predefine-shift/${values.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                'X-XSRF-TOKEN': tokenXSRF,
            },
            credentials: 'include',
            body: JSON.stringify(formattedValues),
        });
        if (!response.ok) {
            console.error('Failed to edit predefine shifts: ', response.statusText);
            throw new Error('Failed to edit predefine shifts');
        }
        await fetchPredefinedShifts(setPredefineShifts);
    } catch (error) {
        console.error(`Error while editing predefine shift`, error);
    }
};

export const deletePredefineShift = async (
    shiftId: number,
    setPredefineShifts: (shifts: PredefinedShift[]) => void): Promise<void> => {
    try {
        const tokenXSRF = await fetchCsrfToken();

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/predefine-shift/${shiftId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                'X-XSRF-TOKEN': tokenXSRF,
            },
            credentials: 'include',
        });
        if (!response.ok) {
            console.error('Failed to delete shift:', response.statusText);
            throw new Error('Failed to delete shift');
        }
        await fetchPredefinedShifts(setPredefineShifts)
    } catch (error) {
        console.error('Error deleting shift:', error);
    }
};