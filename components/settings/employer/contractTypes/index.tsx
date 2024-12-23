"use client";
import React from 'react';
import LoadingSpinner from '@/components/loadingSpinner';
import { useContractTypes } from '@/hooks/contractTypes/useContractsTypes';
import { AddContractTypeForm } from './addContractTypeForm';
import { EditContractTypeForm } from './editContractTypeForm';
import styles from './main.module.scss';

const ContractTypes = () => {
  const { loading } = useContractTypes();

  return (
    <div className={styles.contractTypesContainerMain}>
      <div className={styles.showContractMapContainer}>
        <EditContractTypeForm />
      </div>
      <AddContractTypeForm />
      {loading && <LoadingSpinner />}
    </div>
  );
};
export default ContractTypes;