'use client';
import React, { useState, useEffect } from 'react';
import Employee from './employee';
import Employer from './employer';
import styles from './main.module.scss';

const Absence = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [userId, setUserId] = useState<number>(0);

    useEffect(() => {
        const storedIsAdmin = localStorage.getItem('isAdmin');
        const storedUserId = localStorage.getItem('userId');

        if (storedIsAdmin !== null) {
            setIsAdmin(JSON.parse(storedIsAdmin));
        }
        if (storedUserId !== null) {
            setUserId(Number(storedUserId));
        }
    }, []);

    return (
        <div className={styles.absenceContainerMain}>
            {isAdmin ? <Employer /> : <Employee userId={userId}/>}
        </div>
    )
}
export default Absence;