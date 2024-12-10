import Role from "@/components/types/role";
import { fetchCsrfToken } from "./csrfService";

export const fetchRoles = async (
    setRoles: (roles: Role[]) => void,
    setLoading: (loading: boolean) => void): Promise<void> => {
    setLoading(true)
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/role`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            },
        });
        if (!response.ok) throw new Error('Failed to fetch roles');
        const data = await response.json();
        setRoles(data);
    } catch (error) {
        console.error('Error fetching roles:', error);
    } finally {
        setLoading(false);
    }
};

export const fetchUserRoles = async (
    userId: number,
    setRoles: (roles: Role[]) => void): Promise<void> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/role/user/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            },
        });
        if (!response.ok) throw new Error('Failed to fetch roles');
        const data = await response.json();
        setRoles(data);
    } catch (error) {
        console.error('Error fetching roles:', error);
    }
};

export const deleteRole = async (
    roleId: number,
    setRoles: (roles: Role[]) => void,
    setLoading: (loading: boolean) => void): Promise<void> => {

    setLoading(true);
    try {
        const tokenXSRF = await fetchCsrfToken();

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/role/${roleId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                'X-XSRF-TOKEN': tokenXSRF,
            },
            credentials: 'include',
        });
        if (!response.ok) {
            console.error('Failed to delete role:', response.statusText);
            throw new Error('Failed to delete role');
        }
        setLoading(false);
        await fetchRoles(setRoles, setLoading);
    } catch (error) {
        console.error('Error deleting role:', error);
    } finally {
        setLoading(false);
    }
};