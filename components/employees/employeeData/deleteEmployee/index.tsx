import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DeleteEmployeeConfirmationPopUp from '@/components/employees/employeeData/deleteEmployee/deleteEmployeeConfirmation';
import styles from './main.module.scss';

interface DeleteEmployeeProps {
  userId: number;
  firstName: string;
  surname: string;
  roles: {
    name: string;
  }[];
  departmentName: string;
  onClose: () => void;
}

const DeletaEmployee: React.FC<DeleteEmployeeProps> = ({ userId, firstName, surname, roles, departmentName, onClose }) => {
  const [modalStage, setModalStage] = useState<'confirm' | 'delete'>('confirm');
  const [modalCountdown, setModalCountdown] = useState(100000000);
  const [employeeLink, setEmployeeLink] = useState<string | null>(null);
  const router = useRouter();

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
              router.push("/employees");
              onClose();
            }
            return prev - 1;
          });
        }, 1000);
        setEmployeeLink(`/employees`);
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
        <DeleteEmployeeConfirmationPopUp
          firstName={firstName}
          surname={surname}
          employeeLink={employeeLink}
          onClose={onClose}
          modalCountdown={modalCountdown}
        />
      )}
    </div>
  );
};
export default DeletaEmployee;