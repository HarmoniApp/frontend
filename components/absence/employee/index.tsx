'use client';
import React, { useState } from 'react';
import styles from './main.module.scss';
import AbsenceRequest from '@/components/absence/employee/absenceRequest';

interface AbsenceEmployeesProps {
    userId: number;
}

const AbsenceEmployees:React.FC<AbsenceEmployeesProps> = ({userId}) => {
    const [modalIsOpenAbsenceRequest, setModalIsOpenAbsenceRequest] = useState(false);
    const openModalAbsenceRequest = () => setModalIsOpenAbsenceRequest(true);
    const closeModalAbsenceRequest = () => setModalIsOpenAbsenceRequest(false);

    /**
     * Miss login to distinguish which employee is logged in
     * Implement endpoint fetch when it's empLogin ready
     */

    return (
        <div>
            <h1>EmployeesVacations</h1>
            <button onClick={openModalAbsenceRequest}>Złóż wniosek o urlop</button>

            {modalIsOpenAbsenceRequest && (
                <div className={styles.addAbsencetModalOverlay}>
                    <div className={styles.addAbsenceModalContent}>
                        <AbsenceRequest onSend={userId} onClose={closeModalAbsenceRequest}/>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AbsenceEmployees;