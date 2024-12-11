import EmployeeData from "@/components/types/employeeData";
import SimpleUser from "@/components/types/simpleUser";
import Supervisor from "@/components/types/supervisor";
import { fetchCsrfToken } from "./csrfService";

export const fetchSimpleUser = async (
    id: number,
    setUser?: (users: SimpleUser) => void,
    setSupervisorData?: (supervisor: Supervisor) => void,
    setLoading?: (loading: boolean) => void): Promise<void> => {
    setLoading?.(true);
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
    } finally {
        setLoading?.(false);
    }
};

export const fetchSimpleUsersWithPagination = async (
    setUsers: (users: SimpleUser[]) => void): Promise<void> => {

    let pageNumber = 0;
    let totalPages = 1;
    const allUsers = [];
    try {
        while (pageNumber < totalPages) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/simple?pageNumber=${pageNumber}&pageSize=10`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                },
            });
            const data = await response.json();

            allUsers.push(...data.content);
            totalPages = data.totalPages;
            pageNumber += 1;
        }
        setUsers(allUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};

export const fetchUserData = async (
    id: string | number,
    setEmployee: (users: EmployeeData | null) => void,
    setLoading: (loading: boolean) => void): Promise<void> => {
    setLoading(true);

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
    } catch (error) {
        console.error('Error fetching roles:', error);
    } finally {
        setLoading(false);
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
    setEmployeeLink: (employeeId: number) => void): Promise<void> => {

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
            console.error('Failed to add employee:', response.statusText);
            throw new Error('Failed to add employee');
        }
        const postData = await response.json();
        setEmployeeLink(postData.id);
    } catch (error) {
        console.error(`Error while generate`, error);
    }
};

export const patchUser = async (
    values: any): Promise<void> => {

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
            console.error('Error updating user');
            throw new Error('Error updating user');
        }
    } catch (error) {
        console.error(`Error while generate`, error);
    }
};

export const deleteUser = async (
    userId: number): Promise<void> => {

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
        })
        if (!response.ok) {
            console.error('Failed to delete employee: ', response.statusText);
            throw new Error(`Failed to delete employee`);
        }
    } catch (error) {
        console.error('Error deleting role:', error);
    }
};