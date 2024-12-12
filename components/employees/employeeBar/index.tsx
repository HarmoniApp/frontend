import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRectangleList, faGrip, faUserPlus, faCloudArrowDown, faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';
import { ProgressSpinner } from 'primereact/progressspinner';
import styles from './main.module.scss';
import { downloadUsersPDF } from '@/services/pdfService';
import { downloadUsersXLSX } from '@/services/xlsxService';
import LoadingSpinner from '@/components/loadingSpinner';
import CustomButton from '@/components/customButton';

interface EmployeeBarProps {
  setActiveView: (view: 'tiles' | 'list') => void;
  activeView: 'tiles' | 'list';
}

const EmployeeBar: React.FC<EmployeeBarProps> = ({ setActiveView, activeView }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onAddEmployee = () => {
    router.push('/employees/user/add');
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleExport = async (format: string) => {
    setDropdownVisible(false);

    const confirmDownload = window.confirm(
      `Czy na pewno chcesz pobrać plik w formacie ${format.toUpperCase()}?`
    );

    if (!confirmDownload) {
      return;
    }

    if (format === 'pdf') {
      await downloadUsersPDF();
    } else if (format === 'xlsx') {
      await downloadUsersXLSX();
    }
  };

  return (
    <div className={styles.employeeBarContainerMain}>
      <div className={styles.actionContainer}>
        {/* <button className={styles.addEmployeeButton} onClick={onAddEmployee} >
          <FontAwesomeIcon icon={faUserPlus} /> dodaj pracownika
        </button> */}
        <CustomButton icon="userPlus" writing="dodaj pracownika" action={onAddEmployee} />
        {/* <button className={styles.importEmployeeButton} >
          <FontAwesomeIcon icon={faCloudArrowUp} /> importuj
        </button> */}

        <div className={styles.exportDropdownContainer}>
          {/* <button className={styles.importEmployeeButton} onClick={toggleDropdown} >
            <FontAwesomeIcon icon={faCloudArrowDown} /> exportuj
          </button> */}
          <CustomButton icon="cloudArrowDown" writing="exportuj" action={toggleDropdown} />
          {dropdownVisible && (
            <div className={styles.exportDropdownMenu}>
              <button onClick={() => handleExport('pdf')} > Eksportuj do PDF</button>
              <button onClick={() => handleExport('xlsx')} > Eksportuj do Excel</button>
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
      {loading && (
        <LoadingSpinner/>
      )}
    </div>
  );
};
export default EmployeeBar;