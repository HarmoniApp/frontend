import { fetchCsrfToken } from "./csrfService";

export const patchResetPassword = async (
    id: number,
    setNewPassword: (password: string) => void): Promise<void> => {

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
            console.error('Error reseting password, response not OK');
            throw new Error('Error reseting password');
        }
        const result = await response.text();
        setNewPassword(result);
    } catch (error) {
        console.error(`Error while editing role`, error);
    }
};

export const patchChangePassword = async (
    values: any,
    passwordPath: string): Promise<void> => {

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
            console.error("Failed to change password: ", response.statusText);
            throw new Error('Error changing password');
        }
    } catch (error) {
        console.error(`Error while editing role`, error);
    }
};