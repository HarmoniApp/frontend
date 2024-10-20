import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import Absence from '@/components/types/absence';
import AbsenceType from '@/components/types/absenceType';
import AbsenceUser from '@/components/types/absenceUser';
import CancelConfirmation from './popUps/cancelConfirmation';
import AproveConfirmation from './popUps/aproveConfirmation';
import styles from './main.module.scss';

interface AbsenceCardProps {
    absence: Absence;
    onStatusUpdate: () => void;
}

const AbsenceCardEmployer: React.FC<AbsenceCardProps> = ({ absence, onStatusUpdate }) => {
    const [absenceType, setAbsenceType] = useState<AbsenceType | null>(null);
    const [user, setUser] = useState<AbsenceUser | null>(null);
    const [modalIsOpenCancelAbsence, setModalIsOpenCancelAbsence] = useState(false);
    const [modalIsOpenAproveAbsence, setModalIsOpenAproveAbsence] = useState(false);

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

    const workingDays = () => {
        return absence.working_days ?? 0;
    }

    const updateAbsenceStatus = (absenceId: number, statusId: number): Promise<void> => {
        return fetch(`http://localhost:8080/api/v1/absence/${absenceId}/status/${statusId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error updating absence status');
                }
            })
            .catch(error => {
                console.error('Error updating absence status:', error);
                throw error;
            });
    };

    const handleAcceptClick = () => {
        updateAbsenceStatus(absence.id, 2)
            .then(() => {
                console.log('Absence approved');
                onStatusUpdate();
            })
            .catch(error => console.error('Error approving absence:', error));
    };

    const handleDeclineClick = () => {
        updateAbsenceStatus(absence.id, 4)
            .then(() => {
                console.log('Absence rejected');
                onStatusUpdate();
            })
            .catch(error => console.error('Error rejecting absence:', error));
    };

    const renderButtons = () => {
        switch (absence.status.name) {
            case 'approved':
                return (
                    <div className={styles.buttonContainer}>
                        <button 
                            className={styles.declineButton}
                            // onClick={handleDeclineClick}
                            onClick={() => setModalIsOpenCancelAbsence(true)}
                        >
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
                        <button 
                            className={styles.acceptButton}
                            // onClick={handleAcceptClick}
                            onClick={() => setModalIsOpenAproveAbsence(true)}
                        >
                            <FontAwesomeIcon className={styles.buttonIcon} icon={faCheck} />
                            <p className={styles.buttonParagraph}>Akceptuj</p>
                        </button>
                        <button 
                            className={styles.declineButton}
                            // onClick={handleDeclineClick}
                            onClick={() => setModalIsOpenCancelAbsence(true)}
                        >
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
                        <p className={styles.idParagraph}>Id prac:</p>
                        <p className={styles.idDataParagraph}>{absence.employee_id}</p>
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
                        <p className={styles.quantityDaysDataParagraph}>{workingDays()}</p>
                    </label>
                    <label className={styles.statusNameLabel}>
                        <p className={styles.statusNameParagraph}>Status:</p>
                        <p className={styles.statusNameDataParagraph}>{absence.status.name}</p>
                    </label>
                </div>
            </div>
            {renderButtons()}
            {modalIsOpenCancelAbsence && (
                <div className={styles.addAbsencetModalOverlay}>
                    <div className={styles.addAbsenceModalContent}>
                        <CancelConfirmation
                            onCancel={handleDeclineClick}
                            onClose={() => setModalIsOpenCancelAbsence(false)}
                            absenceType={absenceType?.name ?? 'Unknown'}
                            absenceStartAndEnd={startDate() + ' - ' + endDate()}
                        />
                    </div>
                </div>
            )}
            {modalIsOpenAproveAbsence && (
                <div className={styles.addAbsencetModalOverlay}>
                    <div className={styles.addAbsenceModalContent}>
                        <AproveConfirmation
                            onAprove={handleAcceptClick}
                            onClose={() => setModalIsOpenAproveAbsence(false)}
                            absenceType={absenceType?.name ?? 'Unknown'}
                            absenceStartAndEnd={startDate() + ' - ' + endDate()}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
export default AbsenceCardEmployer;