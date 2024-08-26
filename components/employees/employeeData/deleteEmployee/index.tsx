import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DeleteEmployeeNotificationPopUp from '@/components/employees/employeeData/deleteEmployee/deleteEmployeeNotification';
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
    fetch(`http://localhost:8080/api/v1/user/${userId}`, {
      method: 'DELETE',
    })
      .then(() => {
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
          <h2 className={styles.questionHeader}>Czy na pewno chcesz usunąć użytkownika:</h2>
          <p className={styles.fullNameParagraph}>{firstName} {surname}</p>
          <div className={styles.butonContainter}>
            <button className={styles.deleteButton} onClick={handleDeleteEmployee}>Usuń</button>
            <button className={styles.backButton} onClick={onClose}>Cofnij</button>
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