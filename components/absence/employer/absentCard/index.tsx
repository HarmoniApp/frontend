import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
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

    const subbmisionDate = () => {
        return new Date(absence.submission).toLocaleDateString();
    }

    const startDate = () => {
        return new Date(absence.start).toLocaleDateString();
    }

    const endDate = () => {
        return new Date(absence.end).toLocaleDateString();
    }

    const quantityDays = () => {
        return Math.ceil((new Date(absence.end).getTime() - new Date(absence.start).getTime()) / (1000 * 3600 * 24));
    }

    return (
        <div className={styles.absenceCardContainerMain}>
            <div className={styles.headerCardContainer}>
                <p className={styles.absenceTypeNameParagraph}>{absenceType?.name}</p>
                <p className={styles.subbmisionDateParagraph}>{subbmisionDate()}</p>
            </div>
            <div className={styles.absenceDataContainer}>
                <div className={styles.columnContainer}>
                    <label className={styles.idLabel}>
                        <p className={styles.idParagraph}>ID:</p>
                        <p className={styles.idDataParagraph}>{absence.id}</p>
                    </label>
                    <label className={styles.firstnameLabel}>
                        <p className={styles.firstnameParagraph}>Imię:</p>
                        <p className={styles.firstnameDataParagraph}>{user?.firstname}</p>
                    </label>
                    <label className={styles.surnameLabel}>
                        <p className={styles.surnameParagraph}>Nazwisko:</p>
                        <p className={styles.surnameDataParagraph}>{user?.surname}</p>
                    </label>
                    <label className={styles.remainingDaysLabel}>
                        <p className={styles.remainingDaysParagraph}>Dostępne dni:</p>
                        <p className={styles.remainingDaysDataParagraph}>20</p>
                    </label>
                </div>
                <div className={styles.columnContainer}>
                    <label className={styles.startDateLabel}>
                        <p className={styles.startDateParagraph}>Od:</p>
                        <p className={styles.startDateDataParagraph}>{startDate()}</p>
                    </label>
                    <label className={styles.endDateLabel}>
                        <p className={styles.endDateParagraph}>Do:</p>
                        <p className={styles.endDateDataParagraph}>{endDate()}</p>
                    </label>
                    <label className={styles.quantityDaysLabel}>
                        <p className={styles.quantityDaysParagraph}>Liczba dni:</p>
                        <p className={styles.quantityDaysDataParagraph}>{quantityDays()}</p>
                    </label>
                    <label className={styles.statusNameLabel}>
                        <p className={styles.statusNameParagraph}>Status:</p>
                        <p className={styles.statusNameDataParagraph}>{absence.status.name}</p>
                    </label>
                </div>
            </div>
            <div className={styles.buttonContainer}>
                <button className={styles.acceptButton}>
                    <FontAwesomeIcon className={styles.buttonIcon} icon={faCheck} />
                    <p className={styles.buttonParagraph}>Akceptuj</p>
                </button>
                <button className={styles.declineButton}>
                    <FontAwesomeIcon icon={faXmark} />
                    <p className={styles.buttonParagraph}>Odrzuć</p>
                </button>
            </div>
        </div>
    );
}

export default AbsenceCardEmployer;