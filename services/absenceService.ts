import Absence from "@/components/types/absence";


export const fetchAbsences = async (
    setAbsences: (languages: Absence[]) => void,
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
        setError('Error fetching absences');
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
        setAvailableAbsenceDays('Unknown');
    } finally {
        setLoading(false);
    }
};