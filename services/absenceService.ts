import Absence from "@/components/types/absence";
import AbsenceType from "@/components/types/absenceType";


export const fetchAbsences = async (
    setAbsences: (absences: Absence[]) => void,
    setError: (errorMessage: string | null) => void,
    setLoading: (loading: boolean) => void): Promise<void> => {
    setLoading(true);
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/absence`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            },
        });
        const data = await response.json();
        setAbsences(data.content);
    } catch (error) {
        console.error('Error fetching absences:', error);
        setError('Błąd podczas pobierania urlopów');
    } finally {
        setLoading(false);
    }
};


export const fetchAbsenceType = async (
    id: number,
    setAbsenceType: (absences: AbsenceType | null) => void): Promise<void> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/absence-type/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            },
        });
        const data = await response.json();
        setAbsenceType(data);
    } catch (error) {
        console.error('Error fetching absence type:', error);
    }
};

export const fetchAbsenceTypes = async (
    setAbsenceTypes: (absences: AbsenceType[]) => void,
    setError: (errorMessage: string | null) => void,
    setLoading: (loading: boolean) => void): Promise<void> => {
    setLoading(true);
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/absence-type`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            },
        });
        const data = await response.json();
        setAbsenceTypes(data);
    } catch (error) {
        setError('Error fetching absence types');
        console.error('Błąd podczas pobierania typów urlopów:', error);
    } finally {
        setLoading(false);
    }
};

export const fetchAvailableAbsenceDays = async (
    userId: number,
    setAvailableAbsenceDays: (availableAbsenceDays: number | string) => void,
    setError: (errorMessage: string | null) => void,
    setLoading: (loading: boolean) => void): Promise<string | void> => {
    setLoading(true);
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/${userId}/availableAbsenceDays`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            },
        });

        const data = await response.json();
        setAvailableAbsenceDays(data)
    } catch (error) {
        console.error(`Error fetching absence available days`, error);
        setError('Błąd podczas pobierania dostępnych dni urlopu');
        setAvailableAbsenceDays('Nieznane');
    } finally {
        setLoading(false);
    }
};