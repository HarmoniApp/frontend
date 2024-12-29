import { toast } from "react-toastify";
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
    formData: FormData
): Promise<void> => {
    await toast.promise(
        (async () => {
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
                    const errorResponse = await response.json();
                    const errorMessage = errorResponse.message || 'Nie udało się przesłać zdjęcia.';
                    throw new Error(errorMessage);
                }
            } catch (error) {
                console.error('Error uploading photo:', error);
                throw error;
            }
        })(),
        {
            pending: 'Przesyłanie zdjęcia...',
            success: 'Zdjęcie zostało przesłane pomyślnie!'
        }
    );
};