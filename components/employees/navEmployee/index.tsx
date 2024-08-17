import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import RolePopUp from '@/components/employees/rolePopUp';
import Modal from 'react-modal';
import styles from './main.module.scss';

Modal.setAppElement('#root');

const NavBarEmployee: React.FC = () => {
  const [modalIsOpenRole, setModalIsOpenRole] = useState(false);

  const openModalRole = () => setModalIsOpenRole(true);
  const closeModalRole = () => setModalIsOpenRole(false);

  const router = useRouter();
  const onAddEmployee = () => {
    router.push('/employees/user/add')
  }

  return (
    <div>
      <button>import pracowkik</button>
      <button onClick={onAddEmployee}>add pracowkik</button>
      <Modal
        isOpen={modalIsOpenRole}
        contentLabel="Edit Roles"
        className={styles.modalContent}
        overlayClassName={styles.modalOverlay}
      >
        <RolePopUp />
        <button onClick={closeModalRole}>Zamknij</button>
      </Modal>
      <button onClick={openModalRole}>EDIT ROLES</button>
      <button>lista widok</button>
      <button>kafelki widok</button>
    </div>
  );
}
export default NavBarEmployee;