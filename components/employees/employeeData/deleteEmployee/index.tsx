import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserSlash, faArrowTurnUp } from '@fortawesome/free-solid-svg-icons';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import DeleteEmployeeNotificationPopUp from './deleteEmployeeNotification';
import styles from './main.module.scss';
import { fetchCsrfToken } from '@/services/csrfService';
import LoadingSpinner from '@/components/loadingSpinner';
import { deleteUser } from '@/services/userService';

interface DeleteEmployeeProps {
  userId: number;
  firstName: string;
  surname: string;
  onClose: () => void;
}

const DeletaEmployee: React.FC<DeleteEmployeeProps> = ({ userId, firstName, surname, onClose }) => {
  const [modalStage, setModalStage] = useState<'confirm' | 'delete'>('confirm');
  const [modalCountdown, setModalCountdown] = useState(10);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (modalStage === 'delete' && modalCountdown === 0) {
      router.push("/employees");
      onClose();
    }
  }, [modalStage, modalCountdown, router, onClose]);

  const handleDeleteEmployee = async () => {
    setLoading(true);
    try {
      await deleteUser(userId);
        setLoading(false);
        setModalStage('delete');
        const countdownInterval = setInterval(() => {
          setModalCountdown(prev => {
            if (prev === 1) {
              clearInterval(countdownInterval);
              setModalCountdown(0);
            }
            return prev - 1;
          });
        }, 1000);
    } catch (error) {
      console.error('Error deleting employee:', error)
      setLoading(false);
    }
  };

  return (
    <div>
      {modalStage === 'confirm' ? (
        <div className={styles.deleteContainerMain}>
          <label className={styles.questionHeader}>Czy na pewno chcesz usunąć użytkownika:</label>
          <label className={styles.fullNameLabel}>{firstName} {surname}</label>
          <div className={styles.buttonContainer}>
            <button className={styles.closeButton} onClick={onClose}>
              <FontAwesomeIcon className={styles.buttonIcon} icon={faArrowTurnUp} style={{ transform: 'rotate(-90deg)' }} />
              <p className={styles.buttonParagraph}>Cofnij</p>
            </button>
            <button className={styles.deleteButton} onClick={handleDeleteEmployee}>
              <FontAwesomeIcon className={styles.buttonIcon} icon={faUserSlash} />
              <p className={styles.buttonParagraph}>Usuń</p>
            </button>
          </div>
        </div>
      ) : (
        <DeleteEmployeeNotificationPopUp
          firstName={firstName}
          surname={surname}
          modalCountdown={modalCountdown}
        />
      )}
      {loading && (
        // <div className={styles.loadingModalOverlay}>
        //   <div className={styles.loadingModalContent}>
        //     <div className={styles.spinnerContainer}><ProgressSpinner /></div>
        //   </div>
        // </div>
        <LoadingSpinner />
      )}
    </div>
  );
};
export default DeletaEmployee;