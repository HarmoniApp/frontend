"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPen, faCheck, faXmark, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Formik, Form, Field, ErrorMessage } from "formik";
import classNames from "classnames";
import DepartmentAddress from "@/components/types/departmentAddress";
import styles from "./main.module.scss";
import { deleteDepartment, fetchDepartmentsAddress, postDepartment, putDepartment } from "@/services/departmentService";
import LoadingSpinner from "@/components/loadingSpinner";
import ConfirmationPopUp from "@/components/confirmationPopUp";
import { Tooltip } from "primereact/tooltip";
import { departmentValidationSchema } from "@/validationSchemas/departmentValidationSchema";

const Departments = () => {
    const [departments, setDepartments] = useState<DepartmentAddress[]>([]);
    const [editingDepartmentId, setEditingDepartmentId] = useState<number | null>(null);
    const [noChangesError, setNoChangesError] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteDepartmentId, setDeleteDepartmentId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const openDeleteModal = (departmentId: number) => {
        setDeleteDepartmentId(departmentId);
        setIsDeleteModalOpen(true);
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await fetchDepartmentsAddress(setDepartments);
            setLoading(false);
        }

        loadData();
    }, []);

    const handleAddDepartment = async (values: DepartmentAddress, { resetForm }: any) => {
        try {
            postDepartment(values, setDepartments)
            resetForm();
        }
        catch (error) {
            console.error("Error adding department:", error);
        }
    };

    const handleEditDepartment = async (values: DepartmentAddress) => {
        if (editingDepartmentId !== null) {
            try {
                setEditingDepartmentId(null);
                await putDepartment(values, setDepartments);
            }
            catch (error) {
                console.error("Error updating department:", error);
            }
        }
    };

    const handleDeleteDepartment = async (departmentId: number) => {
        setIsDeleteModalOpen(false);
        await deleteDepartment(departmentId, setDepartments);
    };

    const truncateText = (text: string, maxLength: number) => {
        return text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text;
    };

    return (
        <div className={styles.departmentContainerMain}>
            <div className={styles.showDepartmentsMapContainer}>
                {departments.map((department) => {

                    const isTruncated = truncateText(department.department_name, 30) !== department.department_name;
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
                                                            }}>{truncateText(department.department_name, 30)}</label>
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
                })}
            </div>

            <Formik
                initialValues={{
                    id: 0,
                    department_name: "",
                    city: "",
                    street: "",
                    zip_code: "",
                    building_number: "",
                    apartment: "",
                }}
                validationSchema={departmentValidationSchema}
                onSubmit={handleAddDepartment}
            >
                {({ handleSubmit, handleChange, values, errors, touched }) => (
                    <Form className={styles.departmentForm} onSubmit={handleSubmit}>
                        <div className={styles.addDepartmentContainer}>
                            <div className={styles.addItemContainer}>
                                <label className={styles.inputLabel}>Nazwa Oddziału
                                    <ErrorMessage name="department_name" component="div" className={styles.errorMessage} />
                                </label>
                                <Field
                                    name="department_name"
                                    value={values.department_name}
                                    onChange={handleChange}
                                    placeholder="Wpisz nazwę oddziału"
                                    className={classNames(styles.departmentInput, {
                                        [styles.errorInput]: errors.department_name && touched.department_name,
                                    })}
                                />
                            </div>
                            <div className={styles.addItemContainer}>
                                <label className={styles.inputLabel}>Miasto
                                    <ErrorMessage name="city" component="div" className={styles.errorMessage} />
                                </label>
                                <Field
                                    name="city"
                                    value={values.city}
                                    onChange={handleChange}
                                    placeholder="Wpisz miasto"
                                    className={classNames(styles.departmentInput, {
                                        [styles.errorInput]: errors.city && touched.city,
                                    })}
                                />
                            </div>
                            <div className={styles.addItemContainer}>
                                <label className={styles.inputLabel}>Kod pocztowy
                                    <ErrorMessage name="zip_code" component="div" className={styles.errorMessage} />
                                </label>
                                <Field
                                    name="zip_code"
                                    value={values.zip_code}
                                    onChange={handleChange}
                                    placeholder="Wpisz kod pocztowy"
                                    className={classNames(styles.departmentInput, {
                                        [styles.errorInput]: errors.zip_code && touched.zip_code,
                                    })}
                                />
                            </div>
                            <div className={styles.addItemContainer}>
                                <label className={styles.inputLabel}>Ulica
                                    <ErrorMessage name="street" component="div" className={styles.errorMessage} />
                                </label>
                                <Field
                                    name="street"
                                    value={values.street}
                                    onChange={handleChange}
                                    placeholder="Wpisz ulicę"
                                    className={classNames(styles.departmentInput, {
                                        [styles.errorInput]: errors.street && touched.street,
                                    })}
                                />
                            </div>
                            <div className={styles.addItemContainer}>
                                <label className={styles.inputLabel}>Numer budynku
                                    <ErrorMessage name="building_number" component="div" className={styles.errorMessage} />
                                </label>
                                <Field
                                    name="building_number"
                                    value={values.building_number}
                                    onChange={handleChange}
                                    placeholder="Wpisz numer budynku"
                                    className={classNames(styles.departmentInput, {
                                        [styles.errorInput]: errors.building_number && touched.building_number,
                                    })}
                                />
                            </div>
                            <div className={styles.addItemContainer}>
                                <label className={styles.inputLabel}>Numer mieszkania (opcjonalnie)</label>
                                <Field
                                    name="apartment"
                                    value={values.apartment}
                                    onChange={handleChange}
                                    placeholder="Wpisz numer mieszkania (opcjonalnie)"
                                    className={styles.departmentInput}
                                />
                            </div>
                        </div>
                        <div className={styles.buttonContainer}>
                            <button type="submit" className={styles.addButton}>
                                <FontAwesomeIcon icon={faPlus} className={styles.icon} />
                                <label className={styles.addButtonLabel}>Dodaj nowy oddział</label>
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
            {loading && <LoadingSpinner />}
        </div>
    );
};
export default Departments;