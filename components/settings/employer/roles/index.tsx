"use client";
import React from 'react';
import styles from './main.module.scss';
import LoadingSpinner from '@/components/loadingSpinner';
import { useRoleManagement } from '@/hooks/roles/useRolesManagement';
import { AddRoleForm } from './addRoleForm';
import { EditRoleForm } from './editRoleForm';

const Roles = () => {
  const {
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
  } = useRoleManagement();

  return (
    <div className={styles.roleContainerMain}>
      <div className={styles.showRoleMapConteiner}>
        {roles.map(role => (
          <EditRoleForm
            role={role}
            editingRoleId={editingRoleId}
            setEditingRoleId={setEditingRoleId}
            isDeleteModalOpen={isDeleteModalOpen}
            openDeleteModal={openDeleteModal}
            handleEditRole={handleEditRole}
            handleDeleteRole={handleDeleteRole}
            deleteRoleId={deleteRoleId}
            setIsDeleteModalOpen={setIsDeleteModalOpen}
          />
        ))}
      </div>
      <AddRoleForm handleAddRole={handleAddRole} />
      {loading && <LoadingSpinner />}
    </div>
  );
};
export default Roles;