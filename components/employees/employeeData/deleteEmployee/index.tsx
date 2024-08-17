import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from 'react-modal';
import styles from './main.module.scss';
import DeleteEmployeeConfirmationPopUp from '@/components/employees/employeeData/deleteEmployee/deleteEmployeeConfirmation';

Modal.setAppElement('#root');

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
  const [modalIsOpenDeleteEmployeeConfirmation, setModalDeleteEmployeeConfirmation] = useState(false);
  const openModaDeleteEmployeeConfirmation = () => setModalDeleteEmployeeConfirmation(true);
  const closeModalDeleteEmployee = () => setModalDeleteEmployeeConfirmation(false);

  const [modalCountdown, setModalCountdown] = useState(10);
  const [employeeLink, setEmployeeLink] = useState<string | null>(null);
  const router = useRouter();
    
  const handleDeleteEmployee = () => {
    fetch(`http://localhost:8080/api/v1/user/${userId}`, {
      method: 'DELETE',
    })
      .then(() => {
        openModaDeleteEmployeeConfirmation();
        setModalDeleteEmployeeConfirmation(true);
        const countdownInterval = setInterval(() => {
          setModalCountdown(prev => {
            if (prev === 1) {
              clearInterval(countdownInterval);
              setModalDeleteEmployeeConfirmation(false);
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
      <p>Czy na pewno chcesz usunąć użytkownika Imię:{firstName}, Nazwisko:{surname}, role: {roles.map(role => role.name).join(', ')}, w oddziale {departmentName}?</p>
      <button onClick={handleDeleteEmployee}>Usuń</button>
      <button onClick={onClose}>Cofnij</button>

      <Modal
        isOpen={modalIsOpenDeleteEmployeeConfirmation}
        contentLabel="Delete Employee"
        className={styles.modalContent}
        overlayClassName={styles.modalOverlay}
      >
        <DeleteEmployeeConfirmationPopUp
          firstName={firstName}
          surname={surname}
          employeeLink={employeeLink}
          onClose={closeModalDeleteEmployee}
          modalCountdown={modalCountdown}
        />
      </Modal>
    </div>
  );

};
export default DeletaEmployee;