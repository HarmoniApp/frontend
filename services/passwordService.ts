import { toast } from "react-toastify";
import { fetchCsrfToken } from "./csrfService";

export const patchResetPassword = async (
    id: number,
    setNewPassword: (password: string) => void
): Promise<void> => {
    await toast.promise(
        (async () => {
            try {
            const tokenXSRF = await fetchCsrfToken();

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/${id}/generatePassword`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                    'X-XSRF-TOKEN': tokenXSRF,
                },
                credentials: 'include',
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                const errorMessage = errorResponse.message || 'Wystąpił błąd podczas resetowania hasła.';
                throw new Error(errorMessage);
            }

            const result = await response.text();
            setNewPassword(result);
        } catch (error) {
            console.error('Error reseting user password:', error);
            throw error;
        }
        })(),
        {
            pending: 'Resetowanie hasła...',
            success: 'Hasło zostało zresetowane!'
        }
    );
};

export const patchChangePassword = async (
    values: { newPassword: string },
    passwordPath: string
): Promise<void> => {
    await toast.promise(
        (async () => {
            try {
            const requestBody = {
                newPassword: values.newPassword,
            };

            const tokenXSRF = await fetchCsrfToken();

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${passwordPath}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                    'X-XSRF-TOKEN': tokenXSRF,
                },
                credentials: 'include',
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                const errorMessage = errorResponse.message || 'Wystąpił błąd podczas zmiany hasła.';
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error(`Error while editing role`, error);
        }
        })(),
        {
            pending: 'Zmiana hasła...',
            success: 'Hasło zostało zmienione!',
            error: {
                render({ data }) {
                    const errorMessage = data instanceof Error ? data.message : 'Wystąpił błąd podczas ustawiania nowego hasła.';
                    return errorMessage;
                },
            },
        }
    );
};
