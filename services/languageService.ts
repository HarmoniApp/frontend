import Language from "@/components/types/language";

export const fetchLanguages = async (
    setLanguages: (languages: Language[]) => void,
    setError: (errorMessage: string | null) => void,
    setLoading: (loading: boolean) => void): Promise<void> => {
    setLoading(true);
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/language`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            },
        });
        if (!response.ok) throw new Error('Failed to fetch languages');
        const data = await response.json();
        setLanguages(data);
    } catch (error) {
        console.error('Error fetching languages:', error);
        setError('Błąd podczas pobierania języków');
    } finally {
        setLoading(false);
    }
};