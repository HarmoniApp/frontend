"use client";
import React, { useState } from 'react';
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
        // console.log("Token:", token);

        const decodedToken = jwtDecode<MyJwtPayload>(token);

        if (!decodedToken || !decodedToken.authorities) {
          console.error("Decoded token is missing authorities or other properties.");
          setLoginError("Wystąpił błąd podczas logowania.");
          return;
        }

        // const decodedToken = jwtDecode<MyJwtPayload>(token);
        // console.log("Decoded token:", decodedToken);

        // const userId = decodedToken.id;
        // console.log("User ID:", userId);

        // const userAuthorities = decodedToken.authorities;
        // console.log("User authorities:", userAuthorities);

        // TODO: push to dashboard if admin elsa schedule
      } else if (response.status === 401) {
        setLoginError("Niepoprawne hasło lub login.");
      } else {
        console.error("Login failed:", response.statusText);
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
      {/* <div className={styles.links}>
        <a href="#" className={styles.link}>Zapomniałeś hasła?</a>
        <a href="/register" className={styles.link}>Nie masz konta? Utwórz je!</a>
      </div> */}
    </div>
  );
};
export default Login;

export const decodeToken = (token: string): MyJwtPayload => {
  return jwtDecode<MyJwtPayload>(token);
};

export const getUserId = (decodedToken: MyJwtPayload): number => {
  return decodedToken.id;
};

export const isUserAdmin = (decodedToken: MyJwtPayload | undefined): boolean => {
  return decodedToken?.authorities === 'ROLE_ADMIN';
};