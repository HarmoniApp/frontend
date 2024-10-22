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

  const downloadPDF = async () => {
    const responsePDF = await fetch(`http://localhost:8080/api/v1/pdf/generate-pdf-all-employees`);

    if (!responsePDF.ok) {
      console.error('Error downloading PDF');
      return;
    }

    const blob = await responsePDF.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    const filename = `allUsers.pdf`;

    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const downloadXLSX = async () => {
    const responseXLSX = await fetch(`http://localhost:8080/api/v1/excel/users/export-excel`);

    if (!responseXLSX.ok) {
      console.error('Error downloading XLSX');
      return;
    }

    const blob = await responseXLSX.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    const filename = `allUsers.xlsx`;

    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleExport = (format: string) => {
    setDropdownVisible(false);
    if (format === 'pdf') {
      downloadPDF();
    } else if (format === 'xlsx') {
      downloadXLSX();
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
              <button onClick={() => handleExport('xlsx')}>Eksportuj do Excel</button>
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