import { toast } from "react-toastify";
import { fetchCsrfToken } from "./csrfService";

export const revokeScheduleAi = async (): Promise<void> => {
    await toast.promise(
        (async () => {
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
                    const errorResponse = await response.json();
                    const errorMessage = errorResponse.message || 'Wystąpił błąd podczas cofania harmonogramu.';
                    throw new Error(errorMessage);
                }
            } catch (error) {
                console.error('Error revoking aiSchedule:', error);
                throw error;
            }
        })(),
        {
            pending: 'Cofanie harmonogramu...',
            success: 'Harmonogram został cofnięty!'
        }
    );
};

export const generateScheduleAi = async (
    payload: any
): Promise<void> => {
    await toast.promise(
        (async () => {
            try {
                const tokenXSRF = await fetchCsrfToken();

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/aiSchedule/generate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                        'X-XSRF-TOKEN': tokenXSRF,
                    },
                    credentials: 'include',
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    const errorResponse = await response.json();
                    const errorMessage = errorResponse.message || 'Wystąpił błąd podczas generowania harmonogramu.';
                    throw new Error(errorMessage);
                }
            } catch (error) {
                console.error('Error generating aiSchedule:', error);
                throw error;
            }
        })(),
        {
            pending: 'Generowanie harmonogramu...',
            success: 'Harmonogram został wygenerowany!',
            error: {
                render({ data }) {
                    const errorMessage = data instanceof Error ? data.message : 'Wystąpił błąd podczas generowania harmonogramuAi.';
                    return errorMessage;
                },
            }
        }
    );
};