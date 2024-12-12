import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRectangleList, faGrip } from '@fortawesome/free-solid-svg-icons';
import { downloadUsersPDF } from '@/services/pdfService';
import { downloadUsersXLSX } from '@/services/xlsxService';
import CustomButton from '@/components/customButton';
import styles from './main.module.scss';
import ActionStatusPopUp from '@/components/actionStatusPopUp';
interface EmployeeBarProps {
  setActiveView: (view: 'tiles' | 'list') => void;
  activeView: 'tiles' | 'list';
  showGreenPanel: (type: "success" | "error", msg: string) => void;
}

const EmployeeBar: React.FC<EmployeeBarProps> = ({ setActiveView, activeView, showGreenPanel }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const router = useRouter();

  const onAddEmployee = () => {
    router.push('/employees/user/add');
  };

  const importEmployee = () => {
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleExport = async (format: string) => {
    setDropdownVisible(false);

    const confirmDownload = window.confirm(`Czy na pewno chcesz pobrać plik w formacie ${format.toUpperCase()}?`);
    showGreenPanel("success", "Pomyślnie pobrano plik!");

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
        <CustomButton icon="userPlus" writing="dodaj pracownika" action={() => {onAddEmployee(), showGreenPanel}} />
        <CustomButton icon="cloudArrowUp" writing="importuj" action={importEmployee} />
        <div className={styles.exportDropdownContainer}>
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
    </div>
  );
};
export default EmployeeBar;