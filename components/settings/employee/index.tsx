'use client';
import React, { useState, useEffect } from 'react';
import Absence from '@/components/types/absence';
import styles from './main.module.scss';

interface SettingsEmployeeProps {
    userId: number;
}

const SettingsEmployee: React.FC<SettingsEmployeeProps> = ({ userId }) => {
    const [absences, setAbsences] = useState<Absence[]>([]);
    const [absenceTypeNames, setAbsenceTypeNames] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        fetchUserAbsences();
    }, []);

    const fetchUserAbsences = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/absence/user/${userId}/archived?archived=true`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
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

    return (
        <div className={styles.absenceEmployeesContainerMain}>
            <p>Tu bedzie cos ale jeszcze nie wiem co bedzie wydaje mi sie ze nie bedzie nic</p>
            {/* <div className={styles.absenceHeaderContainer}>
                <label className={styles.title}>Twoje archiwalne urlopy</label>
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div> */}
        </div>
    );
}
export default SettingsEmployee;