import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserSlash, faArrowTurnUp } from '@fortawesome/free-solid-svg-icons';
import styles from './main.module.scss';
import LoadingSpinner from '@/components/loadingSpinner';
import { deleteUser } from '@/services/userService';
interface DeleteEmployeeProps {
  userId: number;
  firstName: string;
  surname: string;
  onClose: () => void;
}

const DeletaEmployee: React.FC<DeleteEmployeeProps> = ({ userId, firstName, surname, onClose}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDeleteEmployee = async () => {
    setLoading(true);
    try {
      await deleteUser(userId);
    } catch (error) {
      console.error('Error deleting employee:', error)
    } finally {
      setLoading(false);
      onClose();
      router.push("/employees");
    }
  };

  return (
    <div>
      {/* {modalStage === 'confirm' ? ( */}
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
      {/* ) : (
        <DeleteEmployeeNotificationPopUp
          firstName={firstName}
          surname={surname}
          modalCountdown={modalCountdown}
        />
      )} */}
      {loading && <LoadingSpinner />}
    </div>
  );
};
export default DeletaEmployee;