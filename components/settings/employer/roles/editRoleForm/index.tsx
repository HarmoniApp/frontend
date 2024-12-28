import ConfirmationPopUp from "@/components/confirmationPopUp";
import { Role } from "@/components/types/role";
import { wrapText } from "@/utils/wrapText";
import { editRoleValidationSchema } from "@/validationSchemas/roleValidationSchema";
import { faCheck, faXmark, faPen, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { Tooltip } from "primereact/tooltip";
import styles from './main.module.scss';

interface EditRoleFormProps {
    role: Role;
    editingRoleId: number | null;
    setEditingRoleId: (roleId: number | null) => void;
    isDeleteModalOpen: boolean;
    openDeleteModal: (roleId: number) => void;
    handleEditRole: (values: { id: number, editedRoleName: string; editedRoleColor: string }, { resetForm }: any) => void;
    handleDeleteRole: (roleId: number) => void;
    deleteRoleId: number | null;
    setIsDeleteModalOpen: (isOpen: boolean) => void;
}

export const EditRoleForm: React.FC<EditRoleFormProps> = ({
    role,
    editingRoleId,
    setEditingRoleId,
    isDeleteModalOpen,
    openDeleteModal,
    handleEditRole,
    handleDeleteRole,
    deleteRoleId,
    setIsDeleteModalOpen,
}) => {
    const isTruncated = wrapText(role.name, 15) !== role.name;
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
                                            {wrapText(role.name, 15)}
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
}
