"use client";
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faPen, faXmark, faCheck } from '@fortawesome/free-solid-svg-icons';
import RoleWithColour from '@/components/types/roleWithColour';
import AddNotification from '../popUps/addNotification';
import DeleteConfirmation from '../popUps/deleteConfirmation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import classNames from 'classnames';
import styles from './main.module.scss';

const Roles: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roles, setRoles] = useState<RoleWithColour[]>([]);
  const [editingRoleId, setEditingRoleId] = useState<number | null>(null);
  const [addedRoleName, setAddedRoleName] = useState<string>('');
  const [deleteRoleId, setDeleteRoleId] = useState<number | null>(null);

  const openDeleteModal = (roleId: number) => {
    setDeleteRoleId(roleId);
    setIsDeleteModalOpen(true); 
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = () => {
    fetch('http://localhost:8080/api/v1/role')
      .then(response => response.json())
      .then(data => setRoles(data))
      .catch(error => console.error('Error fetching roles:', error));
  };

  const handleDeleteRole = (roleId: number) => {
    fetch(`http://localhost:8080/api/v1/role/${roleId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          fetchRoles();
        } else {
          console.error('Failed to delete role');
        }
      })
      .catch(error => console.error('Error deleting role:', error));
  };

  const handleAddRole = (values: { newRoleName: string; newRoleColor: string }, { resetForm }: any) => {
    fetch('http://localhost:8080/api/v1/role', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: values.newRoleName, color: values.newRoleColor }),
    })
      .then(response => response.json())
      .then((newRole) => {
        setAddedRoleName(newRole.name);
        setIsAddModalOpen(true);
        fetchRoles();
        resetForm();
      })
      .catch(error => console.error('Error adding role:', error));
  };

  const handleSaveEdit = (values: { editedRoleName: string; editedRoleColor: string }, { resetForm }: any) => {
    if (editingRoleId !== null) {
      fetch(`http://localhost:8080/api/v1/role/${editingRoleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: values.editedRoleName, color: values.editedRoleColor }),
      })
        .then(response => response.json())
        .then(() => {
          fetchRoles();
          setEditingRoleId(null);
          resetForm();
        })
        .catch(error => console.error('Error updating role:', error));
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
            key={role.id}
            initialValues={{ editedRoleName: role.name, editedRoleColor: role.color || '#ffb6c1' }}
            validationSchema={editRoleValidationSchema}
            onSubmit={handleSaveEdit}
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
                    <div className={styles.modalOverlayOfDelete}>
                      <div className={styles.modalContentOfDelete}>
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
              <div className={styles.modalOverlayOfAdd}>
                <div className={styles.modalContentOfAdd}>
                  <AddNotification onClose={() => setIsAddModalOpen(false)} info={addedRoleName} />
                </div>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default Roles;