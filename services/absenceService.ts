import Absence from "@/components/types/absence";
import AbsenceStatus from "@/components/types/absenceStatus";
import AbsenceType from "@/components/types/absenceType";
import { fetchCsrfToken } from "./csrfService";

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

export const fetchAbsencesStatus = async (
    setAbsencesStatus: (statuses: AbsenceStatus[]) => void): Promise<void> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/status`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            },
        });
        const data = await response.json();
        setAbsencesStatus(data);
    } catch (error) {
        console.error('Error fetching absence statuses:', error);
    }
};

export const fetchAbsencesByStatus = async (
    setAbsences: (absences: Absence[]) => void,
    statusId: number): Promise<void> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/absence/status/${statusId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            },
        });
        const data = await response.json();
        setAbsences(data.content);
    } catch (error) {
        console.error('Error fetching absence statuses:', error);
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
        if (!response.ok) throw new Error('Failed to fetch absenceType');
        const data = await response.json();
        setAbsenceType(data);
    } catch (error) {
        console.error('Error fetching absence type:', error);
    }
};

export const fetchUserAbsences = async (
    userId: number,
    setAbsenceTypeNames: (types: { [key: number]: string }) => void,
    setAbsences: (absences: Absence[]) => void,
    setLoading: (loading: boolean) => void): Promise<void> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/absence/user/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            },
        });
        const data = await response.json();
        const absences = data.content;
        setAbsences(absences);

        const typeNames: { [key: number]: string } = {};
        await Promise.all(
            absences.map(async (absence: Absence) => {
                if (!typeNames[absence.absence_type_id]) {
                    const name = await fetchAbsenceTypeName(absence.absence_type_id);
                    typeNames[absence.absence_type_id] = name;
                }
            })
        );

        setAbsenceTypeNames(typeNames);
    } catch (error) {
        console.error('Error fetching user absences:', error);
    } finally {
        setLoading(false);
    }
}

export const fetchAbsenceTypeName = async (
    id: number): Promise<string> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/absence-type/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            },
        });
        if (!response.ok) throw new Error('Failed to fetch absenceTypeName');
        const data = await response.json();
        return data.name;
    } catch (error) {
        console.error(`Error fetching absence type name for ID ${id}:`, error);
        return 'Nieznane';
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
        if (!response.ok) throw new Error('Failed to fetch absenceTypes');
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
        if (!response.ok) throw new Error('Failed to fetch availableAbsenceDays');
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

export const postAbsence = async (
    values: any,
    onSend: number): Promise<void> => {

    try {
        const tokenXSRF = await fetchCsrfToken();

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/absence`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                'X-XSRF-TOKEN': tokenXSRF,
            },
            credentials: 'include',
            body: JSON.stringify({
                absence_type_id: values.absence_type_id,
                start: values.start,
                end: values.end,
                user_id: onSend,
            }),
        });
        if (!response.ok) {
            console.error('Failed to add absence: ', response.statusText);
            throw new Error(`Failed to add absence'}`);
        }
    } catch (error) {
        console.error(`Error while adding asbence`, error);
    }
};

export const deleteAbsence = async (
    absenceId: number,
    userId: number,
    setAbsenceTypeNames: (types: { [key: number]: string }) => void,
    setAbsences: (absences: Absence[]) => void,
    setLoading: (loading: boolean) => void): Promise<void> => {

    setLoading(true);
    try {
        const tokenXSRF = await fetchCsrfToken();

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/absence/${absenceId}/status/3`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                'X-XSRF-TOKEN': tokenXSRF,
            },
            credentials: 'include',
        });
        if (!response.ok) {
            console.error('Failed to cancel absence: ', response.statusText);
            throw new Error(`Failed to cancel absence`);
        }
        setLoading(false);
        fetchUserAbsences(userId, setAbsenceTypeNames, setAbsences, setLoading)
    } catch (error) {
        console.error(`Error canceling absence`, error);
    } finally {
        setLoading(false);
    }
};