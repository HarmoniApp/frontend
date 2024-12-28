import { Contract } from "@/components/types/contract";
import { fetchCsrfToken } from "./csrfService";
import { toast } from "react-toastify";

export const fetchContracts = async (
    setContracts: (contracts: Contract[]) => void): Promise<void> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/contract-type`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            },
        });
        if (!response.ok) throw new Error('Failed to fetch contracts');
        const data = await response.json();
        setContracts(data);
    } catch (error) {
        console.error('Error fetching contract types:', error);
    }
};

export const postContractType = async (
    values: any,
    setContracts: (contracts: Contract[]) => void,
): Promise<void> => {
    await toast.promise(
        (async () => {
            try {
                const tokenXSRF = await fetchCsrfToken();

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/contract-type`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                        'X-XSRF-TOKEN': tokenXSRF,
                    },
                    credentials: 'include',
                    body: JSON.stringify(values),
                });

                if (!response.ok) {
                    const errorResponse = await response.json();
                    const errorMessage = errorResponse.message || 'Wystąpił błąd podczas dodawania rodzaju umowy.';
                    throw new Error(errorMessage);
                }
                await fetchContracts(setContracts);
            } catch (error) {
                console.error('Error adding contract type:', error);
                throw error;
            }
        })(),
        {
            pending: 'Dodawanie rodzaju umowy...',
            success: 'Rodzaj umowy został dodany!'
        }
    );
};

export const putContractType = async (
    values: any,
    setContracts: (contracts: Contract[]) => void
): Promise<void> => {
    await toast.promise(
        (async () => {
            try {
                const tokenXSRF = await fetchCsrfToken();

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/contract-type/${values.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                        'X-XSRF-TOKEN': tokenXSRF,
                    },
                    credentials: 'include',
                    body: JSON.stringify(values),
                });

                if (!response.ok) {
                    const errorResponse = await response.json();
                    const errorMessage = errorResponse.message || 'Wystąpił błąd podczas aktualizacji rodzaju umowy.';
                    throw new Error(errorMessage);
                }
                await fetchContracts(setContracts);
            } catch (error) {
                console.error('Error updating contract type:', error);
                throw error;
            }
        })(),
        {
            pending: 'Aktualizowanie rodzaju umowy...',
            success: 'Rodzaj umowy został zaktualizowany!'
        }
    );
};

export const deleteContractType = async (
    contractId: number,
    setContracts: (contracts: Contract[]) => void
): Promise<void> => {
    await toast.promise(
        (async () => {
            try {
                const tokenXSRF = await fetchCsrfToken();

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/contract-type/${contractId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                        'X-XSRF-TOKEN': tokenXSRF,
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    const errorResponse = await response.json();
                    const errorMessage = errorResponse.message || 'Wystąpił błąd podczas usuwania rodzaju umowy.';
                    throw new Error(errorMessage);
                }
                await fetchContracts(setContracts);
            } catch (error) {
                console.error('Error deleting contract type:', error);
                throw error;
            }
        })(),
        {
            pending: 'Usuwanie rodzaju umowy...',
            success: 'Rodzaj umowy został usunięty!'
        }
    );
};