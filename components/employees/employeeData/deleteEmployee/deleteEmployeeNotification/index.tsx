import React from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import styles from './main.module.scss';

interface DeleteEmployeeNotificationPopUpProps {
  firstName: string;
  surname: string;
  modalCountdown: number;
}

const DeleteEmployeeNotificationPopUp: React.FC<DeleteEmployeeNotificationPopUpProps> = ({ firstName, surname, modalCountdown }) => {
  const router = useRouter();
  const handleImmediateRedirect = () => {
    router.push("/employees");
  };
  return (
    <div className={styles.deleteConfirmationContainerMain}>
      <div className={styles.headerContainer}>
        <p className={styles.headerParagraph}>Pracownik został usuniety z listy:</p>
        <span className={styles.highlight}>{firstName}&nbsp;{surname}</span>
      </div>
      <div className={styles.counterContainter}>
        <p className={styles.counterParagraph}>Powrót do listy pracowników za:</p>
        <div className={styles.counterTimer}>
          <span className={styles.highlight}>{modalCountdown}</span>
          <p className={styles.counterTimerParagraph}>sekund.</p>
        </div>
      </div>
      <div className={styles.buttonConianer}>
        <button className={styles.closeButton} onClick={handleImmediateRedirect}>
          <FontAwesomeIcon className={styles.buttonIcon} icon={faCircleXmark} />
          <p className={styles.buttonParagraph}>Zamknij</p>
        </button>
      </div>
    </div>
  );
}
export default DeleteEmployeeNotificationPopUp;