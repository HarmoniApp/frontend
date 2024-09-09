import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRectangleList, faGrip, faFileImport, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import styles from './main.module.scss';


interface EmployeeBarProps {
  setActiveView: (view: 'tiles' | 'list') => void;
  activeView: 'tiles' | 'list';
}

const EmployeeBar: React.FC<EmployeeBarProps> = ({setActiveView, activeView}) => {

  const router = useRouter();
  const onAddEmployee = () => {
    router.push('/employees/user/add')
  }

  return (
    <div className={styles.employeeBarContainerMain}>
      <div className={styles.actionContainer}>
        <button className={styles.addEmployeeButton} onClick={onAddEmployee}><FontAwesomeIcon icon={faUserPlus} />dodaj pracownika</button>
        <button className={styles.importEmployeeButton}><FontAwesomeIcon icon={faFileImport} />importuj pracownika</button>
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
    </div>
  );
}
export default EmployeeBar;