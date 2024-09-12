import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import styles from './main.module.scss';

interface EditEmployeeDataNotificationPopUpProps {
    onClose: () => void;
    onCloseEditData: () => void;
    changedData: any;
}

const EditEmployeeDataNotificationPopUp: React.FC<EditEmployeeDataNotificationPopUpProps> = ({ onClose, onCloseEditData, changedData }) => {
    const [modalCountdown, setModalCountdown] = useState(10);
    useEffect(() => {
        const countdownInterval = setInterval(() => {
            setModalCountdown(prev => {
                if (prev === 1) {
                    clearInterval(countdownInterval);
                    onCloseEditData();
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(countdownInterval);
    }, []);
    return (
        <div className={styles.editEmployeeDataNotificationContainerMain}>
            <div className={styles.headerContainer}>
                <p className={styles.headerParagraph}>Zaktualizowano następujące pola w użytkowniku:</p>
            </div>
            <div className={styles.changedDataContainer}>
                <ul className={styles.changedDataList}>
                    {Object.keys(changedData).map((key) => {
                        const displayKey = key
                            .replace(/([A-Z])/g, ' $1')
                            .replace(/_/g, ' ')
                            .replace(/^./, str => str.toUpperCase());

                        const displayValue = typeof changedData[key] === 'string'
                            ? (changedData[key] as string).toUpperCase()
                            : changedData[key];

                        return (
                            <li key={key} className={styles.changedDataItem}>
                                <span className={styles.changedDataKey}>{displayKey}:</span>
                                <span className={styles.changedDataValue}>{displayValue}</span>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className={styles.timerContainer}>
                <p className={styles.timerParagraph}>Przekierowanie do danych pracownika za:</p>
                <div className={styles.counterTimerContainer}>
                    <span className={styles.highlight}>{modalCountdown}</span>
                    <p className={styles.counterTimerParagraph}>sekund.</p>
                </div>

            </div>
            <div className={styles.buttonConianer}>

                <button className={styles.closeButton} onClick={() => { onClose(); onCloseEditData(); }}>
                    <FontAwesomeIcon className={styles.buttonIcon} icon={faCircleXmark} />
                    <p className={styles.buttonParagraph}>Zamknij</p>
                </button>
            </div>
        </div>
    )
}
export default EditEmployeeDataNotificationPopUp;