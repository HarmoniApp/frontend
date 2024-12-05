import Role from "@/components/types/role";

export const fetchRoles = async (
    setRoles: (roles: Role[]) => void,
    setLoading: (loading: boolean) => void): Promise<void> => {
    setLoading(true);
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