'use client';
import React, { useState, useEffect } from 'react';
import Absence from '@/components/types/absence';
import AbsenceRequest from '@/components/absence/employee/absenceRequest';
import CancelConfirmation from './popUps/cancelConfirmation';
import ArchiveConfirmation from './popUps/archiveConfirmation';
import styles from './main.module.scss';

interface AbsenceEmployeesProps {
    userId: number;
}

const AbsenceEmployees: React.FC<AbsenceEmployeesProps> = ({ userId }) => {
    const [modalIsOpenAbsenceRequest, setModalIsOpenAbsenceRequest] = useState(false);
    const [modalIsOpenCancelAbsence, setModalIsOpenCancelAbsence] = useState(false);
    const [modalIsOpenArchiveAbsence, setModalIsOpenArchiveAbsence] = useState(false);
    const [absences, setAbsences] = useState<Absence[]>([]);
    const [absenceTypeNames, setAbsenceTypeNames] = useState<{ [key: number]: string }>({});
    const [selectedAbsenceId, setSelectedAbsenceId] = useState<number | null>(null);
    const [selectedAbsenceType, setSelectedAbsenceType] = useState<string>('');
    const [selectedAbsenceStart, setSelectedAbsenceStart] = useState<string>('');
    const [selectedAbsenceEnd, setSelectedAbsenceEnd] = useState<string>('');

    useEffect(() => {
        fetchUserAbsences();
    }, []);

    const fetchUserAbsences = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/absence/user/${userId}/archived?archived=false`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data: Absence[] = await response.json();
            setAbsences(data);

            const typeNames: { [key: number]: string } = {};
            for (const absence of data) {
                if (!(absence.absence_type_id in typeNames)) {
                    const typeName = await fetchAbsenceTypeName(absence.absence_type_id);
                    typeNames[absence.absence_type_id] = typeName;
                }
            }
            setAbsenceTypeNames(typeNames);
        } catch (error) {
            console.error('Error fetching user absences:', error);
        }
    };

    const fetchAbsenceTypeName = async (id: number): Promise<string> => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/absence-type/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            return data.name;
        } catch (error) {
            console.error(`Error fetching absence type name for ID ${id}:`, error);
            return 'Unknown';
        }
    };

    const handleArchiveAbsence = async () => {
        if (selectedAbsenceId === null) return;

        try {
            const response = await fetch(`http://localhost:8080/api/v1/absence/archive/${selectedAbsenceId}?archived=true`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            fetchUserAbsences();
        } catch (error) {
            console.error(`Error archiving absence with ID ${selectedAbsenceId}:`, error);
        }
    };

    const handleCancelAbsence = async () => {
        if (selectedAbsenceId === null) return;

        try {
            const response = await fetch(`http://localhost:8080/api/v1/absence/${selectedAbsenceId}/status/3`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            fetchUserAbsences();
        } catch (error) {
            console.error(`Error canceling absence with ID ${selectedAbsenceId}:`, error);
        }
    };

    return (
        <div className={styles.absenceEmployeesContainerMain}>
            <div className={styles.absenceHeaderContainer}>
                <label className={styles.title}>Twoje urlopy</label>
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
                                <td className={styles.absenceDataBodyHeadElement}>{absenceTypeNames[absence.absence_type_id] || 'Ładowanie...'}</td>
                                <td className={styles.absenceDataBodyHeadElement}>{new Date(absence.start).toLocaleDateString()}</td>
                                <td className={styles.absenceDataBodyHeadElement}>{new Date(absence.end).toLocaleDateString()}</td>
                                <td className={`${styles.absenceDataBodyHeadElement} ${styles.afterElement}`}>{absence.working_days}</td>
                                <td className={styles.absenceDataBodyHeadElement}>{absence.status.name}</td>
                                <td className={`${styles.absenceDataBodyHeadElement} ${styles.absenceDataBodyHeadElementButton}`}>
                                    {absence.status.name === 'awaiting' ? (
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
                                    ) : (
                                        <button
                                            className={styles.archiveButton}
                                            onClick={() => {
                                                setSelectedAbsenceId(absence.id);
                                                setSelectedAbsenceType(absenceTypeNames[absence.absence_type_id]);
                                                setSelectedAbsenceStart(new Date(absence.start).toLocaleDateString());
                                                setSelectedAbsenceEnd(new Date(absence.end).toLocaleDateString());
                                                setModalIsOpenArchiveAbsence(true);
                                            }}
                                        >
                                            Archiwizuj
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modalIsOpenAbsenceRequest && (
                <div className={styles.addAbsencetModalOverlay}>
                    <div className={styles.addAbsenceModalContent}>
                        <AbsenceRequest onSend={userId} onClose={() => setModalIsOpenAbsenceRequest(false)} />
                    </div>
                </div>
            )}

            {modalIsOpenCancelAbsence && (
                <div className={styles.addAbsencetModalOverlay}>
                    <div className={styles.addAbsenceModalContent}>
                        <CancelConfirmation
                            onCancel={handleCancelAbsence}
                            onClose={() => setModalIsOpenCancelAbsence(false)}
                            absenceType={selectedAbsenceType}
                            absenceStartAndEnd={selectedAbsenceStart + ' - ' + selectedAbsenceEnd}
                        />
                    </div>
                </div>
            )}

            {modalIsOpenArchiveAbsence && (
                <div className={styles.addAbsencetModalOverlay}>
                    <div className={styles.addAbsenceModalContent}>
                        <ArchiveConfirmation
                            onArchive={handleArchiveAbsence}
                            onClose={() => setModalIsOpenArchiveAbsence(false)}
                            absenceType={selectedAbsenceType}
                            absenceStartAndEnd={selectedAbsenceStart + ' - ' + selectedAbsenceEnd}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
export default AbsenceEmployees;