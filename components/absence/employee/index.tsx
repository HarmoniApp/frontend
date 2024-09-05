import React, { useState } from 'react';
import styles from './main.module.scss';
import AbsenceRequest from '@/components/absence/employee/absenceRequest';
import Modal from 'react-modal';

const AbsenceEmployees = () => {
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
            <Modal
                isOpen={modalIsOpenAbsenceRequest}
                // If we click outside the popUp area it will close (onRequestClose)
                // onRequestClose={closeModalAbsenceRequest}
                contentLabel="Vacations Employees Request"
                className={styles.modalContent}
                overlayClassName={styles.modalOverlay}
            >
                <AbsenceRequest />
                <button onClick={closeModalAbsenceRequest}>Zamknij</button>
            </Modal>
        </div>
    )
}
export default AbsenceEmployees