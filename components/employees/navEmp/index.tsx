import React, { useState } from 'react';
import RolePopUp from '@/components/employees/rolePopUp';
import Modal from 'react-modal';
import styles from './main.module.scss';

const NavEmp = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  return (
    <div>
      <button>import pracowkik</button>
      <button>add pracowkik</button>
      <button onClick={openModal}>EDIT ROLES</button>
      <button>lista widok</button>
      <button>kafelki widok</button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Roles"
        className={styles.modalContent}
        overlayClassName={styles.modalOverlay}
      >
        <RolePopUp />
        <button onClick={closeModal}>Zamknij</button>
      </Modal>
    </div>
  );
}

export default NavEmp;
