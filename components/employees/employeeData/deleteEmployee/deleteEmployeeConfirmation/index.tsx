import React from 'react';
import styles from './main.module.scss';
import { count } from 'console';

interface DeleteEmployeeConfirmationPopUpProps {
  firstName: string;
  surname: string;
  employeeLink: string | null;
  onClose: () => void;
  modalCountdown: number;
}

const DeleteEmployeeConfirmationPopUp: React.FC<DeleteEmployeeConfirmationPopUpProps> = ({ firstName, surname, employeeLink, onClose, modalCountdown }) => {
  return (
    <div className={styles.deleteConfirmationCntainerMain}>
      <div className={styles.questionContainer}>
      <p className={styles.questionParagraph}>Pracownik został usuniety z listy:</p>
        <span className={styles.highlight}>{firstName}&nbsp;{surname}</span>
      </div>
      <div className={styles.counterContainter}>
        <p className={styles.counterParagraph}>Powrót do listy pracowników za:</p>
        <div className={styles.counterTimer}>
          <span className={styles.highlight}>{modalCountdown}</span>
          <p className={styles.counterParagraph}>sekund.</p>
        </div>
      </div>
      <div className={styles.buttonConianer}>
        <button className={styles.backButton} onClick={onClose}><a href={employeeLink ?? ''} className={styles.a}>Powrót</a></button>
      </div>
    </div>
  );
}
export default DeleteEmployeeConfirmationPopUp;