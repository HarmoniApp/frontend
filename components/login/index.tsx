'use client';
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import styles from './main.module.scss';
import LoadingSpinner from '../loadingSpinner';
import { changePasswordSchema, loginValidationSchema } from '@/validationSchemas/loginValidationSchema';
import { useLogin } from '@/hooks/useLogin';

const Login = () => {
  const {
    showPassword,
    setShowPassword,
    loginError,
    isChangePasswordModalOpen,
    loading,
    handleLogin,
    handlePasswordChange,
  } = useLogin();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Harmoni App</h1>
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
      {isChangePasswordModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Zmień hasło</h2>
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
          </div>
        </div>
      )}
    </div>
  );
};
export default Login;