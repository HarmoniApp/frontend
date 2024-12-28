import { departmentValidationSchema } from "@/validationSchemas/departmentValidationSchema"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classnames"
import styles from './main.module.scss';
import { Formik, Form, ErrorMessage, Field } from "formik"
import { DepartmentAddress } from "@/components/types/department";

interface AddDepartmentFormProps {
    handleAddDepartment: (values: DepartmentAddress, { resetForm }: any) => void;
}

export const AddDepartmentForm: React.FC<AddDepartmentFormProps> = ({ handleAddDepartment }) => {
    return (
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
    )
}