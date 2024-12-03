import Absence from "@/components/types/absence";
import SimpleUser from "@/components/types/simpleUser";

export const fetchUser = async (
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