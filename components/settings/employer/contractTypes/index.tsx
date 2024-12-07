"use client";
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faPen, faXmark, faCheck } from '@fortawesome/free-solid-svg-icons';
import Contract from '@/components/types/contract';
import AddNotification from '../popUps/addNotification';
import DeleteConfirmation from '../popUps/deleteConfirmation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { ProgressSpinner } from 'primereact/progressspinner';
import * as Yup from 'yup';
import classNames from 'classnames';
import styles from './main.module.scss';
import { fetchCsrfToken } from '@/services/csrfService';
import { fetchContracts } from '@/services/contractService';

interface ContractTypesProps {
  setError: (errorMessage: string | null) => void;
}

const ContractTypes: React.FC<ContractTypesProps> = ({ setError }) => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [editingContractId, setEditingContractId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [addedContractName, setAddedContractName] = useState<string>('');
  const [deleteContractId, setDeleteContractId] = useState<number | null>(null);
  const [modalIsOpenLoadning, setModalIsOpenLoadning] = useState(false);

  const openDeleteModal = (contractId: number) => {
    setDeleteContractId(contractId);
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    fetchContracts(setContracts, setModalIsOpenLoadning);
  }, []);

  const handleDeleteContractType = async (contractId: number) => {
    setModalIsOpenLoadning(true);
    try {
      const tokenXSRF = await fetchCsrfToken();

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/contract-type/${contractId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
          'X-XSRF-TOKEN': tokenXSRF,
        },
        credentials: 'include',
      });
      if (!response.ok) {
        console.error('Failed to delete department: ', response.statusText);
        throw new Error('Failed to delete department');
      }
      setModalIsOpenLoadning(false);
      setContracts(contracts.filter((contract) => contract.id !== contractId));
    } catch (error) {
      console.error('Error deleting contract type:', error);
      setError('Błąd podczas usuwania umów');
    } finally {
      setModalIsOpenLoadning(false);
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
            initialValues={{ name: contract.name, absence_days: contract.absence_days }}
            validationSchema={contractValidationSchema}
            enableReinitialize={true}
            onSubmit={async (values, { resetForm }) => {
              setModalIsOpenLoadning(true);
              try {
                const tokenXSRF = await fetchCsrfToken();

                  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/contract-type/${contract.id}`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                      'X-XSRF-TOKEN': tokenXSRF,
                    },
                    credentials: 'include',
                    body: JSON.stringify(values),
                  });
                  if (!response.ok) {
                    console.error('Failed to edit contract type:', response.statusText);
                    throw new Error('Failed to edit contract type');
                  }
                  setModalIsOpenLoadning(false);
                  const putData: Contract = await response.json();
                  setContracts(contracts.map(c => (c.id === putData.id ? putData : c)));
                  setEditingContractId(null);
                  resetForm();
              } catch (error) {
                console.error('Error updating contract type:', error);
                throw error;
              }
            }}
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
                          <button className={styles.editButton} onClick={() => setEditingContractId(contract.id)}>
                            <FontAwesomeIcon icon={faPen} />
                          </button>
                          <button className={styles.removeButton} onClick={() => openDeleteModal(contract.id)}>
                            <FontAwesomeIcon icon={faMinus} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {isDeleteModalOpen && deleteContractId === contract.id && (
                  <>
                    <div className={styles.modalOverlayOfDelete}>
                      <div className={styles.modalContentOfDelete}>
                        <DeleteConfirmation
                          onClose={() => setIsDeleteModalOpen(false)}
                          onDelete={() => handleDeleteContractType(contract.id)}
                          info={contract.name}
                        />
                      </div>
                    </div>
                  </>
                )}
              </Form>
            )}
          </Formik>
        ))}
      </div>
      <Formik
        initialValues={{ name: '', absence_days: 0 }}
        validationSchema={contractValidationSchema}
        onSubmit={async (values, { resetForm }) => {
          setModalIsOpenLoadning(true);
          try {
            const tokenXSRF = await fetchCsrfToken();

              const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/contract-type`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                  'X-XSRF-TOKEN': tokenXSRF,
                },
                credentials: 'include',
                body: JSON.stringify(values),
              });

              if (!response.ok) {
                console.error('Failed to add contract type:', response.statusText);
                throw new Error('Failed to add contract type');
              }
              setModalIsOpenLoadning(false);
              const postData: Contract = await response.json();
              setAddedContractName(postData.name);
              setIsAddModalOpen(true);
              setContracts([...contracts, postData]);
              resetForm();
          } catch (error) {
            console.error('Error adding contract type:', error);
            setError('Błąd podczas dodawania typu umowy');
          } finally {
            setModalIsOpenLoadning(false);
          }
        }}
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

            {isAddModalOpen && (
              <div className={styles.modalOverlayOfAdd}>
                <div className={styles.modalContentOfAdd}>
                  <AddNotification onClose={() => setIsAddModalOpen(false)} info={addedContractName} />
                </div>
              </div>
            )}

            {modalIsOpenLoadning && (
              <div className={styles.loadingModalOverlay}>
                <div className={styles.loadingModalContent}>
                  <div className={styles.spinnerContainer}><ProgressSpinner /></div>
                </div>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default ContractTypes;