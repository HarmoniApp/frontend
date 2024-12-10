import Contract from "@/components/types/contract";
import { fetchCsrfToken } from "./csrfService";

export const fetchContracts = async (
    setContracts: (contracts: Contract[]) => void,
    setLoading: (loading: boolean) => void): Promise<void> => {
    setLoading(true);
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
    } finally {
        setLoading(false)
    }
};

export const postContractType = async (
    values: any,
    setContracts: (contracts: Contract[]) => void,
    setLoading: (loading: boolean) => void,
    setAddedContractName: (name: string) => void ): Promise<void> => {

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
            console.error('Failed to add contract type:', response.statusText);
            throw new Error('Failed to add contract type');
          }
        const postData = await response.json();
        setAddedContractName(postData.name);
        await fetchContracts(setContracts, setLoading);
    } catch (error) {
        console.error(`Error while adding contract type`, error);
    }
};

export const deleteContractType = async (
    contractId: number,
    setContracts: (contracts: Contract[]) => void,
    setLoading: (loading: boolean) => void): Promise<void> => {

    setLoading(true);
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
            console.error('Failed to delete department: ', response.statusText);
            throw new Error('Failed to delete department');
        }
        setLoading(false);
        await fetchContracts(setContracts, setLoading);
    } catch (error) {
        console.error('Error deleting contract type:', error);
    } finally {
        setLoading(false);
    }
};