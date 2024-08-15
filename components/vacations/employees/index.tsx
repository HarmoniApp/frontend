import React, { useState } from 'react';
import styles from './main.module.scss';
import VacRequest from '@/components/vacations/employees/vacRequest';
import Modal from 'react-modal';

const VacationsEmployees = () => {
    const [modalIsOpenVacRequest, setModalIsOpenVacRequest] = useState(false);
    const openModalVacRequest = () => setModalIsOpenVacRequest(true);
    const closeModalVacRequest = () => setModalIsOpenVacRequest(false);

    /**
     * Miss login to distinguish which employee is logged in
     * Implement endpoint fetch when it's empLogin ready
     */

    return (
        <div>
            <h1>EmployeesVacations</h1>
            <button onClick={openModalVacRequest}>Złóż wniosek o urlop</button>
            <Modal
                isOpen={modalIsOpenVacRequest}
                // If we click outside the popUp area it will close (onRequestClose)
                // onRequestClose={closeModalVacRequest}
                contentLabel="Vacations Employees Request"
                className={styles.modalContent}
                overlayClassName={styles.modalOverlay}
            >
                <VacRequest />
                <button onClick={closeModalVacRequest}>Zamknij</button>
            </Modal>
        </div>
    )
}
export default VacationsEmployees