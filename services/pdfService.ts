export const downloadSchedulePdf = async (
    currentWeek: Date[]): Promise<void> => {
    try {
        const startOfWeek = currentWeek[0].toISOString().split('T')[0];
        const endOfWeek = currentWeek[6].toISOString().split('T')[0];
        const responsePDF = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/pdf/generate-pdf-shift?startOfWeek=${startOfWeek}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            },
        }
        );

        if (!responsePDF.ok) {
            console.error('Error downloading PDF');
            return;
        }
        const blob = await responsePDF.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const filename = `grafik_${startOfWeek} - ${endOfWeek}.pdf`;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error('Error:', error);
    }
};

export const downloadUsersPDF = async (): Promise<void> => {
    try {
        const responsePDF = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/pdf/generate-pdf-all-employees`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/pdf',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            }
        });

        if (!responsePDF.ok) {
            console.error('Error downloading PDF');
            return;
        }
        const blob = await responsePDF.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const filename = `pracownicy.pdf`;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error('Error:', error);
    }
};