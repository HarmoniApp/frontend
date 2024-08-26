import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './main.module.scss';

interface AddEmployeeConfirmationProps {
  firstname: string;
  surname: string;
  employeeLink: string | null;
  modalCountdown: number;
  onClose: () => void;
}

const AddEmployeeNotification: React.FC<AddEmployeeConfirmationProps> = ({ firstname, surname, employeeLink, modalCountdown, onClose }) => {
  const router = useRouter();

  const handleDetailsClick = () => {
    if (employeeLink) {
      router.push(employeeLink);
    }
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
          <span className={styles.highlight}>{modalCountdown}</span>
          <p className={styles.counterTimerParagraph}>sekund.</p>
        </div>
      </div>
      <div className={styles.buttonConianer}>
        <button className={styles.employeeInfo} onClick={handleDetailsClick}>Szczegóły</button>
        <button className={styles.closeButton} onClick={onClose}>Zamknij</button>
      </div>
    </div>
  );
};

export default AddEmployeeNotification;
