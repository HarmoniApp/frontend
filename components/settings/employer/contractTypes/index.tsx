"use client";
import React from 'react';
import LoadingSpinner from '@/components/loadingSpinner';
import { useContractTypes } from '@/hooks/contractTypes/useContractsTypes';
import { AddContractTypeForm } from './addContractTypeForm';
import { EditContractTypeForm } from './editContractTypeForm';
import styles from './main.module.scss';

const ContractTypes = () => {
  const {
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
    openDeleteModal } = useContractTypes();

  return (
    <div className={styles.contractTypesContainerMain}>
      <div className={styles.showContractMapContainer}>
        {contracts.map((contract) => (
          <EditContractTypeForm
            contract={contract}
            editingContractId={editingContractId}
            setEditingContractId={setEditingContractId}
            isDeleteModalOpen={isDeleteModalOpen}
            setIsDeleteModalOpen={setIsDeleteModalOpen}
            deleteContractId={deleteContractId}
            handleEditContractType={handleEditContractType}
            handleDeleteContractType={handleDeleteContractType}
            openDeleteModal={openDeleteModal}
          />
        ))}
      </div>
      <AddContractTypeForm handleAddContractType={handleAddContractType} />
      {loading && <LoadingSpinner />}
    </div>
  );
};
export default ContractTypes;