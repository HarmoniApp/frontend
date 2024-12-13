import Role from "@/components/types/role";
import { fetchCsrfToken } from "./csrfService";
import { toast } from "react-toastify";

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
    setRoles: (roles: Role[]) => void
): Promise<void> => {
    await toast.promise(
        (async () => {
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
                const errorResponse = await response.json();
                const errorMessage = errorResponse.message || 'Wystąpił błąd podczas dodawania roli.';
                throw new Error(errorMessage);
            }
            await fetchRoles(setRoles);
        })(),
        {
            pending: 'Dodawanie roli...',
            success: 'Rola została dodana!'
        }
    );
};

export const putRole = async (
    values: { id: number; editedRoleName: string; editedRoleColor: string },
    setRoles: (roles: Role[]) => void
): Promise<void> => {
    await toast.promise(
        (async () => {
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
                const errorResponse = await response.json();
                const errorMessage = errorResponse.message || 'Wystąpił błąd podczas edytowania roli.';
                throw new Error(errorMessage);
            }

            await fetchRoles(setRoles);
        })(),
        {
            pending: 'Aktualizowanie roli...',
            success: 'Rola została zaktualizowana!'
        }
    );
};

export const deleteRole = async (
    roleId: number,
    setRoles: (roles: Role[]) => void
): Promise<void> => {
    await toast.promise(
        (async () => {
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
                const errorResponse = await response.json();
                const errorMessage = errorResponse.message || 'Wystąpił błąd podczas usuwania roli.';
                throw new Error(errorMessage);
            }

            await fetchRoles(setRoles);
        })(),
        {
            pending: 'Usuwanie roli...',
            success: 'Rola została usunięta!'
        }
    );
};