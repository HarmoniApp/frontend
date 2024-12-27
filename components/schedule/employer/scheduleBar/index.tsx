import React, { useState } from 'react';
import styles from './main.module.scss';
import { downloadSchedulePdf } from '@/services/pdfService';
import { downloadScheduleXLSX } from '@/services/xlsxService';
import CustomButton from '@/components/customButton';
import ConfirmationPopUp from '@/components/confirmationPopUp';
import { formatDate } from '@/utils/formatDate';
import { ImportScheduleForm } from './importScheduleForm';
interface ScheduleBarProps {
  currentWeek: Date[];
  onNextWeek: () => void;
  onPreviousWeek: () => void;
  onPublishAll: () => void;
}

const ScheduleBar: React.FC<ScheduleBarProps> = ({ currentWeek, onNextWeek, onPreviousWeek, onPublishAll }) => {
  const [modalIsOpenPublish, setModalIsOpenPublish] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [fileFormat, setFileFormat] = useState<string>('');
  const [importModal, setImportModal] = useState(false);

  const handleExport = async (format: string) => {
    setDropdownVisible(false);

    if (format === 'pdf') {
      setIsConfirmationModalOpen(false);
      await downloadSchedulePdf(currentWeek);
    } else if (format === 'xlsx') {
      setIsConfirmationModalOpen(false);
      await downloadScheduleXLSX(currentWeek);
    }
  };

  const handleImport = () => {
    setImportModal(true);
  };

  const handlePublish = async () => {
    setModalIsOpenPublish(false);
    await onPublishAll();
  }

  return (
    <div className={styles.scheduleBarContainerMain}>
      <div className={styles.buttonContainer}>
        <CustomButton icon="calendarCheck" writing="Opublikuj" action={() => setModalIsOpenPublish(true)} />
        <CustomButton icon="cloudArrowUp" writing="importuj" action={handleImport} />
        <div className={styles.exportDropdownContainer}>
          <CustomButton icon="cloudArrowDown" writing="Exportuj" action={() => setDropdownVisible(prev => !prev)} />
          {dropdownVisible && (
            <div className={styles.exportDropdownMenu}>
              <button onClick={() => { setFileFormat('pdf'); setIsConfirmationModalOpen(true); }}>Eksportuj do PDF</button>
              <button onClick={() => { setFileFormat('xlsx'); setIsConfirmationModalOpen(true); }}>Eksportuj do Excel</button>
            </div>
          )}
        </div>
      </div>
      <div className={styles.weekSwitcher}>
        <CustomButton icon="chevronLeft" writing="" action={onPreviousWeek} />
        <div className={styles.dateRange}>
          <p className={styles.dateRangeParagraph}>
            {currentWeek[0].toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </p>
          <p className={styles.dateRangeParagraph}>-</p>
          <p className={styles.dateRangeParagraph}>
            {currentWeek[6].toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </p>
        </div>
        <CustomButton icon="chevronRight" writing="" action={onNextWeek} />
      </div>
      {modalIsOpenPublish && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <ConfirmationPopUp action={handlePublish} onClose={() => setModalIsOpenPublish(false)} description={`Opublikować zmiany na ten tydzien: ${formatDate(currentWeek[0])} - ${formatDate(currentWeek[6])}`} />
          </div>
        </div>
      )}
      {isConfirmationModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <ConfirmationPopUp action={() => { handleExport(fileFormat) }} onClose={() => setIsConfirmationModalOpen(false)} description={`Pobrać plik`} />
          </div>
        </div>
      )}
      {importModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <ImportScheduleForm
              onClose={() => setImportModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default ScheduleBar;