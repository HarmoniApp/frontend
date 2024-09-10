'use client';
import React, { useState, useEffect } from 'react';
import styles from './main.module.scss';

interface AddNotificationProps {
    onClose: () => void;
    info: string;
}

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
        <div className={styles.addNotificationContainerMain}>
            <div className="add-confirmation__content">
                <h2 className="add-confirmation__title">ADD Information</h2>
                <p className="add-confirmation__text">Własnie dodales: {info}</p>
                <p className="add-confirmation__text">Zamkniecie okna za: {modalCountdown}</p>
                <div className="add-confirmation__buttons">
                    <button className="add-confirmation__button" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default AddNotification;