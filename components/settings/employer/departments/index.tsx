"use client";
import React from "react";
import styles from "./main.module.scss";
import LoadingSpinner from "@/components/loadingSpinner";
import { useDepartmentsManagement } from "@/hooks/departments/useDepartments";
import { AddDepartmentForm } from "./addDepartmentForm";
import { EditDepartmentForm } from "./editDepartmentForm";

const Departments = () => {
    const {
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
    } = useDepartmentsManagement();

    return (
        <div className={styles.departmentContainerMain}>
            <div className={styles.showDepartmentsMapContainer}>
                {departments.map((department) => (
                    <EditDepartmentForm
                        department={department}
                        handleEditDepartment={handleEditDepartment}
                        handleDeleteDepartment={handleDeleteDepartment}
                        openDeleteModal={openDeleteModal}
                        editingDepartmentId={editingDepartmentId}
                        setEditingDepartmentId={setEditingDepartmentId}
                        noChangesError={noChangesError}
                        setNoChangesError={setNoChangesError}
                        isDeleteModalOpen={isDeleteModalOpen}
                        deleteDepartmentId={deleteDepartmentId}
                        setIsDeleteModalOpen={setIsDeleteModalOpen}
                    />))}
            </div>
            <AddDepartmentForm handleAddDepartment={handleAddDepartment} />
            {loading && <LoadingSpinner />}
        </div>
    );
};
export default Departments;