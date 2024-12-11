"use client";
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faPen, faXmark, faCheck } from '@fortawesome/free-solid-svg-icons';
import Role from '@/components/types/role';
import AddNotification from '../popUps/addNotification';
import DeleteConfirmation from '../popUps/deleteConfirmation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { ProgressSpinner } from 'primereact/progressspinner';
import { deleteRole, fetchRoles, postRole, putRole } from "@/services/roleService"
import * as Yup from 'yup';
import classNames from 'classnames';
import styles from './main.module.scss';
import { fetchCsrfToken } from '@/services/csrfService';
import LoadingSpinner from '@/components/loadingSpinner';

interface RolesProps {
  setError: (errorMessage: string | null) => void;
}

const Roles: React.FC<RolesProps> = ({ setError }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [editingRoleId, setEditingRoleId] = useState<number | null>(null);
  const [addedRoleName, setAddedRoleName] = useState<string>('');
  const [deleteRoleId, setDeleteRoleId] = useState<number | null>(null);
  const [modalIsOpenLoadning, setModalIsOpenLoadning] = useState(false);

  const openDeleteModal = (roleId: number) => {
    setDeleteRoleId(roleId);
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchRoles(setRoles, setModalIsOpenLoadning);
    };

    loadData();
  }, []);

  const handleDeleteRole = async (roleId: number) => {
    await deleteRole(roleId, setRoles, setModalIsOpenLoadning)
  };

  const handleAddRole = async (values: { newRoleName: string; newRoleColor: string }, { resetForm }: any) => {
    setModalIsOpenLoadning(true);
    try {
      await postRole(values, setAddedRoleName, setRoles, setModalIsOpenLoadning)

      setModalIsOpenLoadning(false);
      setIsAddModalOpen(true);
      resetForm();
    } catch (error) {
      console.error('Error adding role:', error);
    } finally {
      setModalIsOpenLoadning(false);
    }
  };

  const handleEditRole = async (values: { id: number, editedRoleName: string; editedRoleColor: string }, { resetForm }: any) => {
    if (editingRoleId !== null) {
      setModalIsOpenLoadning(true);
      try {
        await putRole(values, setRoles, setModalIsOpenLoadning);

        setEditingRoleId(null);
        resetForm();
      } catch (error) {
        console.error('Error updating role:', error);
      } finally {
        setModalIsOpenLoadning(false);
      }
    }
  };

  const findInvalidCharacters = (value: string, allowedPattern: RegExp): string[] => {
    const invalidChars = value.split('').filter(char => !allowedPattern.test(char));
    return Array.from(new Set(invalidChars));
  };

  const addRoleValidationSchema = Yup.object({
    newRoleName: Yup.string()
      .required('Pole wymagane')
      .test('no-invalid-chars', function (value) {
        const invalidChars = findInvalidCharacters(value || '', /^[a-zA-Z0-9]*$/);
        return invalidChars.length === 0
          ? true
          : this.createError({ message: `Niedozwolone znaki: ${invalidChars.join(', ')}` });
      }),
    newRoleColor: Yup.string().required('Kolor wymagany'),
  });

  const editRoleValidationSchema = Yup.object({
    editedRoleName: Yup.string()
      .required('Pole wymagane')
      .test('no-invalid-chars', function (value) {
        const invalidChars = findInvalidCharacters(value || '', /^[a-zA-Z0-9]*$/);
        return invalidChars.length === 0
          ? true
          : this.createError({ message: `Niedozwolone znaki: ${invalidChars.join(', ')}` });
      }),
    editedRoleColor: Yup.string().required('Kolor wymagany'),
  });

  return (
    <div className={styles.roleContainerMain}>
      <div className={styles.showRoleMapConteiner}>
        {roles.map(role => (
          <Formik
            key={role.id + role.name + role.color}
            initialValues={{ id: role.id, editedRoleName: role.name, editedRoleColor: role.color || '#ffb6c1' }}
            validationSchema={editRoleValidationSchema}
            onSubmit={handleEditRole}
          >
            {({ handleSubmit, handleChange, values, errors, touched, resetForm }) => (
              <Form onSubmit={handleSubmit}>
                <div className={styles.showRoleConteinerMain}>
                  <ErrorMessage name="editedRoleName" component="div" className={styles.errorMessage} />
                  <div className={styles.showRoleConteiner}>
                    <div className={styles.roleInfoContainer}>
                      {editingRoleId === role.id ? (
                        <>
                          <Field
                            type="text"
                            name="editedRoleName"
                            value={values.editedRoleName}
                            onChange={handleChange}
                            className={classNames(styles.formInput, {
                              [styles.errorInput]: errors.editedRoleName && touched.editedRoleName,
                            })}
                          />
                        </>
                      ) : (
                        <>
                          <p className={styles.roleNameParagraph}>{role.name}</p>
                        </>
                      )}
                    </div>
                    <div className={styles.editAndRemoveButtonContainer}>
                      {editingRoleId === role.id ? (
                        <>
                          <Field
                            type="color"
                            name="editedRoleColor"
                            value={values.editedRoleColor}
                            onChange={handleChange}
                            className={styles.colorPicker}
                            style={{ backgroundColor: values.editedRoleColor }}
                          />
                          <ErrorMessage name="editedRoleColor" component="div" className={styles.errorMessage} />
                          <button type="submit" className={styles.yesButton}>
                            <FontAwesomeIcon icon={faCheck} />
                          </button>
                          <button
                            type="button"
                            className={styles.noButton}
                            onClick={() => {
                              resetForm();
                              setEditingRoleId(null);
                            }}
                          >
                            <FontAwesomeIcon icon={faXmark} />
                          </button>
                        </>
                      ) : (
                        <>
                          <input
                            type="color"
                            value={role.color}
                            className={styles.colorPicker}
                            style={{ backgroundColor: role.color, cursor: 'default' }}
                            disabled
                          />
                          <button className={styles.editButton} onClick={() => setEditingRoleId(role.id)}>
                            <FontAwesomeIcon icon={faPen} />
                          </button>
                          <button className={styles.removeButton} onClick={() => openDeleteModal(role.id)}>
                            <FontAwesomeIcon icon={faMinus} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {isDeleteModalOpen && deleteRoleId === role.id && (
                  <>
                    <div className={styles.modalOverlay}>
                      <div className={styles.modalContent}>
                        <DeleteConfirmation
                          onClose={() => setIsDeleteModalOpen(false)}
                          onDelete={() => handleDeleteRole(role.id)}
                          info={role.name}
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
        initialValues={{ newRoleName: '', newRoleColor: '#ffb6c1' }}
        validationSchema={addRoleValidationSchema}
        onSubmit={handleAddRole}
      >
        {({ values, handleChange, handleSubmit, errors, touched }) => (
          <Form className={styles.addContainer} onSubmit={handleSubmit}>
            <Field
              name="newRoleName"
              value={values.newRoleName}
              onChange={handleChange}
              className={classNames(styles.formInput, {
                [styles.errorInput]: errors.newRoleName && touched.newRoleName,
              })}
              placeholder="Wpisz nazwę nowej roli"
            />
            <ErrorMessage name="newRoleName" component="div" className={styles.errorMessage} />
            <Field
              name="newRoleColor"
              type="color"
              value={values.newRoleColor}
              onChange={handleChange}
              className={styles.colorPicker}
              style={{ backgroundColor: values.newRoleColor }}
            />
            <ErrorMessage name="newRoleColor" component="div" className={styles.errorMessage} />
            <button type="submit" className={styles.addButton}>
              <FontAwesomeIcon icon={faPlus} />
            </button>

            {isAddModalOpen && (
              <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                  <AddNotification onClose={() => setIsAddModalOpen(false)} info={addedRoleName} />
                </div>
              </div>
            )}

            {modalIsOpenLoadning && (
              // <div className={styles.loadingModalOverlay}>
              //   <div className={styles.loadingModalContent}>
              //     <div className={styles.spinnerContainer}><ProgressSpinner /></div>
              //   </div>
              // </div>
              <LoadingSpinner />
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default Roles;