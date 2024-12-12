'use client';
import React, {useState, useEffect} from 'react';
import styles from './main.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

type ActionStatusPopUpProps = {
  type: 'success' | 'error';
  msg: string;
  isVisible: boolean;
};

const ActionStatusPopUp: React.FC<ActionStatusPopUpProps> = ({ type, msg, isVisible }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    const fadeOutTimer = setTimeout(() => {setIsFadingOut(true);}, 4500);
    const hideTimer = setTimeout(() => {setIsFadingOut(false);}, 5000);
    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(hideTimer);
    };
  }, [isVisible]);

  if (!isVisible && !isFadingOut) return null;

  return (
    <div className={`${styles.actionStatusPopUpContainer} ${type === 'success' ? styles.success : styles.error} ${isFadingOut ? styles.fadeOut : ''}`}>
      <div className={styles.content}>
        <FontAwesomeIcon icon={type === 'success' ? faCheckCircle : faExclamationCircle} className={styles.icon} />
        <p className={styles.message}>{msg}</p>
      </div>
    </div>
  );
};
export default ActionStatusPopUp;