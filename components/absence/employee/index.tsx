'use client';
import React, { useState, useEffect } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import Absence from '@/components/types/absence';
import AbsenceRequest from '@/components/absence/employee/absenceRequest';
import CancelConfirmation from './cancelConfirmation';
import styles from './main.module.scss';
import { Message } from 'primereact/message';
import { fetchCsrfToken } from '@/services/csrfService';

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
    const [error, setError] = useState<string | null>(null);
    const [availableAbsenceDays, setAvailableAbsenceDays] = useState<number | string>('Ładowanie...');

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
            const data = await response.json();

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
            setError('Error fetching user absences');
        } finally {
            setLoading(false);
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

            const data = await response.json();
            return data.name;
        } catch (error) {
            console.error(`Error fetching absence type name for ID ${id}:`, error);
            setError('Error fetching absence type name');
            return 'Unknown';
        } finally {
            setLoading(false)
        }
    };

    const handleCancelAbsence = async () => {
        if (selectedAbsenceId === null) return;

        setLoading(true);
        try {
            const tokenXSRF = await fetchCsrfToken(setError);

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/absence/${selectedAbsenceId}/status/3`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                        'X-XSRF-TOKEN': tokenXSRF,
                    },
                    credentials: 'include',
                });
                if (!response.ok) {
                    console.error('Failed to cancel absence: ', response.statusText);
                    throw new Error(`Failed to cancel absence with ID ${selectedAbsenceId}`);
                }
                setLoading(false);
                fetchUserAbsences();
        } catch (error) {
            console.error(`Error canceling absence with ID ${selectedAbsenceId}:`, error);
            setError('Error canceling absence');
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableAbsenceDays = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/${userId}/availableAbsenceDays`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                },
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Error fetching absence available days for ID ${userId}:`, error);
            setError('Error fetching absence available days');
            return 'Unknown';
        }
    };

    useEffect(() => {
        const loadAvailableAbsenceDays = async () => {
            const days = await fetchAvailableAbsenceDays();
            setAvailableAbsenceDays(days);
        };

        loadAvailableAbsenceDays();
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
                <div className={styles.addAbsencetModalOverlay}>
                    <div className={styles.addAbsenceModalContent}>
                        <AbsenceRequest onSend={userId} onClose={() => setModalIsOpenAbsenceRequest(false)} onRefresh={fetchUserAbsences} />
                    </div>
                </div>
            )}
            {error && <Message severity="error" text={`Error: ${error}`} className={styles.errorMessageComponent} />}
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
            {loading && (
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