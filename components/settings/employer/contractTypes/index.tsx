"use client";
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faPen, faXmark, faCheck } from '@fortawesome/free-solid-svg-icons';
import Contract from '@/components/types/contract';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import classNames from 'classnames';
import styles from './main.module.scss';
import { deleteContractType, fetchContracts, postContractType, putContractType } from '@/services/contractService';
import LoadingSpinner from '@/components/loadingSpinner';
import ConfirmationPopUp from '@/components/confirmationPopUp';

const ContractTypes = () => {
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
      fetchContracts(setContracts);
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
      console.error('Error editing shift:', error);
    }
  };

  const findInvalidCharacters = (value: string, allowedPattern: RegExp): string[] => {
    const invalidChars = value.split('').filter(char => !allowedPattern.test(char));
    return Array.from(new Set(invalidChars));
  };

  const contractValidationSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Min 2 znaków')
      .max(50, 'Max 50 znaków')
      .required('Pole wymagane')
      .test('no-invalid-chars', function (value) {
        const invalidChars = findInvalidCharacters(value || '', /^[a-zA-Z0-9\s]*$/);
        return invalidChars.length === 0
          ? true
          : this.createError({ message: `Niedozwolone znaki: ${invalidChars.join(', ')}` });
      }),
    absence_days: Yup.number()
      .min(0, 'Liczba dni nie może być mniejsza niż 0')
      .required('Pole wymagane')
      .typeError('Wprowadź poprawną liczbę')
  });

  return (
    <div className={styles.contractTypesContainerMain}>
      <div className={styles.showContractMapContainer}>
        {contracts.map((contract) => (
          <Formik
            key={contract.id}
            initialValues={{ id: contract.id, name: contract.name, absence_days: contract.absence_days }}
            validationSchema={contractValidationSchema}
            enableReinitialize={true}
            onSubmit={handleEditContractType}
          >
            {({ handleSubmit, handleChange, values, errors, touched, resetForm }) => (
              <Form onSubmit={handleSubmit}>
                <div className={styles.showContractContainerMain}>
                  <ErrorMessage name="name" component="div" className={styles.errorMessage} />
                  <ErrorMessage name="absence_days" component="div" className={styles.errorMessage} />
                  <div className={styles.showContractContainer}>
                    <div className={styles.contractInfoContainer}>
                      {editingContractId === contract.id ? (
                        <>
                          <Field
                            type="text"
                            name="name"
                            value={values.name}
                            onChange={handleChange}
                            className={classNames(styles.formInput, {
                              [styles.errorInput]: errors.name && touched.name,
                            })}
                          />
                        </>
                      ) : (
                        <>
                          <p className={styles.contractNameParagraph}>{contract.name}</p>
                          <p className={styles.contractDaysParagraph}>{contract.absence_days} dni</p>
                        </>
                      )}
                    </div>
                    <div className={styles.editAndRemoveButtonContainer}>
                      {editingContractId === contract.id ? (
                        <>
                          <Field
                            component="input"
                            type="number"
                            name="absence_days"
                            value={values.absence_days}
                            onChange={handleChange}
                            className={classNames(styles.absenceDaysInput, {
                              [styles.errorInput]: errors.absence_days && touched.absence_days,
                            })}
                          />
                          <button className={styles.yesButton} type="submit">
                            <FontAwesomeIcon icon={faCheck} />
                          </button>
                          <button
                            type="button"
                            className={styles.noButton}
                            onClick={() => {
                              resetForm();
                              setEditingContractId(null);
                            }}
                          >
                            <FontAwesomeIcon icon={faXmark} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button type='button' className={styles.editButton} onClick={() => setEditingContractId(contract.id)}>
                            <FontAwesomeIcon icon={faPen} />
                          </button>
                          <button type='button' className={styles.removeButton} onClick={() => openDeleteModal(contract.id)}>
                            <FontAwesomeIcon icon={faMinus} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {isDeleteModalOpen && deleteContractId === contract.id && (
                  <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                      <ConfirmationPopUp action={() => handleDeleteContractType(contract.id)} onClose={() => setIsDeleteModalOpen(false)} description={`Usunąć typ umowy o nazwie: ${contract.name}`} />
                    </div>
                  </div>
                )}
              </Form>
            )}
          </Formik>
        ))}
      </div>
      <Formik
        initialValues={{ name: '', absence_days: 0 }}
        validationSchema={contractValidationSchema}
        onSubmit={handleAddContractType}
      >
        {({ handleSubmit, handleChange, values, errors, touched }) => (
          <Form className={styles.addContainer} onSubmit={handleSubmit}>
            <Field
              name="name"
              value={values.name}
              onChange={handleChange}
              className={classNames(styles.formInput, {
                [styles.errorInput]: errors.name && touched.name,
              })}
              placeholder="Wpisz nazwę typu umowy"
            />
            <ErrorMessage name="name" component="div" className={styles.errorMessage} />
            <Field
              type="number"
              name="absence_days"
              value={values.absence_days}
              onChange={handleChange}
              className={classNames(styles.absenceDaysInput, {
                [styles.errorInput]: errors.absence_days && touched.absence_days,
              })}

            />
            <ErrorMessage name="absence_days" component="div" className={styles.errorMessage} />
            <button className={styles.addButton} type="submit">
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </Form>
        )}
      </Formik>
      {loading && <LoadingSpinner />}
    </div>
  );
};
export default ContractTypes;