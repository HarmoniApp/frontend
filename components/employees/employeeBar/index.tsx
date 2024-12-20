import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRectangleList, faGrip } from '@fortawesome/free-solid-svg-icons';
import { downloadUsersPDF } from '@/services/pdfService';
import { downloadUsersXLSX } from '@/services/xlsxService';
import CustomButton from '@/components/customButton';
import styles from './main.module.scss';
import ConfirmationPopUp from '@/components/confirmationPopUp';

interface EmployeeBarProps {
  setActiveView: (view: 'tiles' | 'list') => void;
  activeView: 'tiles' | 'list';
}

const EmployeeBar: React.FC<EmployeeBarProps> = ({ setActiveView, activeView }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [fileFormat, setFileFormat] = useState<string>('');
  const router = useRouter();

  const onAddEmployee = () => {
    router.push('/employees/user/add');
  };

  const importEmployee = () => {
  };

  const handleExport = async (format: string) => {
    setDropdownVisible(false);

    if (format === 'pdf') {
      setIsConfirmationModalOpen(false);
      await downloadUsersPDF();
    } else if (format === 'xlsx') {
      setIsConfirmationModalOpen(false);
      await downloadUsersXLSX();
    }
  };

  return (
    <div className={styles.employeeBarContainerMain}>
      <div className={styles.actionContainer}>
        <CustomButton icon="userPlus" writing="dodaj pracownika" action={onAddEmployee} />
        <CustomButton icon="cloudArrowUp" writing="importuj" action={importEmployee} />
        <div className={styles.exportDropdownContainer}>
          <CustomButton icon="cloudArrowDown" writing="exportuj" action={()=> setDropdownVisible(!dropdownVisible)} />
          {dropdownVisible && (
            <div className={styles.exportDropdownMenu}>
              <button onClick={() => { setFileFormat('pdf'); setIsConfirmationModalOpen(true); }}>Eksportuj do PDF</button>
              <button onClick={() => { setFileFormat('xlsx'); setIsConfirmationModalOpen(true); }}>Eksportuj do Excel</button>
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
      {isConfirmationModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <ConfirmationPopUp action={() => { handleExport(fileFormat) }} onClose={() => setIsConfirmationModalOpen(false)} description={`Pobrać plik`} />
          </div>
        </div>
      )}
    </div>
  );
};
export default EmployeeBar;