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
  const [modalCountdown, setModalCountdown] = useState(10);
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
          <h2 className={styles.questionParagraph}>Czy na pewno chcesz usunąć użytkownika w oddziale:</h2>
          <p className={styles.departmentParagraph}>{departmentName}</p>
          <p className={styles.fullNameParagraph}>Imię:
            <span className={styles.highlight}>{firstName}</span>, Nazwisko:
            <span className={styles.highlight}>{surname}</span>
          </p>
          {/* , role: {roles.map(role => role.name).join(', ')} */}
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