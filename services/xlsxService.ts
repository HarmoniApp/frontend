export const downloadScheduleXLSX = async (
    currentWeek: Date[]): Promise<void> => {
    try {
        const startOfWeek = currentWeek[0].toISOString().split('T')[0];
        const endOfWeek = currentWeek[6].toISOString().split('T')[0];
        const responseXLSX = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/excel/shifts/export-excel?start=${startOfWeek}&end=${endOfWeek}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            },
        }
        );

        if (!responseXLSX.ok) {
            console.error('Error downloading XLSX');
            return;
        }
        const blob = await responseXLSX.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const filename = `shifts_${startOfWeek} - ${endOfWeek}.xlsx`;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error('Error:', error);
    }
};

export const downloadUsersXLSX = async (): Promise<void> => {
    try {
        const responseXLSX = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/excel/users/export-excel`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/pdf',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            }
        });

        if (!responseXLSX.ok) {
            console.error('Error downloading XLSX');
            return;
        }
        const blob = await responseXLSX.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const filename = `allUsers.xlsx`;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error('Error:', error);
    }
};