import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faCloudArrowDown, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import PublishConfirmation from './publishConfirmation';
import styles from './main.module.scss';

interface ScheduleBarProps {
  currentWeek: Date[];
  onNextWeek: () => void;
  onPreviousWeek: () => void;
  onPublishAll: () => void;
}

const ScheduleBar: React.FC<ScheduleBarProps> = ({ currentWeek, onNextWeek, onPreviousWeek, onPublishAll }) => {
  const [modalIsOpenPublish, setModalIsOpenPublish] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const downloadPdf = async () => {
    const startOfWeek = currentWeek[0].toISOString().split('T')[0];
    const endOfWeek = currentWeek[6].toISOString().split('T')[0];
    const response = await fetch(`http://localhost:8080/api/v1/archived-shifts/generate-pdf?startOfWeek=${startOfWeek}`);

    if (!response.ok) {
      console.error('Error downloading PDF');
      return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    const filename = `shifts_${startOfWeek} - ${endOfWeek}.pdf`;

    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const getThisWeek = () => {
    const startOfWeek = currentWeek[0].toISOString().split('T')[0].replace(/-/g, '.');
    const endOfWeek = currentWeek[6].toISOString().split('T')[0].replace(/-/g, '.');

    return `${startOfWeek} - ${endOfWeek}`;
  };

  const handleExport = (format: string) => {
    setDropdownVisible(false);
    if (format === 'pdf') {
      downloadPdf();
    } else if (format === 'excel') {
      console.log('Eksportuj do Excel');
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
              <button onClick={() => handleExport('excel')}>Eksportuj do Excel</button>
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
    </div>
  );
};

export default ScheduleBar;