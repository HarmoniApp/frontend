import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRectangleList, faGrip, faUserPlus, faCloudArrowDown, faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';
import { ProgressSpinner } from 'primereact/progressspinner';
import styles from './main.module.scss';

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

  const downloadPDF = async () => {
    setLoading(true);
    const responsePDF = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/pdf/generate-pdf-all-employees`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/pdf',
        'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
      }
    });

    if (!responsePDF.ok) {
      console.error('Error downloading PDF');
      setLoading(false);
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
    setLoading(false);
  };

  const downloadXLSX = async () => {
    setLoading(true);
    const responseXLSX = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/excel/users/export-excel`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/pdf',
        'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
      }
    });

    if (!responseXLSX.ok) {
      console.error('Error downloading XLSX');
      setLoading(false);
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
    setLoading(false);
  };

  const handleExport = (format: string) => {
    setDropdownVisible(false);

    const confirmDownload = window.confirm(
      `Czy na pewno chcesz pobrać plik w formacie ${format.toUpperCase()}?`
    );

    if (!confirmDownload) {
      return;
    }

    if (format === 'pdf') {
      downloadPDF();
    } else if (format === 'xlsx') {
      downloadXLSX();
    }
  };

  return (
    <div className={styles.employeeBarContainerMain}>
      <div className={styles.actionContainer}>
        <button className={styles.addEmployeeButton} onClick={onAddEmployee} >
          <FontAwesomeIcon icon={faUserPlus} /> dodaj pracownika
        </button>
        <button className={styles.importEmployeeButton} >
          <FontAwesomeIcon icon={faCloudArrowUp} /> importuj
        </button>

        <div className={styles.exportDropdownContainer}>
          <button className={styles.importEmployeeButton} onClick={toggleDropdown} >
            <FontAwesomeIcon icon={faCloudArrowDown} /> exportuj
          </button>
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
        <div className={styles.spinnerOverlay}>
          <div className={styles.spinnerContainer}>
            <ProgressSpinner />
          </div>
        </div>
      )}
    </div>
  );
};
export default EmployeeBar;