'use client';
import React, { useState, useEffect } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import Employee from './employee';
import Employer from './employer';
import styles from './main.module.scss';

const Absence = () => {
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
        // <div className={styles.absenceContainerMain}>
        //  {isAdmin ? <Employer /> : <Employee userId={userId}/>}
        // </div>
            <div className={styles.absenceContainerMain}>
                {userId !== 0 ? (
                    isAdmin ? <Employer /> : <Employee userId={userId} />
                ) : (
                    <div className={styles.spinnerContainer}><ProgressSpinner /></div>
                )}
            </div>
    )
}
export default Absence;