"use client";
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from './main.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('Imię jest wymagane'),
    lastName: Yup.string().required('Nazwisko jest wymagane'),
    email: Yup.string().email('Nieprawidłowy email').required('Email jest wymagany'),
    password: Yup.string().required('Hasło jest wymagane'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Hasła muszą się zgadzać')
      .required('Powtórz hasło jest wymagane'),
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Rejestracja</h1>
      <Formik
        initialValues={{ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {({ errors, touched }) => (
          <Form className={styles.form}>
            <label className={styles.label} htmlFor="firstName">Imię</label>
            <Field
              className={`${styles.input} ${errors.firstName && touched.firstName ? styles.errorInput : ''}`}
              type="text"
              id="firstName"
              name="firstName"
              placeholder="Twoje imię"
            />
            <ErrorMessage name="firstName" component="div" className={styles.error} />

            <label className={styles.label} htmlFor="lastName">Nazwisko</label>
            <Field
              className={`${styles.input} ${errors.lastName && touched.lastName ? styles.errorInput : ''}`}
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Twoje nazwisko"
            />
            <ErrorMessage name="lastName" component="div" className={styles.error} />

            <label className={styles.label} htmlFor="email">Adres Email</label>
            <Field
              className={`${styles.input} ${errors.email && touched.email ? styles.errorInput : ''}`}
              type="email"
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

            <label className={styles.label} htmlFor="confirmPassword">Powtórz hasło</label>
            <div className={styles.passwordContainer}>
              <Field
                className={`${styles.input} ${errors.confirmPassword && touched.confirmPassword ? styles.errorInput : ''}`}
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="********"
              />
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEyeSlash : faEye}
                className={styles.eyeIcon}
                onClick={toggleConfirmPasswordVisibility}
              />
            </div>
            <ErrorMessage name="confirmPassword" component="div" className={styles.error} />

            <button type="submit" className={styles.button}>Zarejestruj się</button>
          </Form>
        )}
      </Formik>
      <div className={styles.links}>
        <a href="/login" className={styles.link}>Masz już konto? Zaloguj się!</a>
      </div>
    </div>
  );
};

export default Register;
