'use client';
import React, { useState } from 'react';
import Employee from './employee';
import Employer from './employer';
import { loggedUserRoleAdmin, loggedUserID } from '@/components/variables';
import styles from './main.module.scss';

const Absence = () => {
    const [isAdmin] = useState<boolean>(loggedUserRoleAdmin);

    return (
        <div className={styles.absenceContainerMain}>
            {isAdmin ? <Employer /> : <Employee userId={loggedUserID}/>}
        </div>
    )
}
export default Absence;