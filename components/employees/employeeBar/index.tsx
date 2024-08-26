import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRectangleList, faGrip, faFileImport, faPenToSquare, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import RolePopUp from '@/components/employees/rolePopUp';
import Modal from 'react-modal';
import styles from './main.module.scss';

Modal.setAppElement('#root');

interface EmployeeBarProps {
  setActiveView: (view: 'tiles' | 'list') => void;
  activeView: 'tiles' | 'list';
}

const EmployeeBar: React.FC<EmployeeBarProps> = ({setActiveView, activeView}) => {
  const [modalIsOpenRole, setModalIsOpenRole] = useState(false);

  const openModalRole = () => setModalIsOpenRole(true);
  const closeModalRole = () => setModalIsOpenRole(false);

  const router = useRouter();
  const onAddEmployee = () => {
    router.push('/employees/user/add')
  }

  return (
    <div className={styles.employeeBarContainerMain}>
      <div className={styles.actionContainer}>
        <button className={styles.addEmployeeButton} onClick={onAddEmployee}><FontAwesomeIcon icon={faUserPlus} />dodaj pracownika</button>
        <button className={styles.importEmployeeButton}><FontAwesomeIcon icon={faFileImport} />importuj pracownika</button>
        <button className={styles.editRoles} onClick={openModalRole}><FontAwesomeIcon icon={faPenToSquare} />edytuj role</button>
      </div>
      <div className={styles.viewContainer}>
        <button
          className={`${styles.listViewButton} ${activeView === 'list' ? styles.active : ''}`}
          onClick={() => setActiveView('list')}><FontAwesomeIcon icon={faRectangleList} />
        </button>
        <button
          className={`${styles.tilesViewButton} ${activeView === 'tiles' ? styles.active : ''}`}
          onClick={() => setActiveView('tiles')}><FontAwesomeIcon icon={faGrip} />
        </button>
      </div>
      <Modal
        isOpen={modalIsOpenRole}
        contentLabel="Edit Roles"
        className={styles.modalContentOfEditRoles}
        overlayClassName={styles.modalOverlayOfEditRoles}
      >
        <RolePopUp onClick={closeModalRole}  /> 
      </Modal>
    </div>
  );
}
export default EmployeeBar;