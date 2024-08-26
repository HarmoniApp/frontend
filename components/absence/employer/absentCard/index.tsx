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

    function calculateEaster(year: number): Date {
        const f = Math.floor,
            G = year % 19,
            C = f(year / 100),
            H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30,
            I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11)),
            J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7,
            L = I - J,
            month = 3 + f((L + 40) / 44),
            day = L + 28 - 31 * f(month / 4);

        return new Date(year, month - 1, day);
    }


    function calculateWorkingDays() {
        const currentYear = new Date().getFullYear();
        const holidays = [
            `${currentYear}-01-01`, // Nowy Rok
            `${currentYear}-05-01`, // Święto Pracy
            `${currentYear}-05-03`, // Święto Konstytucji 3 Maja
            `${currentYear}-08-15`, // Wniebowzięcie Najświętszej Maryi Panny
            `${currentYear}-11-01`, // Wszystkich Świętych
            `${currentYear}-11-11`, // Święto Niepodległości
            `${currentYear}-12-25`, // Boże Narodzenie
            `${currentYear}-12-26`, // Drugi dzień Bożego Narodzenia
        ];

        const easter = calculateEaster(currentYear);
        const easterMonday = new Date(easter);
        easterMonday.setDate(easter.getDate() + 1);

        holidays.push(
            easter.toISOString().split('T')[0],
            easterMonday.toISOString().split('T')[0]
        );

        const startDate = new Date(absence.start);
        const endDate = new Date(absence.end);

        let totalDays = 0;

        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            const dayOfWeek = date.getDay();
            const formattedDate = date.toISOString().split('T')[0];

            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                if (!holidays.includes(formattedDate) || (dayOfWeek === 6 || dayOfWeek === 0)) {
                    totalDays++;
                }
            }
        }

        return totalDays;
    }

    const renderButtons = () => {
        switch (absence.status.name) {
            case 'approved':
                return (
                    <div className={styles.buttonContainer}>
                        <button className={styles.declineButton}>
                            <FontAwesomeIcon icon={faXmark} />
                            <p className={styles.buttonParagraph}>Odmów</p>
                        </button>


                    </div>
                );
            case 'cancelled':
                return null;

            case 'rejected':
                return null;

            case 'awaiting':
                return (
                    <div className={styles.buttonContainer}>
                        <button className={styles.acceptButton}>
                            <FontAwesomeIcon className={styles.buttonIcon} icon={faCheck} />
                            <p className={styles.buttonParagraph}>Akceptuj</p>
                        </button>
                        <button className={styles.declineButton}>
                            <FontAwesomeIcon icon={faXmark} />
                            <p className={styles.buttonParagraph}>Odmów</p>
                        </button>
                    </div>
                );

            default:
                return null;
        }
    };

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
                        <p className={styles.quantityDaysDataParagraph}>{calculateWorkingDays()}</p>
                    </label>
                    <label className={styles.statusNameLabel}>
                        <p className={styles.statusNameParagraph}>Status:</p>
                        <p className={styles.statusNameDataParagraph}>{absence.status.name}</p>
                    </label>
                </div>
            </div>
            {renderButtons()}
        </div>
    );
}

export default AbsenceCardEmployer;