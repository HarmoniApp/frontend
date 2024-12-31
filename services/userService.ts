import { EmployeeData } from "@/components/types/employeeData";
import { User } from "@/components/types/user";
import { Supervisor } from "@/components/types/supervisor";
import { fetchCsrfToken } from "./csrfService";
import { PersonTile } from "@/components/types/personTile";
import { toast } from "react-toastify";

export const fetchSimpleUser = async (
    id: number,
    setUser?: (users: User) => void,
    setSupervisorData?: (supervisor: Supervisor) => void): Promise<void> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/simple/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            },
        });
        const data = await response.json();
        setUser?.(data);
        setSupervisorData?.(data);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};

export const fetchUserData = async (
    id: string | number,
    setEmployee: (users: EmployeeData | null) => void,
    setSupervisorData?: (supervisor: Supervisor | null) => void): Promise<void> => {

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            }
        });
        if (!response.ok) throw new Error('Failed to fetch employee data');
        const data = await response.json();
        setEmployee(data);
        if (setSupervisorData != undefined) {
            if (data.supervisor_id) {
                fetchSimpleUser(data.supervisor_id, setSupervisorData);
            }
        }
    } catch (error) {
        console.error('Error fetching roles:', error);
    }
};

export const fetchFilterUsers = async (
    filters: { roles?: number[]; languages?: number[]; order?: string; query?: string } = {},
    pageNumber: number,
    pageSize: number,
    setData: (users: PersonTile[]) => void,
    setTotalRecords: (records: number) => void): Promise<void> => {

    try {
        let url = '';
        if (filters.query && filters.query.trim() !== '') {
            url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/simple/search?q=${filters.query}`;
        } else {
            url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/simple?pageNumber=${pageNumber}&pageSize=${pageSize}`;

            const params = new URLSearchParams();

            if (filters.roles && filters.roles.length) {
                params.append('roles', filters.roles.join(','));
            } 
            if (filters.languages && filters.languages.length) {
                filters.languages.forEach(language => params.append('language', language.toString()));
            }
            if (filters.order) params.append('order', filters.order);

            if (params.toString()) {
                url += `&${params.toString()}`;
            }
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            }

        });
        const responseData = await response.json();
        if (responseData && responseData.content) {
            setData(responseData.content);
            setTotalRecords(responseData.pageSize * responseData.totalPages);
        } else if (responseData && responseData.length > 0) {
            setData(responseData);
        } else {
            setData([]);
            setTotalRecords(0);
        }
    } catch (error) {
        console.error('Error while filter users:', error);
    }
};

export const fetchSupervisors = async (
    setSupervisors: (supervisors: Supervisor[]) => void): Promise<void> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/supervisor`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            },
        });
        const data = await response.json();
        setSupervisors(data.content);
    } catch (error) {
        console.error('Error fetching supervisors:', error);
    }
};

export const postUser = async (
    values: any,
): Promise<void> => {
    await toast.promise(
        (async () => {
            try {
                const tokenXSRF = await fetchCsrfToken();

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                        'X-XSRF-TOKEN': tokenXSRF,
                    },
                    credentials: 'include',
                    body: JSON.stringify(values),
                });

                if (!response.ok) {
                    const errorResponse = await response.json();
                    const errorMessage = errorResponse.message || 'Wystąpił błąd podczas dodawania użytkownika.';
                    throw new Error(errorMessage);
                }
            } catch (error) {
                console.error('Error adding user:', error);
                throw error;
            }
        })(),
        {
            pending: 'Dodawanie użytkownika...',
            success: 'Użytkownik został dodany!'
        }
    );
};

export const patchUser = async (
    values: any
): Promise<void> => {
    await toast.promise(
        (async () => {
            try {
                const tokenXSRF = await fetchCsrfToken();

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/${values.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                        'X-XSRF-TOKEN': tokenXSRF,
                    },
                    credentials: 'include',
                    body: JSON.stringify(values),
                });

                if (!response.ok) {
                    const errorResponse = await response.json();
                    const errorMessage = errorResponse.message || 'Wystąpił błąd podczas aktualizacji użytkownika.';
                    throw new Error(errorMessage);
                }
            } catch (error) {
                console.error('Error updating user:', error);
                throw error;
            }
        })(),
        {
            pending: 'Aktualizowanie użytkownika...',
            success: 'Dane użytkownika zostały zaktualizowane!'
        }
    );
};

export const deleteUser = async (
    userId: number
): Promise<void> => {
    await toast.promise(
        (async () => {
            try {
                const tokenXSRF = await fetchCsrfToken();

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/${userId}`, {
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
                    const errorMessage = errorResponse.message || 'Wystąpił błąd podczas usuwania użytkownika.';
                    throw new Error(errorMessage);
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                throw error;
            }
        })(),
        {
            pending: 'Usuwanie użytkownika...',
            success: 'Użytkownik został usunięty!'
        }
    );
};