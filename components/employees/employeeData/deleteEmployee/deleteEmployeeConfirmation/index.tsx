import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './main.module.scss';

interface DeleteEmployeeConfirmationPopUpProps {
  firstName: string;
  surname: string;
  modalCountdown: number;
}

const DeleteEmployeeConfirmationPopUp: React.FC<DeleteEmployeeConfirmationPopUpProps> = ({ firstName, surname, modalCountdown }) => {
  const router = useRouter();
  const handleImmediateRedirect = () => {
    router.push("/employees");
  };
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
        <button className={styles.backButton} onClick={handleImmediateRedirect}>Zamknij</button>
      </div>
    </div>
  );
}
export default DeleteEmployeeConfirmationPopUp;