import LoadingSpinner from "@/components/loadingSpinner";
import { changePasswordSchema } from "@/validationSchemas/loginValidationSchema";
import { Formik, Form, Field, ErrorMessage } from "formik";
import styles from './main.module.scss';

interface ChangePasswordFormProps {
    handlePasswordChange: (values: any) => void;
    loading: boolean;
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ handlePasswordChange, loading }) => (
    <Formik
        initialValues={{ newPassword: '', repeatPassword: '' }}
        validationSchema={changePasswordSchema}
        onSubmit={handlePasswordChange}
    >
        {({ errors, touched }) => (
            <Form>
                <label>Nowe Hasło</label>
                <Field type="password" name="newPassword" className={`${styles.input} ${errors.newPassword && touched.newPassword ? styles.errorInput : ''}`} />
                <ErrorMessage name="newPassword" component="div" className={styles.error} />

                <label>Powtórz Nowe Hasło</label>
                <Field type="password" name="repeatPassword" className={`${styles.input} ${errors.repeatPassword && touched.repeatPassword ? styles.errorInput : ''}`} />
                <ErrorMessage name="repeatPassword" component="div" className={styles.error} />

                <button type="submit" className={styles.button}>Zapisz</button>

                {loading && <LoadingSpinner />}
            </Form>
        )}
    </Formik>
)