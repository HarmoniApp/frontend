"use client";
import React from 'react';
import EmployeeDataWorkAdressOnlyId from '@/components/types/employeeDataWorkAdressOnlyId';
import styles from './main.module.scss';
import LoadingSpinner from '@/components/loadingSpinner';
import { useRouter } from 'next/navigation';
import { useEmployeeDataManagement } from '@/hooks/employees/useEditEmployeeData';
import { EmployeeForm } from '../../employeeForm';

interface EditEmployeeDataProps {
  employee: EmployeeDataWorkAdressOnlyId;
  onCloseEdit: () => void;
}

const EditEmployeeData: React.FC<EditEmployeeDataProps> = ({ employee, onCloseEdit }) => {
  const router = useRouter();
  const {
    roles,
    contracts,
    languages,
    supervisors,
    departments,
    loading,
    handleSaveEmployee } = useEmployeeDataManagement();

  const handleSubmit = async (values: any) => {
    await handleSaveEmployee(values, "edit");
    onCloseEdit();
    router.refresh();
  };

  return (
    <div className={styles.editEmployeeContainerMain}>
      <EmployeeForm
        employee={employee}
        handleSubmit={handleSubmit}
        roles={roles}
        contracts={contracts}
        languages={languages}
        supervisors={supervisors}
        departments={departments}
        onCloseEdit={onCloseEdit}
      />
      {loading && <LoadingSpinner />}
    </div>
  );
};
export default EditEmployeeData;