'use client';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import styles from './main.module.scss';

interface AddNotificationProps {
    onClose: () => void;
    info: string;
}
// zielony modal
const AddNotification: React.FC<AddNotificationProps> = ({ onClose, info }) => {
    const [modalCountdown, setModalCountdown] = useState(10);

    useEffect(() => {
        const countdownInterval = setInterval(() => {
            setModalCountdown((prev) => {
                if (prev === 1) {
                    clearInterval(countdownInterval);
                    onClose();
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(countdownInterval);
    }, [onClose]);

    return (
        <div className={styles.addSettingsNotificationContainerMain}>
            <div className={styles.headerContainer}>
                <label className={styles.headerLabel}>Właśnie dodałeś:</label>
                <label className={styles.highlight}>{info}</label>
                <label className={styles.headerLabel}>!</label>
            </div>
            <div className={styles.counterContainter}>
                <p className={styles.counterParagraph}>Zamkniecie okna za:</p>
                <div className={styles.counterTimerContainer}>
                    <label className={styles.highlightTimeLabel}>{modalCountdown}</label>
                    <label className={styles.counterTimerLabel}>sekund.</label>
                </div>
            </div>
            <div className={styles.buttonConianer}>
                <button className={styles.closeButton} onClick={onClose}>
                    <FontAwesomeIcon className={styles.buttonIcon} icon={faCircleXmark} />
                    <p className={styles.buttonParagraph}>Zamknij</p>
                </button>
            </div>
        </div>
    );
};
export default AddNotification;