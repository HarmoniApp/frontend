import Absence from "@/components/types/absence";
import EmployeeData from "@/components/types/employeeData";
import SimpleUser from "@/components/types/simpleUser";
import Supervisor from "@/components/types/supervisor";

export const fetchSimpleUser = async (
    absence: Absence,
    setUser: (users: SimpleUser) => void,
    setError: (errorMessage: string | null) => void,
    setLoading: (loading: boolean) => void): Promise<void> => {
    setLoading(true);
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/simple/${absence.user_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            },
        });
        const data = await response.json();
        setUser(data);
    } catch (error) {
        setError('Error fetching users');
        setError('Błąd podczas pobierania uzytkownikow');
    } finally {
        setLoading(false);
    }
};

export const fetchUserData = async (
    id: string,
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