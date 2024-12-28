import { Contract } from "@/components/types/contract";
import { deleteContractType, fetchContracts, postContractType, putContractType } from "@/services/contractService";
import { useEffect, useState } from "react";

export const useContractTypes = () => {
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [editingContractId, setEditingContractId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteContractId, setDeleteContractId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const openDeleteModal = (contractId: number) => {
        setDeleteContractId(contractId);
        setIsDeleteModalOpen(true);
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await fetchContracts(setContracts);
            setLoading(false);
        }
        loadData();
    }, []);

    const handleDeleteContractType = async (contractId: number) => {
        setIsDeleteModalOpen(false);
        await deleteContractType(contractId, setContracts);
    };

    const handleAddContractType = async (values: any, { resetForm }: any) => {
        try {
            await postContractType(values, setContracts);
            resetForm();
        } catch (error) {
            console.error('Error adding contract type:', error);
            throw error;
        }
    };

    const handleEditContractType = async (values: any, { resetForm }: any) => {
        try {
            setEditingContractId(null);
            await putContractType(values, setContracts);
            resetForm();
        } catch (error) {
            console.error('Error editing contract:', error);
        }
    };

    return {
        contracts,
        editingContractId,
        setEditingContractId,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        deleteContractId,
        loading,
        handleAddContractType,
        handleEditContractType,
        handleDeleteContractType,
        openDeleteModal,
    };
}