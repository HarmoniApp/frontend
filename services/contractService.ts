import Contract from "@/components/types/contract";


export const fetchContracts = async (
    setContracts: (contracts: Contract[]) => void,
    setLoading: (loading: boolean) => void): Promise<void> => {
    setLoading(true);
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/contract-type`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            },
        });
        if (!response.ok) throw new Error('Failed to fetch contracts');
        const data = await response.json();
        setContracts(data);
    } catch (error) {
        console.error('Error fetching contract types:', error);
    } finally {
        setLoading(false)
    }
};