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
        <div>
            <h2>Zaktualizowano następujące pola w uzytkowniku:</h2>
            <h2>Updated Fields:</h2>
            <ul>
                {Object.keys(changedData).map((key) => {
                    const displayKey = key
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/_/g, ' ')
                        .replace(/^./, str => str.toUpperCase());

                    const displayValue = typeof changedData[key] === 'string'
                        ? (changedData[key] as string).toUpperCase()
                        : changedData[key];

                    return (
                        <li key={key}>
                            {displayKey}: {displayValue}
                        </li>
                    );
                })}
            </ul>

            <p>Przekierowanie do danych pracownik za {modalCountdown} sekund</p><p>lub kliknij przycisk poniżej</p>
            <button onClick={() => { onClose(); onCloseEditData(); }}>Close</button>
        </div>
    )
}
export default EditEmployeeDataNotificationPopUp;