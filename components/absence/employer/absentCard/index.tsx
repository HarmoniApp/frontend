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
    languages: {
        id: number;
        name: string;
    }[];
}

const AbsenceCardEmployer: React.FC = () => {
    const [absences, setAbsences] = useState<Absence[]>([]);
    const [absenceTypes, setAbsenceTypes] = useState<{ [key: number]: AbsenceType }>({});
    const [users, setUsers] = useState<{ [key: number]: User }>({});

    useEffect(() => {
        fetch('http://localhost:8080/api/v1/absence')
            .then(response => response.json())
            .then(async (data: Absence[]) => {
                setAbsences(data);

                const absenceTypeRequests = data.map(absence =>
                    fetch(`http://localhost:8080/api/v1/absence-type/${absence.absence_type_id}`)
                        .then(response => response.json())
                );

                const userRequests = data.map(absence =>
                    fetch(`http://localhost:8080/api/v1/user/simple/${absence.user_id}`)
                        .then(response => response.json())
                );

                const fetchedAbsenceTypes = await Promise.all(absenceTypeRequests);
                const fetchedUsers = await Promise.all(userRequests);

                const absenceTypesMap = fetchedAbsenceTypes.reduce((acc, absenceType) => {
                    acc[absenceType.id] = absenceType;
                    return acc;
                }, {} as { [key: number]: AbsenceType });

                const usersMap = fetchedUsers.reduce((acc, user) => {
                    acc[user.id] = user;
                    return acc;
                }, {} as { [key: number]: User });

                setAbsenceTypes(absenceTypesMap);
                setUsers(usersMap);
            })
            .catch(error => console.error('Error fetching absences:', error));
    }, []);

    return (
        <div>
            {absences.map(absence => (
                <div key={absence.id} className={styles.absenceCard}>
                    <h3>{absenceTypes[absence.absence_type_id]?.name}</h3>
                    <p>{new Date(absence.submission).toLocaleDateString()}</p>
                    <p>ID: #{absence.id}</p>
                    <p>Imię: {users[absence.user_id]?.firstname}</p>
                    <p>Nazwisko: {users[absence.user_id]?.surname}</p>
                    <p>Dostępne dni: 20</p> {/* This should be dynamic, miss in database */}
                    <p>Od: {new Date(absence.start).toLocaleDateString()}</p>
                    <p>Do: {new Date(absence.end).toLocaleDateString()}</p>
                    <p>Liczba dni: {Math.ceil((new Date(absence.end).getTime() - new Date(absence.start).getTime()) / (1000 * 3600 * 24))}</p>
                    <p>Status: {absence.status.name}</p>
                    <button className={styles.acceptButton}>Akceptuj</button>
                    <button className={styles.declineButton}>Odmów</button>
                </div>
            ))}
        </div>
    );
}

export default AbsenceCardEmployer;