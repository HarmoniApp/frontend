'use client';
import React, { useState, useEffect } from 'react';
import Absence from '@/components/types/absence';
import AbsenceRequest from '@/components/absence/employee/absenceRequest';
import CancelConfirmation from './cancelConfirmation';
import styles from './main.module.scss';
import { deleteAbsence, fetchAvailableAbsenceDays, fetchUserAbsences } from '@/services/absenceService';
import LoadingSpinner from '@/components/loadingSpinner';

interface AbsenceEmployeesProps {
    userId: number;
}

const AbsenceEmployees: React.FC<AbsenceEmployeesProps> = ({ userId }) => {
    const [modalIsOpenAbsenceRequest, setModalIsOpenAbsenceRequest] = useState(false);
    const [modalIsOpenCancelAbsence, setModalIsOpenCancelAbsence] = useState(false);
    const [absences, setAbsences] = useState<Absence[]>([]);
    const [absenceTypeNames, setAbsenceTypeNames] = useState<{ [key: number]: string }>({});
    const [selectedAbsenceId, setSelectedAbsenceId] = useState<number | null>(null);
    const [selectedAbsenceType, setSelectedAbsenceType] = useState<string>('');
    const [selectedAbsenceStart, setSelectedAbsenceStart] = useState<string>('');
    const [selectedAbsenceEnd, setSelectedAbsenceEnd] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [availableAbsenceDays, setAvailableAbsenceDays] = useState<number | string>('Ładowanie...');

    useEffect(() => {
        fetchUserAbsences(userId, setAbsenceTypeNames, setAbsences);
    }, []);

    const handleCancelAbsence = async () => {
        if (selectedAbsenceId === null) return;

        await deleteAbsence(selectedAbsenceId, userId, setAbsenceTypeNames, setAbsences)
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchAvailableAbsenceDays(userId, setAvailableAbsenceDays)
        };

        fetchData();
    }, []);

    return (
        <div className={styles.absenceEmployeesContainerMain}>
            <div className={styles.absenceHeaderContainer}>
                <label className={styles.title}>Twoje urlopy</label>
                <label className={styles.subtitle}>Ilość dostepnych dni urlopowych: {availableAbsenceDays}</label>
                <button className={styles.newAbsenceButton} onClick={() => setModalIsOpenAbsenceRequest(true)}>Złóż wniosek o urlop</button>
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
                        {absences.map((absence) => (
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
                                    <button
                                        className={styles.cancelButton}
                                        onClick={() => {
                                            setSelectedAbsenceId(absence.id);
                                            setSelectedAbsenceType(absenceTypeNames[absence.absence_type_id]);
                                            setSelectedAbsenceStart(new Date(absence.start).toLocaleDateString());
                                            setSelectedAbsenceEnd(new Date(absence.end).toLocaleDateString());
                                            setModalIsOpenCancelAbsence(true);
                                        }}
                                    >
                                        Anuluj
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {modalIsOpenAbsenceRequest && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <AbsenceRequest onSend={userId} onClose={() => setModalIsOpenAbsenceRequest(false)} onRefresh={() => fetchUserAbsences(userId, setAbsenceTypeNames, setAbsences)} />
                    </div>
                </div>
            )}
            {modalIsOpenCancelAbsence && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <CancelConfirmation
                            onCancel={handleCancelAbsence}
                            onClose={() => setModalIsOpenCancelAbsence(false)}
                            absenceType={selectedAbsenceType}
                            absenceStartAndEnd={`${selectedAbsenceStart} - ${selectedAbsenceEnd}`}
                        />
                    </div>
                </div>
            )}
            {loading && ( 
                <LoadingSpinner />
                // <div className={styles.loadingModalOverlay}>
                //     <div className={styles.loadingModalContent}>
                //         <div className={styles.spinnerContainer}><ProgressSpinner /></div>
                //     </div>
                // </div>
            )}
        </div>
    );
};
export default AbsenceEmployees;