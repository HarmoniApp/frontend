export const downloadSchedulePdf = async (
    currentWeek: Date[],
    setLoading: (loading: boolean) => void): Promise<void> => {
    setLoading(true);
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
            setLoading(false);
            return;
        }
        const blob = await responsePDF.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const filename = `shifts_${startOfWeek} - ${endOfWeek}.pdf`;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error('Error:', error);
    } finally {
        setLoading(false);
    }
};

export const downloadUsersPDF = async (
    setLoading: (loading: boolean) => void): Promise<void> => {
    setLoading(true);
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
            setLoading(false);
            return;
        }
        const blob = await responsePDF.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const filename = `allUsers.pdf`;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error('Error:', error);
    } finally {
        setLoading(false);
    }
};