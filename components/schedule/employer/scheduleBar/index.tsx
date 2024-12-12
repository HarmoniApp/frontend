import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faCloudArrowDown, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import PublishConfirmation from './publishConfirmation';
import styles from './main.module.scss';
import { downloadSchedulePdf } from '@/services/pdfService';
import { downloadScheduleXLSX } from '@/services/xlsxService';
import LoadingSpinner from '@/components/loadingSpinner';
import CustomButton from '@/components/customButton';
import ActionStatusPopUp from '@/components/actionStatusPopUp';

interface ScheduleBarProps {
  currentWeek: Date[];
  onNextWeek: () => void;
  onPreviousWeek: () => void;
  onPublishAll: () => void;
}

const ScheduleBar: React.FC<ScheduleBarProps> = ({ currentWeek, onNextWeek, onPreviousWeek, onPublishAll }) => {
  const [modalIsOpenPublish, setModalIsOpenPublish] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionStatus, setActionStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [isPopUpVisible, setPopUpVisible] = useState(false);

  const showPopUp = (type: "success" | "error", msg: string) => {
    setActionStatus({ type, msg });
    setPopUpVisible(true);
    setTimeout(() => setPopUpVisible(false), 5000);
  };

  const formatDate = (date: Date) => {
    const [year, month, day] = date.toISOString().split('T')[0].split('-');
    return `${day}.${month}.${year}`;
  };

  const getThisWeek = () => {
    const startOfWeek = formatDate(currentWeek[0]);
    const endOfWeek = formatDate(currentWeek[6]);

    return `${startOfWeek} - ${endOfWeek}`;
  };

  const handleExport = async (format: string) => {
    setDropdownVisible(false);
    const weekRange = getThisWeek();
    const confirmDownload = window.confirm(`Czy na pewno chcesz pobrać plik w formacie ${format.toUpperCase()} na ten tydzień: ${weekRange}?`);
    showPopUp("success", "Pomyślnie pobrano plik!");

    if (!confirmDownload) {
      return;
    }

    if (format === 'pdf') {
      await downloadSchedulePdf(currentWeek);
    } else if (format === 'xlsx') {
      await downloadScheduleXLSX(currentWeek);
    }
  };

  return (
    <div className={styles.scheduleBarContainerMain}>
      <div className={styles.buttonContainer}>
        <CustomButton icon="calendarCheck" writing="Opublikuj" action={() => setModalIsOpenPublish(true)}/>
        <div className={styles.exportDropdownContainer}>
          <CustomButton icon="cloudArrowDown" writing="Exportuj" action={() => setDropdownVisible(prev => !prev)}/>
          {dropdownVisible && (
            <div className={styles.exportDropdownMenu}>
              <button onClick={() => handleExport('pdf')}>Eksportuj do PDF</button>
              <button onClick={() => handleExport('xlsx')}>Eksportuj do Excel</button>
            </div>
          )}
        </div>
      </div>
      <div className={styles.weekSwitcher}>
        <CustomButton icon="chevronLeft" writing="" action={onPreviousWeek}/>
        <div className={styles.dateRange}>
          <p className={styles.dateRangeParagraph}>
            {currentWeek[0].toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </p>
          <p className={styles.dateRangeParagraph}>-</p>
          <p className={styles.dateRangeParagraph}>
            {currentWeek[6].toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </p>
        </div>
        <CustomButton icon="chevronRight" writing="" action={onNextWeek}/>
      </div>
      {modalIsOpenPublish && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <PublishConfirmation
              onPublish={() => {
                onPublishAll();
                showPopUp("success", "Opublikowanie grafiku zakończone sukcesem!");
              }}
              onClose={() => setModalIsOpenPublish(false)}
              week={getThisWeek()}
            />
          </div>
        </div>
      )}
      {loading && <LoadingSpinner />}
      <ActionStatusPopUp
        type={actionStatus?.type || "success"}
        msg={actionStatus?.msg || ""}
        isVisible={isPopUpVisible}
      />
    </div>
  );
};
export default ScheduleBar;