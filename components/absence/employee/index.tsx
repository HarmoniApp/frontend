'use client';
import React, { useState } from 'react';
import styles from './main.module.scss';
import LoadingSpinner from '@/components/loadingSpinner';
import CustomButton from '@/components/customButton';
import ConfirmationPopUp from '@/components/confirmationPopUp';
import { Card } from 'primereact/card';
import { AbsenceEmployeesRequestForm } from './absenceRequestForm';
import { useAbsenceEmployeeManagment } from '@/hooks/absences/useAbsenceEmployeeManagment';

interface AbsenceEmployeesProps {
    userId: number;
}

const AbsenceEmployees: React.FC<AbsenceEmployeesProps> = ({ userId }) => {
    const [modalIsOpenAbsenceRequest, setModalIsOpenAbsenceRequest] = useState(false);

    const {
        absences,
        absenceTypeNames,
        setSelectedAbsenceId,
        selectedAbsenceType,
        setSelectedAbsenceType,
        selectedAbsenceStart,
        setSelectedAbsenceStart,
        selectedAbsenceEnd,
        setSelectedAbsenceEnd,
        loading,
        availableAbsenceDays,
        fetchData,
        handleCancelAbsence,
        modalIsOpenCancelAbsence,
        setModalIsOpenCancelAbsence
    } = useAbsenceEmployeeManagment();

    return (
        <div className={styles.absenceEmployeesContainerMain}>
            <div className={styles.absenceHeaderContainer}>
                <label className={styles.title}>Twoje urlopy</label>
                <label className={styles.subtitle}>Ilość dostepnych dni urlopowych: {availableAbsenceDays}</label>
                <CustomButton icon="calendarPlus" writing="Złóż wniosek o urlop" action={() => { setModalIsOpenAbsenceRequest(true) }} />
            </div>
            <div className={styles.tableContainer}>
                <table className={styles.absenceTable}>
                    <thead className={styles.absenceThead}>
                        <tr className={styles.absenceTheadRowElement}>
                            <th className={styles.absenceTheadHeadElement}>Rodzaj</th>
                            <th className={styles.absenceTheadHeadElement}>Od</th>
                            <th className={styles.absenceTheadHeadElement}>Do</th>
                            <th className={styles.absenceTheadHeadElement}>Czas trwania</th>
                            <th className={styles.absenceTheadHeadElement}>Status</th>
                            <th className={styles.absenceTheadHeadElement}></th>
                        </tr>
                    </thead>
                    <tbody className={styles.absenceDataBody}>
                        {absences.length === 0 ? (
                            <Card title="Brak złożonych wniosków" className={styles.noDataCard}></Card>
                        ) : (
                            absences.map((absence) => (
                                <tr key={absence.id} className={styles.absenceDataBodyRowElement}>
                                    <td className={styles.absenceDataBodyHeadElement}>
                                        {absenceTypeNames[absence.absence_type_id] || 'Ładowanie...'}
                                    </td>
                                    <td className={styles.absenceDataBodyHeadElement}>
                                        {new Date(absence.start).toLocaleDateString()}
                                    </td>
                                    <td className={styles.absenceDataBodyHeadElement}>
                                        {new Date(absence.end).toLocaleDateString()}
                                    </td>
                                    <td className={`${styles.absenceDataBodyHeadElement} ${styles.afterElement}`}>
                                        {absence.working_days}
                                    </td>
                                    <td className={styles.absenceDataBodyHeadElement}>
                                        {absence.status.name}
                                    </td>
                                    <td className={`${styles.absenceDataBodyHeadElement} ${styles.absenceDataBodyHeadElementButton}`}>
                                        <CustomButton icon="calendarMinus" writing="Anuluj" action={() => {
                                            setSelectedAbsenceId(absence.id);
                                            setSelectedAbsenceType(absenceTypeNames[absence.absence_type_id]);
                                            setSelectedAbsenceStart(new Date(absence.start).toLocaleDateString());
                                            setSelectedAbsenceEnd(new Date(absence.end).toLocaleDateString());
                                            setModalIsOpenCancelAbsence(true);
                                        }} />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {modalIsOpenAbsenceRequest && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <AbsenceEmployeesRequestForm
                            onSend={userId}
                            onClose={() => setModalIsOpenAbsenceRequest(false)}
                            onRefresh={fetchData}
                        />
                    </div>
                </div>
            )}
            {modalIsOpenCancelAbsence && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <ConfirmationPopUp action={handleCancelAbsence} onClose={() => setModalIsOpenCancelAbsence(false)} description={`Anulować ten wniosek o urlop: ${selectedAbsenceType} ${selectedAbsenceStart} - ${selectedAbsenceEnd}`} />
                    </div>
                </div>
            )}
            {loading && <LoadingSpinner />}
        </div>
    );
};
export default AbsenceEmployees;