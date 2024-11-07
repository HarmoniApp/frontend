'use client';
import React, { useState, useEffect } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import Absence from '@/components/types/absence';
import AbsenceRequest from '@/components/absence/employee/absenceRequest';
import CancelConfirmation from './cancelConfirmation';
import styles from './main.module.scss';

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
    const [modalIsOpenLoadning, setModalIsOpenLoadning] = useState(false);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        fetchUserAbsences();
    }, []);

    const fetchUserAbsences = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/absence/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                },
            });

            console.log('Otrzymano odpowiedź:', response);

            if (!response.ok) {
                setError(true);
                console.error('Błąd odpowiedzi HTTP:', response.status);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Dane pobrane:', data);

            const absences = data.content;
            setAbsences(absences);

            const typeNames: { [key: number]: string } = {};
            const typePromises = absences.map((absence: any) => {
                if (!(absence.absence_type_id in typeNames)) {
                    return fetchAbsenceTypeName(absence.absence_type_id).then((typeName) => {
                        typeNames[absence.absence_type_id] = typeName;
                    });
                }
                return Promise.resolve();
            });

            await Promise.all(typePromises);
            setAbsenceTypeNames(typeNames);
        } catch (error) {
            console.error('Error fetching user absences:', error);
        }
    };

    const fetchAbsenceTypeName = async (id: number): Promise<string> => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/absence-type/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
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

    const handleCancelAbsence = async () => {
        if (selectedAbsenceId === null) return;

        setModalIsOpenLoadning(true);
        try {
            const tokenJWT = sessionStorage.getItem('tokenJWT');
            const resquestXsrfToken = await fetch(`http://localhost:8080/api/v1/csrf`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenJWT}`,
                },
                credentials: 'include',
            });

            if (resquestXsrfToken.ok) {
                const data = await resquestXsrfToken.json();
                const tokenXSRF = data.token;

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/absence/${selectedAbsenceId}/status/3`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                        'X-XSRF-TOKEN': tokenXSRF,
                    },
                });
                if (!response.ok) {
                    console.error('Failed to cancel absence: ', response.statusText);
                    throw new Error(`Failed to cancel absence with ID ${selectedAbsenceId}`);
                }
                setModalIsOpenLoadning(false);
                fetchUserAbsences();
            } else {
                console.error('Failed to fetch XSRF token, response not OK');
            }
        } catch (error) {
            console.error(`Error canceling absence with ID ${selectedAbsenceId}:`, error);
            throw error;
        }
    };

    return (
        <div className={styles.absenceEmployeesContainerMain}>
            <div className={styles.absenceHeaderContainer}>
                <label className={styles.title}>Twoje urlopy</label>
                <button className={styles.newAbsenceButton} onClick={() => setModalIsOpenAbsenceRequest(true)}>Złóż wniosek o urlop</button>
            </div>

            {error ? (
                <div className={styles.error}>Wystąpił błąd podczas ładowania danych</div>
            ) : (
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
            )}

            {modalIsOpenAbsenceRequest && (
                <div className={styles.addAbsencetModalOverlay}>
                    <div className={styles.addAbsenceModalContent}>
                        <AbsenceRequest onSend={userId} onClose={() => setModalIsOpenAbsenceRequest(false)} onRefresh={fetchUserAbsences} />
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
                            absenceStartAndEnd={`${selectedAbsenceStart} - ${selectedAbsenceEnd}`}
                        />
                    </div>
                </div>
            )}

            {modalIsOpenLoadning && (
                <div className={styles.loadingModalOverlay}>
                    <div className={styles.loadingModalContent}>
                        <div className={styles.spinnerContainer}><ProgressSpinner /></div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default AbsenceEmployees;