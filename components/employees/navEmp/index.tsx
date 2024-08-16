import React, { useState } from 'react';
import RolePopUp from '@/components/employees/rolePopUp';
import AddEmpPopUp from '@/components/employees/addEmpPopUp';
import Modal from 'react-modal';
import styles from './main.module.scss';

Modal.setAppElement('#root');

const NavEmp = () => {
  const [modalIsOpenRole, setModalIsOpenRole] = useState(false);
  const [modalIsOpenAddEmp, setModalIsOpenAddEmp] = useState(false);

  const openModalRole = () => setModalIsOpenRole(true);
  const closeModalRole = () => setModalIsOpenRole(false);

  const openModalAddEmp = () => setModalIsOpenAddEmp(true);
  const closeModalAddEmp = () => setModalIsOpenAddEmp(false);

  return (
    <div>
      <button>import pracowkik</button>
      <button onClick={openModalAddEmp}>add pracowkik</button>
      <Modal
        isOpen={modalIsOpenAddEmp}
        // onRequestClose={closeModalAddEmp}
        contentLabel="Add Employee"
        className={styles.modalContent}
        overlayClassName={styles.modalOverlay}
      >
        <AddEmpPopUp />
        <button onClick={closeModalAddEmp}>Zamknij</button>
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

export default NavEmp;
