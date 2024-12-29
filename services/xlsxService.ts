import { toast } from "react-toastify";
import { fetchCsrfToken } from "./csrfService";

export const downloadScheduleXLSX = async (
    currentWeek: Date[]
): Promise<void> => {
    const startOfWeek = currentWeek[0].toISOString().split('T')[0];
    const endOfWeek = currentWeek[6].toISOString().split('T')[0];

    await toast.promise(
        (async () => {
            try {
                const responseXLSX = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/excel/shifts/export-excel?start=${startOfWeek}&end=${endOfWeek}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                    },
                });

                if (!responseXLSX.ok) {
                    const errorResponse = await responseXLSX.text();
                    throw new Error(errorResponse || 'Wystąpił błąd podczas pobierania pliku XLSX.');
                }

                const blob = await responseXLSX.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                const filename = `grafik_${startOfWeek} - ${endOfWeek}.xlsx`;
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                link.remove();
            } catch (error) {
                console.error('Error downloading schedule XLSX: ', error);
                throw error;
            }
        })(),
        {
            pending: 'Pobieranie grafiku w formacie XLSX...',
            success: `Grafik ${startOfWeek} - ${endOfWeek} został pobrany!`,
            error: {
                render({ data }) {
                    const errorMessage = data instanceof Error ? data.message : 'Wystąpił błąd exportu';
                    return errorMessage;
                },
            },
        }
    );
};

export const importScheduleXLSX = async (
    file: FormData,
): Promise<void> => {
    await toast.promise(
        (async () => {
            try {
                const tokenXSRF = await fetchCsrfToken();

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/excel/shifts/import-excel`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                        'X-XSRF-TOKEN': tokenXSRF,
                    },
                    credentials: 'include',
                    body: file,
                });

                if (!response.ok) {
                    const errorResponse = await response.json();
                    const errorMessage = errorResponse.message || 'Wystąpił błąd podczas importowania kalendarza.';
                    throw new Error(errorMessage);
                }

                // const blob = await response.blob();
                // const url = window.URL.createObjectURL(blob);
                // const link = document.createElement('a');
                // link.href = url;
                // const filename = `loginy-hasla.pdf`;
                // link.setAttribute('download', filename);
                // document.body.appendChild(link);
                // link.click();
                // link.remove();
            } catch (error) {
                console.error('Error importing schedule:', error);
                throw error;
            }
        })(),
        {
            pending: 'Importowanie kalendarza...',
            success: 'Zmiany zostały dodane!'
        }
    );
};

export const downloadUsersXLSX = async (): Promise<void> => {
    await toast.promise(
        (async () => {
            try {
                const responseXLSX = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/excel/users/export-excel`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                    },
                });

                if (!responseXLSX.ok) {
                    const errorResponse = await responseXLSX.text();
                    throw new Error(errorResponse || 'Wystąpił błąd podczas pobierania pliku XLSX.');
                }

                const blob = await responseXLSX.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                const filename = `pracownicy.xlsx`;
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                link.remove();
            } catch (error) {
                console.error('Error downloading users XLSX: ', error);
                throw error;
            }
        })(),
        {
            pending: 'Pobieranie listy pracowników w formacie XLSX...',
            success: 'Lista pracowników została pobrana!'
        }
    );
};

export const importUsersXLSX = async (
    file: FormData,
): Promise<void> => {
    await toast.promise(
        (async () => {
            try {
                const tokenXSRF = await fetchCsrfToken();

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/excel/users/import-excel`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                        'X-XSRF-TOKEN': tokenXSRF,
                    },
                    credentials: 'include',
                    body: file,
                });

                if (!response.ok) {
                    const errorResponse = await response.json();
                    const errorMessage = errorResponse.message || 'Wystąpił błąd podczas importowania użytkowników.';
                    throw new Error(errorMessage);
                }

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                const filename = `loginy-hasla.pdf`;
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                link.remove();
            } catch (error) {
                console.error('Error importing users:', error);
                throw error;
            }
        })(),
        {
            pending: 'Importowanie użytkowników...',
            success: 'Użytkownicy zostali dodani!'
        }
    );
};