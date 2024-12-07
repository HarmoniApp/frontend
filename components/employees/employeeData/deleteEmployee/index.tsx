import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserSlash, faArrowTurnUp } from '@fortawesome/free-solid-svg-icons';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import DeleteEmployeeNotificationPopUp from './deleteEmployeeNotification';
import styles from './main.module.scss';
import { fetchCsrfToken } from '@/services/csrfService';

interface DeleteEmployeeProps {
  userId: number;
  firstName: string;
  surname: string;
  onClose: () => void;
}

const DeletaEmployee: React.FC<DeleteEmployeeProps> = ({ userId, firstName, surname, onClose }) => {
  const [modalStage, setModalStage] = useState<'confirm' | 'delete'>('confirm');
  const [modalCountdown, setModalCountdown] = useState(10);
  const [modalIsOpenLoadning, setModalIsOpenLoadning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (modalStage === 'delete' && modalCountdown === 0) {
      router.push("/employees");
      onClose();
    }
  }, [modalStage, modalCountdown, router, onClose]);

  const handleDeleteEmployee = async () => {
    setModalIsOpenLoadning(true);
    try {
      const tokenXSRF = await fetchCsrfToken();

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/${userId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            'X-XSRF-TOKEN': tokenXSRF,
          },
          credentials: 'include',
        })
        if (!response.ok) {
          console.error('Failed to delete employee: ', response.statusText);
          throw new Error(`Failed to delete employee`);
        }
        setModalIsOpenLoadning(false);
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
      setError('Błąd podczas usuwania użytkownika');
      setModalIsOpenLoadning(false);
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
      {error && <Message severity="error" text={`Error: ${error}`} className={styles.errorMessageComponent} />}
      {modalIsOpenLoadning && (
        <div className={styles.loadingModalOverlay}>
          <div className={styles.loadingModalContent}>
            <div className={styles.spinnerContainer}><ProgressSpinner /></div>
          </div>
        </div>
      )}
    </div>
  );
};
export default DeletaEmployee;