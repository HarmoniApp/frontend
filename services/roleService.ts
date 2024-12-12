import Role from "@/components/types/role";
import { fetchCsrfToken } from "./csrfService";

export const fetchRoles = async (
    setRoles: (roles: Role[]) => void): Promise<void> => {
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

export const postRole = async (
    values: { newRoleName: string; newRoleColor: string },
    setAddedRoleName: (name: string) => void,
    setRoles: (roles: Role[]) => void): Promise<void> => {

    try {
        const tokenXSRF = await fetchCsrfToken();

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/role`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                'X-XSRF-TOKEN': tokenXSRF,
            },
            credentials: 'include',
            body: JSON.stringify({ name: values.newRoleName, color: values.newRoleColor }),
        });
        if (!response.ok) {
            console.error('Failed to add role:', response.statusText);
            throw new Error('Failed to add role');
        }
        const newRole = await response.json();
        setAddedRoleName(newRole.name);
        await fetchRoles(setRoles);
    } catch (error) {
        console.error(`Error while generate`, error);
    }
};

export const putRole = async (
    values: { id: number, editedRoleName: string; editedRoleColor: string },
    setRoles: (roles: Role[]) => void): Promise<void> => {

    try {
        const tokenXSRF = await fetchCsrfToken();

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/role/${values.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                'X-XSRF-TOKEN': tokenXSRF,
            },
            credentials: 'include',
            body: JSON.stringify({ name: values.editedRoleName, color: values.editedRoleColor }),
        });
        if (!response.ok) {
            console.error('Failed to edit role:', response.statusText);
            throw new Error('Failed to edit role');
        }
        await fetchRoles(setRoles);
    } catch (error) {
        console.error(`Error while editing role`, error);
    }
};

export const deleteRole = async (
    roleId: number,
    setRoles: (roles: Role[]) => void): Promise<void> => {

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
        await fetchRoles(setRoles);
    } catch (error) {
        console.error('Error deleting role:', error);
    }
};