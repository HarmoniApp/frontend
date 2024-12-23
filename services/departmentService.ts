import Department from "@/components/types/department";
import DepartmentAddress from "@/components/types/departmentAddress";
import { fetchCsrfToken } from "./csrfService";
import { toast } from "react-toastify";

export const fetchDepartments = async (
    setDepartments: (departments: Department[]) => void): Promise<void> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/address/departments/name`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            },
        });
        if (!response.ok) throw new Error('Failed to fetch departments');
        const data = await response.json();
        await setDepartments(data);
    } catch (error) {
        console.error('Error fetching departments:', error);
    }
};

export const fetchDepartmentsAddress = async (
    setDepartments: (departmentsAdress: DepartmentAddress[]) => void): Promise<void> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/address/departments`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            }
        });
        const data = await response.json();
        await setDepartments(data);
    } catch (error) {
        console.error("Error fetching departments:", error);
    }
}

export const postDepartment = async (
    values: DepartmentAddress,
    setDepartments: (departments: DepartmentAddress[]) => void,
): Promise<void> => {
    await toast.promise(
        (async () => {
            try {
            const tokenXSRF = await fetchCsrfToken();

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/address`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                    'X-XSRF-TOKEN': tokenXSRF,
                },
                credentials: 'include',
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                const errorMessage = errorResponse.message || 'Wystąpił błąd podczas dodawania działu';
                throw new Error(errorMessage);
            }
            await fetchDepartmentsAddress(setDepartments);
        } catch (error) {
            console.error('Error adding department:', error);
            throw error;
        }
        })(),
        {
            pending: 'Dodawanie działu...',
            success: 'Dział został dodany!'
        }
    );
};

export const putDepartment = async (
    values: DepartmentAddress,
    setDepartments: (departments: DepartmentAddress[]) => void
): Promise<void> => {
    await toast.promise(
        (async () => {
            try {
            const tokenXSRF = await fetchCsrfToken();

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/address/${values.id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                    'X-XSRF-TOKEN': tokenXSRF,
                },
                credentials: 'include',
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                const errorMessage = errorResponse.message || 'Wystąpił błąd podczas aktualizacji działu';
                throw new Error(errorMessage);
            }
            await fetchDepartmentsAddress(setDepartments);
        } catch (error) {
            console.error('Error updating department:', error);
            throw error;
        }
        })(),
        {
            pending: 'Aktualizowanie działu...',
            success: 'Dział został zaktualizowany!'
        }
    );
};

export const deleteDepartment = async (
    departmentId: number,
    setDepartments: (departmentsAdress: DepartmentAddress[]) => void
): Promise<void> => {
    await toast.promise(
        (async () => {
            try {
            const tokenXSRF = await fetchCsrfToken();

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/address/${departmentId}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                    'X-XSRF-TOKEN': tokenXSRF,
                },
                credentials: 'include',
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                const errorMessage = errorResponse.message || 'Wystąpił błąd podczas usuwania działu';
                throw new Error(errorMessage);
            }
            await fetchDepartmentsAddress(setDepartments);
        } catch (error) {
            console.error('Error deleting department:', error);
            throw error;
        }
        })(),
        {
            pending: 'Usuwanie działu...',
            success: 'Dział został usunięty!'
        }
    );
};