import { fetchCsrfToken } from "./csrfService";

export const revokeScheduleAi = async (): Promise<void> => {

    try {
        const tokenXSRF = await fetchCsrfToken();

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/aiSchedule/revoke`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                'X-XSRF-TOKEN': tokenXSRF,
            },
            credentials: 'include',
        });
        if (!response.ok) {
            console.error('Failed to revoke: ', response.statusText);
            throw new Error(`Failed to revoke`);
        }
    } catch (error) {
        console.error(`Error while revoke`, error);
    }
};