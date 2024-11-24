import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import styles from './main.module.scss';

interface NewPasswordProps {
  newPassword: string;
  firstName: string;
  surname: string;
  onClose: () => void;
}

const NewPassword: React.FC<NewPasswordProps> = ({ newPassword, onClose, firstName, surname  }) => {

  return (
    <div className={styles.newPasswordConfirmationContainerMain}>
      <div className={styles.headerContainer}>
        <p className={styles.headerParagraph}>Nowe hasło wygenerowane dla pracownika: </p>
        <span className={styles.highlight}>{firstName}&nbsp;{surname}</span>
      </div>
      <div className={styles.passwordContainter}>
        <>
          <p className={styles.passwordParagraph}>Nowe hasło: </p>
          <p className={styles.newPassword}>{newPassword}</p>
        </>
        <p className={styles.passwrodReminder}>Proszę przekazać to jednorazowe hasło pracownikowi!</p>
      </div>
      <div className={styles.buttonConianer}>
        <button className={styles.closeButton} onClick={onClose}>
          <FontAwesomeIcon className={styles.buttonIcon} icon={faCircleXmark} />
          <p className={styles.buttonParagraph}>Zamknij</p>
        </button>
      </div>
    </div>
  );
};
export default NewPassword;