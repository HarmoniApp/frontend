import LoadingSpinner from "@/components/loadingSpinner";
import { changePasswordSchema } from "@/validationSchemas/loginValidationSchema";
import { Formik, Form, Field, ErrorMessage } from "formik";
import styles from './main.module.scss';
import CustomButton from "@/components/customButton";

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
            <Form className={styles.changePasswordForm}>
                <label className={styles.newPasswordLabel}>Nowe Hasło
                    <ErrorMessage name="newPassword" component="div" className={styles.errorMessage} />
                </label>
                <Field type="password" name="newPassword" className={`${styles.newPasswordInput} ${errors.newPassword && touched.newPassword ? styles.errorInput : ''}`} />
                <label className={styles.repeatNewPasswordLabel}>Powtórz Nowe Hasło
                    <ErrorMessage name="repeatPassword" component="div" className={styles.errorMessage} />
                </label>
                <Field type="password" name="repeatPassword" className={`${styles.repeatNewPasswordInput} ${errors.repeatPassword && touched.repeatPassword ? styles.errorInput : ''}`} />
                <CustomButton icon="floppyDisk" writing="Zapisz" typeButton="submit" />
                {loading && <LoadingSpinner />}
            </Form>
        )}
    </Formik>
)

// joanna.kowalska12@example.com