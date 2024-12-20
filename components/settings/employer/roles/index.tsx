"use client";
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faPen, faXmark, faCheck } from '@fortawesome/free-solid-svg-icons';
import Role from '@/components/types/role';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { deleteRole, fetchRoles, postRole, putRole } from "@/services/roleService"
import classNames from 'classnames';
import styles from './main.module.scss';
import LoadingSpinner from '@/components/loadingSpinner';
import ConfirmationPopUp from '@/components/confirmationPopUp';
import { Tooltip } from 'primereact/tooltip';
import { addRoleValidationSchema, editRoleValidationSchema } from '@/validationSchemas/roleValidationSchema';
import useRoles from '@/hooks/useRoles';

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
  } = useRoles();

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text;
  };

  return (
    <div className={styles.roleContainerMain}>
      <div className={styles.showRoleMapConteiner}>
        {roles.map(role => {
          const isTruncated = truncateText(role.name, 15) !== role.name;
          const elementId = `roleName-${role.id}`;

          return (
            <Formik
              key={role.id}
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
                            <p
                              className={styles.roleNameParagraph}
                              data-pr-tooltip={role.name}
                              data-pr-position="right"
                              id={elementId}
                              style={{
                                cursor: isTruncated ? 'pointer' : 'default',
                              }}
                            >
                              {truncateText(role.name, 15)}
                            </p>
                            {isTruncated && (
                              <Tooltip target={`#${elementId}`} autoHide />
                            )}
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
                            <button type='button' className={styles.editButton} onClick={() => setEditingRoleId(role.id)}>
                              <FontAwesomeIcon icon={faPen} />
                            </button>
                            <button type='button' className={styles.removeButton} onClick={() => openDeleteModal(role.id)}>
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
                          <ConfirmationPopUp action={() => handleDeleteRole(role.id)} onClose={() => setIsDeleteModalOpen(false)} description={`Usunąć rolę o nazwie: ${role.name}`} />
                        </div>
                      </div>
                    </>
                  )}
                </Form>
              )}
            </Formik>
          );
        })}
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
          </Form>
        )}
      </Formik>
      {loading && <LoadingSpinner />}
    </div>
  );
};
export default Roles;