import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRectangleList, faGrip, faUserPlus, faCloudArrowDown, faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';
import styles from './main.module.scss';

interface EmployeeBarProps {
  setActiveView: (view: 'tiles' | 'list') => void;
  activeView: 'tiles' | 'list';
}

const EmployeeBar: React.FC<EmployeeBarProps> = ({ setActiveView, activeView }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const router = useRouter();

  const onAddEmployee = () => {
    router.push('/employees/user/add');
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleExport = (format: string) => {
    setDropdownVisible(false);
    if (format === 'pdf') {
      console.log('Eksportuj do PDF');
    } else if (format === 'excel') {
      console.log('Eksportuj do Excel');
    }
  };

  return (
    <div className={styles.employeeBarContainerMain}>
      <div className={styles.actionContainer}>
        <button className={styles.addEmployeeButton} onClick={onAddEmployee}>
          <FontAwesomeIcon icon={faUserPlus} /> dodaj pracownika
        </button>
        <button className={styles.importEmployeeButton}>
          <FontAwesomeIcon icon={faCloudArrowUp} /> importuj
        </button>
        
        <div className={styles.exportDropdownContainer}>
          <button className={styles.importEmployeeButton} onClick={toggleDropdown}>
            <FontAwesomeIcon icon={faCloudArrowDown} /> exportuj
          </button>
          {dropdownVisible && (
            <div className={styles.exportDropdownMenu}>
              <button onClick={() => handleExport('pdf')}>Eksportuj do PDF</button>
              <button onClick={() => handleExport('excel')}>Eksportuj do Excel</button>
            </div>
          )}
        </div>
      </div>
      
      <div className={styles.viewContainer}>
        <button
          className={`${styles.listViewButton} ${activeView === 'list' ? styles.active : ''}`}
          onClick={() => setActiveView('list')}>
          <FontAwesomeIcon icon={faRectangleList} />
        </button>
        <button
          className={`${styles.tilesViewButton} ${activeView === 'tiles' ? styles.active : ''}`}
          onClick={() => setActiveView('tiles')}>
          <FontAwesomeIcon icon={faGrip} />
        </button>
      </div>
    </div>
  );
};

export default EmployeeBar;