import Absence from "@/components/types/absence";
import EmployeeData from "@/components/types/employeeData";
import SimpleUser from "@/components/types/simpleUser";
import Supervisor from "@/components/types/supervisor";

export const fetchSimpleUser = async (
    absence?: Absence,
    supervisorId?: number,
    setUser?: (users: SimpleUser) => void,
    setSupervisorData?: (supervisor: Supervisor) => void,
    setLoading?: (loading: boolean) => void): Promise<void> => {
        setLoading?.(true);
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/simple/${absence?.user_id || supervisorId}`, {
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