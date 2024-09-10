"use client";

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPen, faCheck, faXmark, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import classNames from "classnames";
import DepartmentAddress from "@/components/types/departmentAddress";
import styles from "./main.module.scss";

const Departments: React.FC = () => {
    const [departments, setDepartments] = useState<DepartmentAddress[]>([]);
    const [editingDepartmentId, setEditingDepartmentId] = useState<number | null>(null);
    const [noChangesError, setNoChangesError] = useState<string | null>(null);

    const findInvalidCharacters = (value: string, allowedPattern: RegExp): string[] => {
        const invalidChars = value.split('').filter(char => !allowedPattern.test(char));
        return Array.from(new Set(invalidChars));
    };

    const departmentValidationSchema = Yup.object().shape({
        department_name: Yup.string()
            .required("Pole wymagane")
            .test('no-invalid-chars', function (value) {
                const invalidChars = findInvalidCharacters(value || '', /^[a-zA-Z ]*$/);
                return invalidChars.length === 0
                    ? true
                    : this.createError({ message: `Niedozwolone znaki: ${invalidChars.join(', ')}` });
            }),
        city: Yup.string()
            .required("Pole wymagane")
            .test('no-invalid-chars', function (value) {
                const invalidChars = findInvalidCharacters(value || '', /^[a-zA-Z ]*$/);
                return invalidChars.length === 0
                    ? true
                    : this.createError({ message: `Niedozwolone znaki: ${invalidChars.join(', ')}` });
            }),
        zip_code: Yup.string()
            .required("Pole wymagane")
            .test('no-invalid-chars', function (value) {
                const invalidChars = findInvalidCharacters(value || '', /^[0-9-]*$/);
                return invalidChars.length === 0
                    ? true
                    : this.createError({ message: `Niedozwolone znaki: ${invalidChars.join(', ')}` });
            })
            .matches(/^\d{2}-\d{3}$/, "Niepoprawny format (XX-XXX)"),
        street: Yup.string()
            .required("Pole wymagane")
            .test('no-invalid-chars', function (value) {
                const invalidChars = findInvalidCharacters(value || '', /^[a-zA-Z ]*$/);
                return invalidChars.length === 0
                    ? true
                    : this.createError({ message: `Niedozwolone znaki: ${invalidChars.join(', ')}` });
            }),
        building_number: Yup.string()
            .required("Pole wymagane")
            .test('no-invalid-chars', function (value) {
                const invalidChars = findInvalidCharacters(value || '', /^[a-zA-Z0-9]*$/);
                return invalidChars.length === 0
                    ? true
                    : this.createError({ message: `Niedozwolone znaki: ${invalidChars.join(', ')}` });
            }),
        apartment: Yup.string()
            .notRequired(),        
    });

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = () => {
        fetch("http://localhost:8080/api/v1/address")
            .then((response) => response.json())
            .then((data) => {
                const filteredDepartments = data.filter((dept: DepartmentAddress) => dept.department_name !== null);
                setDepartments(filteredDepartments);
            })
            .catch((error) => console.error("Error fetching departments:", error));
    };

    const handleAddDepartment = (values: DepartmentAddress, { resetForm }: any) => {
        fetch("http://localhost:8080/api/v1/address", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        })
            .then((response) => response.json())
            .then((addedDepartment) => {
                setDepartments([...departments, addedDepartment]);
                resetForm();
            })
            .catch((error) => console.error("Error adding department:", error));
    };

    const handleSaveEdit = (values: DepartmentAddress) => {
        if (editingDepartmentId !== null) {
            fetch(`http://localhost:8080/api/v1/address/${editingDepartmentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            })
                .then((response) => response.json())
                .then((updatedDepartment) => {
                    setDepartments((prevDepartments) =>
                        prevDepartments.map((dept) => (dept.id === updatedDepartment.id ? updatedDepartment : dept))
                    );
                    setEditingDepartmentId(null);
                })
                .catch((error) => console.error("Error updating department:", error));
        }
    };

    const handleDeleteDepartment = (departmentId: number) => {
        fetch(`http://localhost:8080/api/v1/address/${departmentId}`, {
            method: "DELETE",
        })
            .then((response) => {
                if (response.ok) {
                    setDepartments(departments.filter((dept) => dept.id !== departmentId));
                } else {
                    console.error("Failed to delete department");
                }
            })
            .catch((error) => console.error("Error deleting department:", error));
    };

    return (
        <div className={styles.departmentContainerMain}>
            <div className={styles.showDepartmentsMapContainer}>
                {departments.map((department) => (
                    <Formik
                        key={department.id}
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
                            handleSaveEdit(values);
                            resetForm();
                            setSubmitting(false);
                        }}
                        context={{ dirty: true }}
                    >
                        {({ handleSubmit, handleChange, values, errors, touched, dirty, isSubmitting, resetForm }) => (
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
                                                    <label className={styles.departmentNameLabel}>{department.department_name}</label>
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
                                                <button className={styles.editButton} onClick={() => setEditingDepartmentId(department.id)}>
                                                    <FontAwesomeIcon icon={faPen} />
                                                </button>
                                                <button className={styles.removeButton} onClick={() => handleDeleteDepartment(department.id)}>
                                                    <FontAwesomeIcon icon={faMinus} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                ))}
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
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};
export default Departments;