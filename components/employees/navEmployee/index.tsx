import React, { useState } from 'react';
import RolePopUp from '@/components/employees/rolePopUp';
import AddEmployee from '@/components/employees/addEmployee';
import Modal from 'react-modal';
import styles from './main.module.scss';

Modal.setAppElement('#root');

interface NavbarEmployeeProps {
  refreshData: () => void;
}

const NavBarEmployee: React.FC<NavbarEmployeeProps> = ({refreshData}) => {
  const [modalIsOpenRole, setModalIsOpenRole] = useState(false);
  const [modalIsOpenAddEmployee, setModalIsOpenAddEmp] = useState(false);

  const openModalRole = () => setModalIsOpenRole(true);
  const closeModalRole = () => setModalIsOpenRole(false);

  const openModalAddEmp = () => setModalIsOpenAddEmp(true);
  const closeModalAddEmp = () => setModalIsOpenAddEmp(false);

  return (
    <div>
      <button>import pracowkik</button>
      <button onClick={openModalAddEmp}>add pracowkik</button>
      <Modal
        isOpen={modalIsOpenAddEmployee}
        // onRequestClose={closeModalAddEmp}
        contentLabel="Add Employee"
        className={styles.modalContent}
        overlayClassName={styles.modalOverlay}
      >
        <AddEmployee
          onClose={closeModalAddEmp}
          onRefreshData={refreshData}
         />
      </Modal>
      <button onClick={openModalRole}>EDIT ROLES</button>
      <Modal
        isOpen={modalIsOpenRole}
        // onRequestClose={closeModalRole}
        contentLabel="Edit Roles"
        className={styles.modalContent}
        overlayClassName={styles.modalOverlay}
      >
        <RolePopUp />
        <button onClick={closeModalRole}>Zamknij</button>
      </Modal>
      <button>lista widok</button>
      <button>kafelki widok</button>
    </div>
  );
}

export default NavBarEmployee;
