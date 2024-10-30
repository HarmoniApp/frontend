'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import * as Yup from 'yup';
import styles from './main.module.scss';
import { jwtDecode } from "jwt-decode";
import MyJwtPayload from '@/components/types/myJwtPayload';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [passwordPath, setPasswordPath] = useState<string>('');
  const [tokenJWT, setTokenJWT] = useState<string>('');
  const [xsrfToken, setXsrfToken] = useState<string>('');
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Niepoprawny adres e-mail.')
      .required('Pole wymagane'),
    password: Yup.string().required('Hasło jest wymagane'),
  });

  const changePasswordSchema = Yup.object().shape({
    newPassword: Yup.string()
      .required('Wymagane nowe hasło')
      .min(8, 'Hasło musi mieć co najmniej 8 znaków'),
    repeatPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], 'Hasła muszą być takie same')
      .required('Potwierdzenie hasła jest wymagane'),
  });

  useEffect(() => {
    if (xsrfToken) {
      console.log("XSRF TOKEN after set:", xsrfToken);
    }
  }, [xsrfToken]);

  const getCookieToken = async (token: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/csrf`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log("COOKIE TOKEN:", data.token);
        setXsrfToken(data.token);
      } else {
        console.error("Failed to retrieve CSRF token:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred while retrieving CSRF token:", error);
    }
  };

  useEffect(() => {
    if (tokenJWT) {
      console.log("TokenJWT after set:", tokenJWT);
      getCookieToken(tokenJWT);
    }
  }, [tokenJWT]);

  const handleSubmit = async (values: any) => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.email,
          password: values.password,
        }),
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        setLoginError(null);
        const data = await response.json();
        const tokenJTW = data.jwtToken;
        setPasswordPath(data.path);
        setTokenJWT(tokenJTW);

        const decodedToken = jwtDecode<MyJwtPayload>(tokenJTW);
        const oneTimeUsedPass = data.path || '';
        if (oneTimeUsedPass.length > 0) {
          setIsChangePasswordModalOpen(true);
        }

        const userId = decodedToken.id;
        const isAdmin = decodedToken.authorities === 'ROLE_ADMIN';

        sessionStorage.setItem('tokenJWT', tokenJTW);
        sessionStorage.setItem('userId', userId.toString());
        sessionStorage.setItem('isAdmin', JSON.stringify(isAdmin));

        if (isAdmin) {
          router.push('/dashboard');
        } else {
          router.push('/schedule');
        }

        console.log("Login successful");
      } else if (response.status === 401) {
        setLoginError("Niepoprawne hasło lub login.");
      } else {
        setLoginError("Wystąpił błąd podczas logowania.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setLoginError("Wystąpił błąd podczas logowania.");
    }
  };

  const handlePasswordChangeSubmit = async (values: any) => {
    try {
      const response = await fetch(`http://localhost:8080${passwordPath}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenJWT}`,
          'X-XSRF-TOKEN': xsrfToken || '',
        },
        body: JSON.stringify({
          newPassword: values.newPassword,
        }),
      });

      console.log("Headers:", {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenJWT}`,
        'X-XSRF-TOKEN': xsrfToken || '',
      });
      console.log("Body:", {
        newPassword: values.newPassword,
      });

      if (response.ok) {
        console.log("Password changed successfully to:", values.newPassword);
        setIsChangePasswordModalOpen(false);
      } else {
        console.error("Failed to change password:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred while changing password:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Harmoni App</h1>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className={styles.form}>
            {loginError && <div className={styles.errorMessage}>{loginError}</div>}
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
                onClick={togglePasswordVisibility}
              />
            </div>
            <ErrorMessage name="password" component="div" className={styles.error} />

            <button type="submit" className={styles.button}>Zaloguj</button>
          </Form>
        )}
      </Formik>

      {isChangePasswordModalOpen && (
        <div className={styles.passwordChangemModalOverlay}>
          <div className={styles.passwordChangemModalContent}>
            <h2>Zmień hasło</h2>
            <Formik
              initialValues={{ newPassword: '', repeatPassword: '' }}
              validationSchema={changePasswordSchema}
              onSubmit={handlePasswordChangeSubmit}
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
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;