import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserSlash, faArrowTurnUp } from '@fortawesome/free-solid-svg-icons';
import DeleteEmployeeNotificationPopUp from './deleteEmployeeNotification';
import styles from './main.module.scss';

interface DeleteEmployeeProps {
  userId: number;
  firstName: string;
  surname: string;
  onClose: () => void;
}

const DeletaEmployee: React.FC<DeleteEmployeeProps> = ({ userId, firstName, surname, onClose }) => {
  const [modalStage, setModalStage] = useState<'confirm' | 'delete'>('confirm');
  const [modalCountdown, setModalCountdown] = useState(10);
  const router = useRouter();

  useEffect(() => {
    if (modalStage === 'delete' && modalCountdown === 0) {
      router.push("/employees");
      onClose();
    }
  }, [modalStage, modalCountdown, router, onClose]);

  const handleDeleteEmployee = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to delete employee with status: ${response.status}`);
        }
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
      })
      .catch(error => console.error('Error deleting employee:', error));
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
    </div>
  );
};
export default DeletaEmployee;