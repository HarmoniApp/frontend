"use client";
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from './main.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Nieprawidłowy email').required('Email jest wymagany'),
    password: Yup.string().required('Hasło jest wymagane'),
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Harmoni App</h1>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {({ errors, touched }) => (
          <Form className={styles.form}>
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

            <button type="submit" className={styles.button}>Zaloguj</button>
          </Form>
        )}
      </Formik>
      <div className={styles.links}>
        <a href="#" className={styles.link}>Zapomniałeś hasła?</a>
        <a href="/register" className={styles.link}>Nie masz konta? Utwórz je!</a>
      </div>
    </div>
  );
};

export default Login;
