import { fetchCsrfToken } from "./csrfService";

export const fetchImage = async (
    userId: number,
    setUserPhoto: (photo: string | null) => void): Promise<void> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/${userId}/photo`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch user photo: ${response.statusText}`);
        }
        const blob = await response.blob();
        const imageObjectUrl = URL.createObjectURL(blob);
        setUserPhoto(imageObjectUrl);
    } catch (error) {
        console.error('Error while fetching user photo:', error);
    }
};

export const patchPhoto = async (
    formData: FormData): Promise<void> => {

    try {
        const tokenXSRF = await fetchCsrfToken();
        const userId = sessionStorage.getItem('userId');

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/${userId}/uploadPhoto`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                'X-XSRF-TOKEN': tokenXSRF,
            },
            credentials: 'include',
            body: formData,
        });

        if (!response.ok) {
            console.error('Error uploading photo, response not OK');
            throw new Error('Error uploading photo');
        }
    } catch (error) {
        console.error(`Error while editing role`, error);
    }
};