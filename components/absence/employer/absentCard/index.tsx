import React, { useEffect, useState } from 'react';
import styles from './main.module.scss';

interface Absence {
    id: number;
    start: string;
    end: string;
    status: {
        id: number;
        name: string;
    };
    submission: string;
    updated: string;
    user_id: number;
    absence_type_id: number;
}

interface AbsenceType {
    id: number;
    name: string;
}

interface User {
    id: number;
    firstname: string;
    surname: string;
}

interface AbsenceCardProps {
    absence: Absence;
}

const AbsenceCardEmployer: React.FC<AbsenceCardProps> = ({ absence }) => {
    /**
     * Buttons aproving or declining absence is missing functionality because of schema lack of API endpoint.
     */
    const [absenceType, setAbsenceType] = useState<AbsenceType | null>(null);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        fetch(`http://localhost:8080/api/v1/absence-type/${absence.absence_type_id}`)
            .then(response => response.json())
            .then(data => setAbsenceType(data))
            .catch(error => console.error('Error fetching absence type:', error));

        fetch(`http://localhost:8080/api/v1/user/simple/${absence.user_id}`)
            .then(response => response.json())
            .then(data => setUser(data))
            .catch(error => console.error('Error fetching user:', error));
    }, [absence.absence_type_id, absence.user_id]);

    return (
        <div>

            <div className={styles.absenceCard}>
                <h3>{absenceType?.name}</h3>
                <p>{new Date(absence.submission).toLocaleDateString()}</p>
                <p>ID: #{absence.id}</p>
                <p>Imię: {user?.firstname}</p>
                <p>Nazwisko: {user?.surname}</p>
                <p>Dostępne dni: 20</p> {/* This should be dynamic, miss in database */}
                <p>Od: {new Date(absence.start).toLocaleDateString()}</p>
                <p>Do: {new Date(absence.end).toLocaleDateString()}</p>
                <p>Liczba dni: {Math.ceil((new Date(absence.end).getTime() - new Date(absence.start).getTime()) / (1000 * 3600 * 24))}</p> {/* These are all days even including weekends and should only be working days. */}
                <p>Status: {absence.status.name}</p>
                <button className={styles.acceptButton}>Akceptuj</button>
                <button className={styles.declineButton}>Odmów</button>
            </div>

        </div>
    );
}

export default AbsenceCardEmployer;