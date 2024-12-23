import { loginValidationSchema } from "@/validationSchemas/loginValidationSchema";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Formik, Form, Field, ErrorMessage } from "formik";
import styles from './main.module.scss';

interface LoginFormProps {
    handleLogin: (values: any) => void;
    showPassword: boolean;
    setShowPassword: (value: boolean) => void;
    loginError?: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({ handleLogin, showPassword, setShowPassword, loginError }) => (
    <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={loginValidationSchema}
        onSubmit={handleLogin}
    >
        {({ errors, touched }) => (
            <Form className={styles.form}>
                {loginError && <div className={styles.error}>{loginError}</div>}
                <label className={styles.label} htmlFor="email">Adres Email</label>
                <Field
                    className={`${styles.input} ${errors.email && touched.email ? styles.errorInput : ''}`}
                    id="email"
                    name="email"
                    placeholder="my_email@example.com"
                />
                <ErrorMessage name="email" component="div" className={styles.error} />

                <label className={styles.label} htmlFor="password">Hasło</label>
                <div className={styles.passwordContainer}>
                    <Field
                        className={`${styles.input} ${errors.password && touched.password ? styles.errorInput : ''}`}
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        placeholder="********"
                    />
                    <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                        className={styles.eyeIcon}
                        onClick={() => setShowPassword(!showPassword)}
                    />
                </div>
                <ErrorMessage name="password" component="div" className={styles.error} />

                <button type="submit" className={styles.button}>Zaloguj</button>
            </Form>
        )}
    </Formik>
)