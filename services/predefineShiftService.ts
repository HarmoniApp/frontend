import { PredefinedShift } from "@/components/types/predefinedShifts";
import { fetchCsrfToken } from "./csrfService";
import { toast } from "react-toastify";

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
    setPredefineShifts: (shifts: PredefinedShift[]) => void
): Promise<void> => {
    const formattedValues = {
        ...values,
        start: formatTimeToHHMM(values.start),
        end: formatTimeToHHMM(values.end),
    };

    await toast.promise(
        (async () => {
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
                    const errorResponse = await response.json();
                    const errorMessage = errorResponse.message || 'Wystąpił błąd podczas dodawania zmiany.';
                    throw new Error(errorMessage);
                }
                await fetchPredefinedShifts(setPredefineShifts);
            } catch (error) {
                console.error('Error adding predefined shift:', error);
                throw error;
            }
        })(),
        {
            pending: 'Dodawanie zmiany...',
            success: 'Zmiana została dodana!'
        }
    );
};

export const putPredefineShift = async (
    values: any,
    setPredefineShifts: (shifts: PredefinedShift[]) => void
): Promise<void> => {
    const formattedValues = {
        ...values,
        start: formatTimeToHHMM(values.start),
        end: formatTimeToHHMM(values.end),
    };

    await toast.promise(
        (async () => {
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
                    const errorResponse = await response.json();
                    const errorMessage = errorResponse.message || 'Wystąpił błąd podczas edytowania zmiany.';
                    throw new Error(errorMessage);
                }
                await fetchPredefinedShifts(setPredefineShifts);
            } catch (error) {
                console.error('Error updating predefined shift:', error);
                throw error;
            }
        })(),
        {
            pending: 'Aktualizowanie zmiany...',
            success: 'Zmiana została zaktualizowana!'
        }
    );
};

export const deletePredefineShift = async (
    shiftId: number,
    setPredefineShifts: (shifts: PredefinedShift[]) => void
): Promise<void> => {
    await toast.promise(
        (async () => {
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
                    const errorResponse = await response.json();
                    const errorMessage = errorResponse.message || 'Wystąpił błąd podczas usuwania zmiany.';
                    throw new Error(errorMessage);
                }
                await fetchPredefinedShifts(setPredefineShifts);
            } catch (error) {
                console.error('Error deleting predefined shift:', error);
                throw error;
            }
        })(),
        {
            pending: 'Usuwanie zmiany...',
            success: 'Zmiana została usunięta!'
        }
    );
};