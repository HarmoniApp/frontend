import React from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import styles from './main.module.scss';

interface AddEmployeeConfirmationProps {
  firstname: string;
  surname: string;
  employeeId: number | null;
  modalCountdown: number;
  onClose: () => void;
}

const AddEmployeeNotification: React.FC<AddEmployeeConfirmationProps> = ({ firstname, surname, employeeId, modalCountdown, onClose }) => {
  const router = useRouter();

  const handleDetailsClick = () => {
      router.push(`/employees/user/${employeeId}`);
  };

  return (
    <div className={styles.addEmplyeeConfirmationContainerMain}>
      <div className={styles.headerContainer}>
        <p className={styles.headerParagraph}>Właśnie dodałeś pracownika:</p>
        <span className={styles.highlight}>{firstname} {surname}</span>
      </div>
      <div className={styles.counterContainter}>
        <p className={styles.counterParagraph}>Powrót do listy pracowników za:</p>
        <div className={styles.counterTimerContainer}>
          <label className={styles.highlightTimeLabel}>{modalCountdown}</label>
          <label className={styles.counterTimerLabel}>sekund.</label>
        </div>
      </div>
      <div className={styles.buttonConianer}>
        <button className={styles.closeButton} onClick={onClose}>
          <FontAwesomeIcon className={styles.buttonIcon} icon={faCircleXmark} />
          <p className={styles.buttonParagraph}>Zamknij</p>
        </button>
        <button className={styles.detailsButton} onClick={handleDetailsClick}>
          <FontAwesomeIcon className={styles.buttonIcon} icon={faCircleInfo} />
          <p className={styles.buttonParagraph}>Szczegóły</p>
        </button>
      </div>
    </div>
  );
};
export default AddEmployeeNotification;