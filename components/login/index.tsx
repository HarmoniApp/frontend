'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import * as Yup from 'yup';
import styles from './main.module.scss';
import { jwtDecode } from "jwt-decode";
import MyJwtPayload from '@/components/types/myJwtPayload';
import LoadingSpinner from '../loadingSpinner';
import { patchChangePassword } from '@/services/passwordService';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordPath, setPasswordPath] = useState<string>('');
  const router = useRouter();

  const findInvalidCharacters = (value: string, allowedPattern: RegExp): string[] => {
    const invalidChars = value.split('').filter(char => !allowedPattern.test(char));
    return Array.from(new Set(invalidChars));
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Niepoprawny adres e-mail.')
      .required('Pole wymagane')
      .test('no-invalid-chars', function (value) {
        const invalidChars = findInvalidCharacters(value || '', /^[a-zA-Z0-9@.-]*$/);
        return invalidChars.length === 0
          ? true
          : this.createError({ message: `Niedozwolone znak: ${invalidChars.join(', ')}` });
      })
      .test('no-consecutive-special-chars', 'Niedozwolone znaki', function (value) {
        const invalidPattern = /(\.\.|--|@@)/;
        return !invalidPattern.test(value || '');
      }),
    password: Yup.string().required('Hasło jest wymagane'),
  });

  const changePasswordSchema = Yup.object().shape({
    newPassword: Yup.string()
      .required('Wymagane nowe hasło')
      .min(8, 'Hasło musi mieć co najmniej 8 znaków')
      .matches(/[0-9]/, 'Hasło wymaga cyfry')
      .matches(/[a-z]/, 'Hasło wymaga małej litery')
      .matches(/[A-Z]/, 'Hasło wymaga dużej litery')
      .matches(/[^\w]/, 'Hasło wymaga znaku specjalnego'),
    repeatPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], 'Hasła muszą być takie same')
      .required('Potwierdzenie hasła jest wymagane'),
  });

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.email,
          password: values.password,
        }),
      });

      if (response.ok) {
        setLoginError(null);
        const data = await response.json();
        const tokenJWT = data.jwtToken;
        setPasswordPath(data.path);

        const decodedToken = jwtDecode<MyJwtPayload>(tokenJWT);
        const userId = decodedToken.id;
        const username = decodedToken.username;
        const isAdmin = decodedToken.authorities === 'ROLE_ADMIN';

        sessionStorage.setItem('tokenJWT', tokenJWT);
        sessionStorage.setItem('userId', userId.toString());
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('isAdmin', JSON.stringify(isAdmin));

        const oneTimeUsedPass = data.path || '';
        if (oneTimeUsedPass.length > 0) {
          setIsChangePasswordModalOpen(true);
        } else {
          if (isAdmin) {
            router.push('/dashboard');
          } else {
            router.push('/schedule');
          }
        }
      } else if (response.status === 401) {
        setLoginError("Niepoprawne hasło lub login.");
      } else {
        setLoginError("Wystąpił błąd podczas logowania.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setLoginError("Wystąpił błąd podczas logowania.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChangeSubmit = async (values: any) => {
    setLoading(true);
    try {
      await patchChangePassword(values, passwordPath)

      setIsChangePasswordModalOpen(false);
    } catch (error) {
      console.error("An error occurred while changing password:", error);
    } finally {
      setLoading(false);
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
      {isChangePasswordModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
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

                  {loading && <LoadingSpinner />}
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