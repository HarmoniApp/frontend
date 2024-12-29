"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/loadingSpinner';
import styles from './main.module.scss';
import { useEmployeeDataManagement } from '@/hooks/employees/useEditEmployeeData';
import { EmployeeForm } from '../employeeForm';

const AddEmployee: React.FC = () => {
  const onBack = () => {
    router.push('/employees');
  };

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
    await handleSaveEmployee(values, "add");
    router.push("/employees");
  };

  return (
    <div className={styles.addEmployeeContainerMain}>
      <EmployeeForm handleSubmit={handleSubmit} supervisors={supervisors} roles={roles} contracts={contracts} languages={languages} departments={departments} onCloseEdit={onBack}/>
      {loading && <LoadingSpinner />}
    </div>
  );
};
export default AddEmployee;