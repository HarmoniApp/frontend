import Role from "@/components/types/role";
import { deleteRole, fetchRoles, postRole, putRole } from "@/services/roleService";
import { useEffect, useState } from "react";

const useRoles = () => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [roles, setRoles] = useState<Role[]>([]);
    const [editingRoleId, setEditingRoleId] = useState<number | null>(null);
    const [deleteRoleId, setDeleteRoleId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const openDeleteModal = (roleId: number) => {
        setDeleteRoleId(roleId);
        setIsDeleteModalOpen(true);
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await fetchRoles(setRoles);
            setLoading(false);
        };

        loadData();
    }, []);

    const handleDeleteRole = async (roleId: number) => {
        setIsDeleteModalOpen(false);
        await deleteRole(roleId, setRoles);
    };

    const handleAddRole = async (values: { newRoleName: string; newRoleColor: string }, { resetForm }: any) => {
        try {
            await postRole(values, setRoles);
            resetForm();
        } catch (error) {
            console.error('Error adding role:', error);
        }
    };

    const handleEditRole = async (values: { id: number, editedRoleName: string; editedRoleColor: string }, { resetForm }: any) => {
        if (editingRoleId !== null) {
            try {
                setEditingRoleId(null);
                await putRole(values, setRoles);
                resetForm();
            } catch (error) {
                console.error('Error updating role:', error);
            }
        }
    };

    return {
        roles,
        loading,
        editingRoleId,
        setEditingRoleId,
        isDeleteModalOpen,
        openDeleteModal,
        handleAddRole,
        handleEditRole,
        handleDeleteRole,
        deleteRoleId,
        setIsDeleteModalOpen,
    };
}
export default useRoles;