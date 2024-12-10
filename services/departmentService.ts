import Department from "@/components/types/department";
import DepartmentAddress from "@/components/types/departmentAddress";
import { fetchCsrfToken } from "./csrfService";

export const fetchDepartments = async (
    setDepartments: (departments: Department[]) => void,
    setLoading: (loading: boolean) => void): Promise<void> => {
    setLoading(true);
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
        setDepartments(data);
    } catch (error) {
        console.error('Error fetching departments:', error);
    } finally {
        setLoading(false);
    }
};

export const fetchDepartmentsAddress = async (
    setDepartments: (departmentsAdress: DepartmentAddress[]) => void,
    setLoading: (loading: boolean) => void): Promise<void> => {
    setLoading(true);
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/address/departments`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            }
        });
        const data = await response.json();
        setDepartments(data);
    }catch (error) {
        console.error("Error fetching departments:", error);
    } finally {
        setLoading(false)
    }
}

export const deleteDepartment = async (
    departmentId: number,
    setDepartments: (departmentsAdress: DepartmentAddress[]) => void,
    setLoading: (loading: boolean) => void): Promise<void> => {
    setLoading(true);
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
            console.error("Failed to delete department: ", response.statusText);
            throw new Error('Error delete department');
        }
        setLoading(false);
        await fetchDepartmentsAddress(setDepartments, setLoading);
    }
    catch (error) {
        console.error("Error deleting department:", error);
    } finally {
        setLoading(false);
    }
}