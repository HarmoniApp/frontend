'use client';
import React, { useEffect, useState } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import Employer from './employer';
import styles from './main.module.scss';

const Settings = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [userId, setUserId] = useState<number>(0);

    useEffect(() => {
        const storedIsAdmin = sessionStorage.getItem('isAdmin');
        const storedUserId = sessionStorage.getItem('userId');

        if (storedIsAdmin !== null) {
            setIsAdmin(JSON.parse(storedIsAdmin));
        }
        if (storedUserId !== null) {
            setUserId(Number(storedUserId));
        }
    }, []);

    return (
        <div className={styles.settingsContainerMain}>
            {userId !== 0 ? (
                isAdmin ? <Employer /> : <></>
            ) : (
                <div className={styles.spinnerContainer}><ProgressSpinner /></div>
            )}
        </div>
    )
}
export default Settings;