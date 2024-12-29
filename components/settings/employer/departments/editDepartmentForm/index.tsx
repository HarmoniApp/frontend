import ConfirmationPopUp from "@/components/confirmationPopUp";
import { wrapText } from "@/utils/wrapText";
import { departmentValidationSchema } from "@/validationSchemas/departmentValidationSchema";
import { faCheck, faXmark, faPen, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { Tooltip } from "primereact/tooltip";
import styles from './main.module.scss';
import { DepartmentAddress } from "@/components/types/department";

interface EditDepartmentFormProps {
    department: DepartmentAddress;
    handleEditDepartment: (values: any) => void;
    handleDeleteDepartment: (id: number) => void;
    openDeleteModal: (id: number) => void;
    editingDepartmentId: number | null;
    setEditingDepartmentId: (id: number | null) => void;
    noChangesError: string | null;
    setNoChangesError: (error: string | null) => void;
    isDeleteModalOpen: boolean;
    deleteDepartmentId: number | null;
    setIsDeleteModalOpen: (isOpen: boolean) => void;
}

export const EditDepartmentForm: React.FC<EditDepartmentFormProps> = ({ department,
    handleEditDepartment,
    handleDeleteDepartment,
    openDeleteModal,
    editingDepartmentId,
    setEditingDepartmentId,
    noChangesError,
    setNoChangesError,
    isDeleteModalOpen,
    deleteDepartmentId,
    setIsDeleteModalOpen,
 }) => {
    const isTruncated = wrapText(department.department_name, 30) !== department.department_name;
    const elementId = `departmentName-${department.id}`;
    return (
        <Formik
            key={department.id + department.department_name + department.city + department.street + department.zip_code + department.building_number + department.apartment}
            initialValues={{
                id: department.id,
                department_name: department.department_name,
                city: department.city,
                street: department.street,
                zip_code: department.zip_code,
                building_number: department.building_number,
                apartment: department.apartment,
                dirtyCheck: "",
            }}
            validationSchema={departmentValidationSchema}
            onSubmit={(values, { resetForm, setSubmitting }) => {
                handleEditDepartment(values);
                resetForm();
                setSubmitting(false);
            }}
            context={{ dirty: true }}
        >
            {({ handleSubmit, handleChange, values, errors, touched, dirty, resetForm }) => (
                <Form onSubmit={(e) => {
                    e.preventDefault();

                    if (!dirty) {
                        setNoChangesError("Brak zmian!");
                        return;
                    }
                    handleSubmit();

                }} className={styles.departmentForm}>
                    <div className={styles.showDepartmentContainer}>
                        <div className={styles.departmentInfoContainer}>
                            {editingDepartmentId === department.id ? (
                                <>
                                    <label className={styles.inputLabel}>Nazwa Oddziału
                                        <ErrorMessage name="department_name" component="div" className={styles.errorMessage} />
                                    </label>
                                    <Field
                                        type="text"
                                        name="department_name"
                                        value={values.department_name}
                                        onChange={handleChange}
                                        className={classNames(styles.departmentInput, {
                                            [styles.errorInput]: errors.department_name && touched.department_name,
                                        })}
                                    />

                                    <label className={styles.inputLabel}>Miasto
                                        <ErrorMessage name="city" component="div" className={styles.errorMessage} />
                                    </label>
                                    <Field
                                        type="text"
                                        name="city"
                                        value={values.city}
                                        onChange={handleChange}
                                        className={classNames(styles.departmentInput, {
                                            [styles.errorInput]: errors.city && touched.city,
                                        })}
                                    />

                                    <label className={styles.inputLabel}>Kod pocztowy
                                        <ErrorMessage name="zip_code" component="div" className={styles.errorMessage} />
                                    </label>
                                    <Field
                                        type="text"
                                        name="zip_code"
                                        value={values.zip_code}
                                        onChange={handleChange}
                                        className={classNames(styles.departmentInput, {
                                            [styles.errorInput]: errors.zip_code && touched.zip_code,
                                        })}
                                    />

                                    <label className={styles.inputLabel}>Ulica
                                        <ErrorMessage name="street" component="div" className={styles.errorMessage} />
                                    </label>
                                    <Field
                                        type="text"
                                        name="street"
                                        value={values.street}
                                        onChange={handleChange}
                                        className={classNames(styles.departmentInput, {
                                            [styles.errorInput]: errors.street && touched.street,
                                        })}
                                    />

                                    <label className={styles.inputLabel}>Numer budynku
                                        <ErrorMessage name="building_number" component="div" className={styles.errorMessage} />
                                    </label>
                                    <Field
                                        type="text"
                                        name="building_number"
                                        value={values.building_number}
                                        onChange={handleChange}
                                        className={classNames(styles.departmentInput, {
                                            [styles.errorInput]: errors.building_number && touched.building_number,
                                        })}
                                    />

                                    <label className={styles.inputLabel}>Numer mieszkania</label>
                                    <Field
                                        type="text"
                                        name="apartment"
                                        value={values.apartment}
                                        onChange={handleChange}
                                        className={styles.departmentInput}
                                        placeholder="Numer mieszkania (opcjonalnie)"
                                    />
                                </>
                            ) : (
                                <>
                                    <div className={styles.departmentNameContainer}>
                                        <label className={styles.departmentNameLabel}
                                            data-pr-tooltip={department.department_name}
                                            data-pr-position="right"
                                            id={elementId}
                                            style={{
                                                cursor: isTruncated ? 'pointer' : 'default',
                                            }}>{wrapText(department.department_name, 30)}</label>
                                        {isTruncated && (
                                            <Tooltip target={`#${elementId}`} autoHide />
                                        )}
                                    </div>
                                    <div className={styles.departmentInfoRowContainer}>
                                        <div className={styles.departmentDataContainer}>
                                            <label className={`${styles.departmentCityLabel} ${styles.largeAll}`}>Miasto:</label>
                                            <label className={`${styles.departmentCityLabel} ${styles.comma}`}>{department.city}</label>
                                            <label className={styles.departmentCityLabel}>{department.zip_code}</label>
                                        </div>
                                        <div className={styles.departmentDataContainer}>
                                            <label className={`${styles.departmentCityLabel} ${styles.largeAll}`}>Ulica:</label>
                                            <label className={styles.departmentCityLabel}>{department.street}</label>
                                            <div className={styles.buildingNumbersContainer}>
                                                {department.apartment === "" ? (
                                                    <label className={styles.departmentCityLabel}>{department.building_number}</label>
                                                ) : (
                                                    <>
                                                        <label className={`${styles.departmentCityLabel} ${styles.slash}`}>
                                                            {department.building_number}
                                                        </label>
                                                        <label className={styles.departmentCityLabel}>{department.apartment}</label>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className={styles.editAndRemoveButtonContainer}>
                            {editingDepartmentId === department.id ? (
                                <>
                                    {noChangesError && (
                                        <label className={styles.errorMessage}>{noChangesError}</label>
                                    )}
                                    <button className={styles.yesButton} type="submit">
                                        <FontAwesomeIcon icon={faCheck} />
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.noButton}
                                        onClick={() => {
                                            resetForm();
                                            setEditingDepartmentId(null);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faXmark} />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button type='button' className={styles.editButton} onClick={() => setEditingDepartmentId(department.id)}>
                                        <FontAwesomeIcon icon={faPen} />
                                    </button>
                                    <button type='button' className={styles.removeButton} onClick={() => openDeleteModal(department.id)}>
                                        <FontAwesomeIcon icon={faMinus} />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    {isDeleteModalOpen && deleteDepartmentId === department.id && (
                        <>
                            <div className={styles.modalOverlay}>
                                <div className={styles.modalContent}>
                                    <ConfirmationPopUp action={() => handleDeleteDepartment(department.id)} onClose={() => setIsDeleteModalOpen(false)} description={`Usunąć oddział o nazwie: ${department.department_name}`} />
                                </div>
                            </div>
                        </>
                    )}
                </Form>
            )}
        </Formik>
    );
}
