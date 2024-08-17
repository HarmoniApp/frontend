import React, { useEffect, useState } from 'react';
import styles from './main.module.scss';

interface EditEmployeeDataNotificationPopUpProps {
    onClose: () => void;
    onCloseEditData: () => void;
    firstName: string;
    surname: string;
    changedData: { [key: string]: string | number | object | undefined;};
}

const EditEmployeeDataNotificationPopUp:React.FC<EditEmployeeDataNotificationPopUpProps> = ({onClose, onCloseEditData, firstName, surname, changedData}) => {
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
            <h1>Edit Employee Data Conformation of {firstName} {surname}</h1>
            <h2>Zaktualizowano następujące pola:</h2>
            <h2>Updated Fields:</h2>
            <ul>
                {Object.keys(changedData).map((key) => (
                    <li key={key}>
                        {key}: {typeof changedData[key] === 'object' ? JSON.stringify(changedData[key]) : changedData[key]}
                    </li>
                ))}
            </ul>
            <p>Przekierowanie do danych pracownik za {modalCountdown} sekund</p><p>lub kliknij przycisk poniżej</p>
            <button onClick={() => { onClose(); onCloseEditData(); }}>Close</button>
        </div>
    )
}
export default EditEmployeeDataNotificationPopUp;