import { fetchCsrfToken } from "./csrfService";

export const deleteGroup = async (
    id: number,
    setLoading: (loading: boolean) => void): Promise<void> => {
    setLoading(true);

    try {
        const tokenXSRF = await fetchCsrfToken();

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/group/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                'X-XSRF-TOKEN': tokenXSRF,
            },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(`Failed to delete group"`);
        }

        window.location.reload();
    } catch (error) {
        console.error("Error deleting group:", error);
    } finally {
        setLoading(false);
    }
};

