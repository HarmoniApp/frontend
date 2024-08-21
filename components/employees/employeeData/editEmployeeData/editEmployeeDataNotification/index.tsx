import React, { useEffect, useState } from 'react';
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
        <div className={styles.editEmployeeDataNotificationPopUpContainerMain}>
            <div className={styles.questionContainer}>
                <p className={styles.questionParagraph}>Zaktualizowano następujące pola w użytkowniku:</p>
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
                <p className={styles.textParagraph}>Przekierowanie do danych pracownika za:</p>
                <div className={styles.counterTimer}>
                    <span className={styles.highlight}>{modalCountdown}</span>
                    <p className={styles.counterParagraph}>sekund.</p>
                </div>

            </div>
            <div className={styles.buttonConianer}>
                <button className={styles.backButton }onClick={() => { onClose(); onCloseEditData(); }}>Zamknij</button>
            </div>
        </div>
    )
}
export default EditEmployeeDataNotificationPopUp;