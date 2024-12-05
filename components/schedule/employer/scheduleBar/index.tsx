import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faCloudArrowDown, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import PublishConfirmation from './publishConfirmation';
import { ProgressSpinner } from 'primereact/progressspinner';
import styles from './main.module.scss';
import { downloadSchedulePdf } from '@/services/pdfService';
import { downloadScheduleXLSX } from '@/services/xlsxService';

interface ScheduleBarProps {
  currentWeek: Date[];
  onNextWeek: () => void;
  onPreviousWeek: () => void;
  onPublishAll: () => void;
  setError: (errorMessage: string | null) => void;
}

const ScheduleBar: React.FC<ScheduleBarProps> = ({ currentWeek, onNextWeek, onPreviousWeek, onPublishAll, setError }) => {
  const [modalIsOpenPublish, setModalIsOpenPublish] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(false);

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

    if (!confirmDownload) {
      return;
    }

    if (format === 'pdf') {
      await downloadSchedulePdf(currentWeek, setLoading);
    } else if (format === 'xlsx') {
      await downloadScheduleXLSX(currentWeek, setLoading);
    }
  };

  return (
    <div className={styles.scheduleBarContainerMain}>
      <div className={styles.buttonContainer}>
        <button className={styles.publishButton} onClick={() => setModalIsOpenPublish(true)}>
          <FontAwesomeIcon className={styles.buttonIcon} icon={faCalendarCheck} />Opublikuj
        </button>

        <div className={styles.exportDropdownContainer}>
          <button
            className={styles.exportButton}
            onClick={() => setDropdownVisible(prev => !prev)}
          >
            <FontAwesomeIcon className={styles.buttonIcon} icon={faCloudArrowDown} />Exportuj
          </button>

          {dropdownVisible && (
            <div className={styles.exportDropdownMenu}>
              <button onClick={() => handleExport('pdf')}>Eksportuj do PDF</button>
              <button onClick={() => handleExport('xlsx')}>Eksportuj do Excel</button>
            </div>
          )}
        </div>
      </div>
      <div className={styles.weekSwitcher}>
        <button className={styles.changeWeekButton} onClick={onPreviousWeek}>
          <FontAwesomeIcon className={styles.buttonIcon} icon={faChevronLeft} />
        </button>
        <div className={styles.dateRange}>
          <p className={styles.dateRangeParagraph}>
            {currentWeek[0].toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </p>
          <p className={styles.dateRangeParagraph}>-</p>
          <p className={styles.dateRangeParagraph}>
            {currentWeek[6].toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </p>
        </div>
        <button className={styles.changeWeekButton} onClick={onNextWeek}>
          <FontAwesomeIcon className={styles.buttonIcon} icon={faChevronRight} />
        </button>
      </div>

      {modalIsOpenPublish && (
        <div className={styles.publishModalOverlay}>
          <div className={styles.publishModalContent}>
            <PublishConfirmation
              onPublish={onPublishAll}
              onClose={() => setModalIsOpenPublish(false)}
              week={getThisWeek()}
            />
          </div>
        </div>
      )}

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

export default ScheduleBar;