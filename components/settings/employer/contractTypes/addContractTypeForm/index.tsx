import { contractValidationSchema } from "@/validationSchemas/contractValidationSchema";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Formik, Form, Field, ErrorMessage } from "formik";
import styles from './main.module.scss';
import classNames from 'classnames';
import { useContractTypes } from "@/hooks/contractTypes/useContractsTypes";

export const AddContractTypeForm: React.FC = () => {
    const { handleAddContractType } = useContractTypes();
    return (
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
    );
}

