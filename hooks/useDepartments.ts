import DepartmentAddress from "@/components/types/departmentAddress";
import { deleteDepartment, fetchDepartmentsAddress, postDepartment, putDepartment } from "@/services/departmentService";
import { useEffect, useState } from "react";

const useDepartments = () => {
    const [departments, setDepartments] = useState<DepartmentAddress[]>([]);
    const [editingDepartmentId, setEditingDepartmentId] = useState<number | null>(null);
    const [noChangesError, setNoChangesError] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteDepartmentId, setDeleteDepartmentId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const openDeleteModal = (departmentId: number) => {
        setDeleteDepartmentId(departmentId);
        setIsDeleteModalOpen(true);
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await fetchDepartmentsAddress(setDepartments);
            setLoading(false);
        }
        loadData();
    }, []);

    const handleAddDepartment = async (values: DepartmentAddress, { resetForm }: any) => {
        try {
            postDepartment(values, setDepartments)
            resetForm();
        }
        catch (error) {
            console.error("Error adding department:", error);
        }
    };

    const handleEditDepartment = async (values: DepartmentAddress) => {
        if (editingDepartmentId !== null) {
            try {
                setEditingDepartmentId(null);
                await putDepartment(values, setDepartments);
            }
            catch (error) {
                console.error("Error updating department:", error);
            }
        }
    };

    const handleDeleteDepartment = async (departmentId: number) => {
        setIsDeleteModalOpen(false);
        await deleteDepartment(departmentId, setDepartments);
    };

    return {
        departments,
        editingDepartmentId,
        setEditingDepartmentId,
        noChangesError,
        setNoChangesError,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        deleteDepartmentId,
        loading,
        handleAddDepartment,
        handleEditDepartment,
        handleDeleteDepartment,
        openDeleteModal,
    };
}

export default useDepartments;