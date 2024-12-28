import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Absence } from '@/components/types/absence';
import styles from './main.module.scss';
import LoadingSpinner from '@/components/loadingSpinner';
import ConfirmationPopUp from '@/components/confirmationPopUp';
import { useAbsenceCard } from '@/hooks/absences/useAbsenceCard';
interface AbsenceCardProps {
    absence: Absence;
    onStatusUpdate: () => void;
}

const AbsenceCardEmployer: React.FC<AbsenceCardProps> = ({ absence, onStatusUpdate }) => {
    const {
        absenceType,
        user,
        modalIsOpenCancelAbsence,
        modalIsOpenAproveAbsence,
        loading,
        setModalIsOpenCancelAbsence,
        setModalIsOpenAproveAbsence,
        subbmisionDate,
        startDate,
        endDate,
        handleDeclineClick,
        handleAcceptClick,
    } = useAbsenceCard(absence, onStatusUpdate);

    const renderButtons = () => {
        switch (absence.status.name) {
            case 'zatwierdzony':
                return (
                    <div className={styles.buttonContainer}>
                        <button
                            className={styles.declineButton}
                            onClick={() => setModalIsOpenCancelAbsence(true)}
                        >
                            <FontAwesomeIcon icon={faXmark} />
                            <p className={styles.buttonParagraph}>Odmów</p>
                        </button>
                    </div>
                );
            case 'oczekuje':
                return (
                    <div className={styles.buttonContainer}>
                        <button
                            className={styles.acceptButton}
                            onClick={() => setModalIsOpenAproveAbsence(true)}
                        >
                            <FontAwesomeIcon className={styles.buttonIcon} icon={faCheck} />
                            <p className={styles.buttonParagraph}>Akceptuj</p>
                        </button>
                        <button
                            className={styles.declineButton}
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
                    <label className={styles.statusNameLabel}>
                        <p className={styles.statusNameParagraph}>Status:</p>
                        <p className={styles.statusNameDataParagraph}>{absence.status.name}</p>
                    </label>
                </div>
            </div>
            {renderButtons()}
            {modalIsOpenCancelAbsence && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <ConfirmationPopUp action={handleDeclineClick} onClose={() => setModalIsOpenCancelAbsence(false)} description={`Anulować ten wniosek o urlop: ${absenceType?.name ?? 'Nieznany'} ${startDate()} - ${endDate()}`} />
                    </div>
                </div>
            )}
            {modalIsOpenAproveAbsence && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <ConfirmationPopUp action={handleAcceptClick} onClose={() => setModalIsOpenAproveAbsence(false)} description={`Zaakceptować ten wniosek o urlop: ${absenceType?.name ?? 'Nieznany'} ${startDate()} - ${endDate()}`} />
                    </div>
                </div>
            )}
            {loading && <LoadingSpinner />}
        </div>
    );
};
export default AbsenceCardEmployer;