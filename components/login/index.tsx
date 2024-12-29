'use client';
import React from 'react';
import styles from './main.module.scss';
import { useLogin } from '@/hooks/useLogin';
import { LoginForm } from './loginForm';
import { ChangePasswordForm } from './changePasswordForm';

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
    <div className={styles.loginContainerMain}>
      <h1 className={styles.title}>Harmoni App</h1>
      <LoginForm handleLogin={handleLogin} showPassword={showPassword} setShowPassword={setShowPassword} loginError={loginError} />
      {isChangePasswordModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.title}>Zmień hasło</h2>
            <ChangePasswordForm handlePasswordChange={handlePasswordChange} loading={loading}/>
          </div>
        </div>
      )}
    </div>
  );
};
export default Login;