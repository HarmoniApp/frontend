import React, { useEffect, useState } from 'react';
import styles from './main.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

type ActionStatusPopUpProps = {
  type: 'success' | 'error';
  msg: string;
};

const ActionStatusPopUp: React.FC<ActionStatusPopUpProps> = ({ type, msg }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isFadingOut, setIsFadingOut] = useState(false);
    
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsFadingOut(true);
        setTimeout(() => setIsVisible(false), 500);
      }, 5000);
    
      return () => clearTimeout(timer);
    }, []);
    
    if (!isVisible) return null;

    //<ActionStatusPopUp type={'success'} msg={"Zmiana została dodana pomyślnie!"}/>
    
    return (
      <div
        className={`${styles.actionStatusPopUpContainer} ${
          type === 'success' ? styles.success : styles.error
        } ${isFadingOut ? styles.fadeOut : ''}`}
      >
        <div className={styles.icon}>
          <FontAwesomeIcon
            icon={type === 'success' ? faCheckCircle : faExclamationCircle}
          />
        </div>
        <div className={styles.content}>
          <p className={styles.message}>{msg}</p>
        </div>
      </div>
    );
};
export default ActionStatusPopUp;