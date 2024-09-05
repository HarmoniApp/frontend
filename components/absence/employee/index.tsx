'use client';
import React, { useState, useEffect } from 'react';
import Absence from '@/components/types/absence';
import AbsenceRequest from '@/components/absence/employee/absenceRequest';
import styles from './main.module.scss';

interface AbsenceEmployeesProps {
    userId: number;
}

const AbsenceEmployees: React.FC<AbsenceEmployeesProps> = ({ userId }) => {
    const [modalIsOpenAbsenceRequest, setModalIsOpenAbsenceRequest] = useState(false);
    const openModalAbsenceRequest = () => setModalIsOpenAbsenceRequest(true);
    const closeModalAbsenceRequest = () => setModalIsOpenAbsenceRequest(false);
    const [absences, setAbsences] = useState<Absence[]>([]);
    const [absenceTypeNames, setAbsenceTypeNames] = useState<{ [key: number]: string }>({});

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

    const handleArchiveAbsence = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/absence/archive/${id}?archived=true`, {
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
            console.error(`Error archiving absence with ID ${id}:`, error);
        }
    };

    return (
        <div className={styles.absenceEmployeesContainerMain}>
            <div className={styles.absenceHeaderContainer}>
                <label className={styles.title}>Twoje urlopy</label>
                <button className={styles.newAbsenceButton} onClick={openModalAbsenceRequest}>Złóż wniosek o urlop</button>
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
                            <th className={styles.absenceTheadHeadElement}>Archiwizuj</th>
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
                                    <button className={styles.archiveButton} onClick={() => handleArchiveAbsence(absence.id)}>
                                        Tak
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modalIsOpenAbsenceRequest && (
                <div className={styles.addAbsencetModalOverlay}>
                    <div className={styles.addAbsenceModalContent}>
                        <AbsenceRequest onSend={userId} onClose={closeModalAbsenceRequest} />
                    </div>
                </div>
            )}
        </div>
    );
}
export default AbsenceEmployees;