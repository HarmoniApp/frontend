import { addRoleValidationSchema } from "@/validationSchemas/roleValidationSchema";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { Formik, Form, Field, ErrorMessage } from "formik";
import styles from './main.module.scss';

interface AddRoleFormProps {
    handleAddRole: (values: { newRoleName: string; newRoleColor: string }, { resetForm }: any) => void;
}

export const AddRoleForm: React.FC<AddRoleFormProps> = ({ handleAddRole }) => {
    return (
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
    );
}