"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from './main.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { jwtDecode } from "jwt-decode";
import MyJwtPayload from '@/components/types/myJwtPayload';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
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

      if (response.ok) {
        setLoginError(null);
        const data = await response.json();
        const token = data.jwtToken;
        const decodedToken = jwtDecode<MyJwtPayload>(token);

        const userId = decodedToken.id;
        console.log('userId', userId);
        const isAdmin = decodedToken.authorities === 'ROLE_ADMIN';
        console.log('isAdmin', isAdmin);


        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId.toString());
        localStorage.setItem('isAdmin', JSON.stringify(isAdmin));

        if (isAdmin) {
          router.push('/dashboard');
        } else {
          router.push('/schedule');
        }
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
    </div>
  );
};

export default Login;