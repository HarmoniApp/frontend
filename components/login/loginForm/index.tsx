import { loginValidationSchema } from "@/validationSchemas/loginValidationSchema";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Formik, Form, Field, ErrorMessage } from "formik";
import styles from './main.module.scss';
import CustomButton from "@/components/customButton";

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
            <Form className={styles.loginForm}>
                {loginError && <div className={styles.errorMessage}>{loginError}</div>}
                <label className={styles.emailLabel} htmlFor="email">Adres Email
                    <ErrorMessage name="email" component="div" className={styles.errorMessage} />
                </label>
                <Field
                    className={`${styles.emailInput} ${errors.email && touched.email ? styles.errorInput : ''}`}
                    id="email"
                    name="email"
                    placeholder="my_email@example.com"
                />
                <label className={styles.passwordLabel} htmlFor="password">Hasło
                    <ErrorMessage name="password" component="div" className={styles.errorMessage} />
                </label>
                <div className={styles.passwordContainer}>
                    <Field
                        className={`${styles.passwordInput} ${errors.password && touched.password ? styles.errorInput : ''}`}
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
                <CustomButton icon="arrowRightToBracket" writing="Zaloguj" typeButton="submit" />
            </Form>
        )}
    </Formik>
)