import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { ProgressSpinner } from 'primereact/progressspinner';
import Absence from '@/components/types/absence';
import AbsenceType from '@/components/types/absenceType';
import SimpleUser from "@/components/types/simpleUser";
import CancelConfirmation from './popUps/cancelConfirmation';
import AproveConfirmation from './popUps/aproveConfirmation';
import styles from './main.module.scss';
import { Message } from 'primereact/message';
import { fetchCsrfToken } from '@/services/csrfService';
import { fetchSimpleUser } from '@/services/userService';
import { fetchAbsenceType } from '@/services/absenceService';

interface AbsenceCardProps {
    absence: Absence;
    onStatusUpdate: () => void;
}

const AbsenceCardEmployer: React.FC<AbsenceCardProps> = ({ absence, onStatusUpdate }) => {
    const [absenceType, setAbsenceType] = useState<AbsenceType | null>(null);
    const [user, setUser] = useState<SimpleUser | null>(null);
    const [modalIsOpenCancelAbsence, setModalIsOpenCancelAbsence] = useState(false);
    const [modalIsOpenAproveAbsence, setModalIsOpenAproveAbsence] = useState(false);
    const [modalIsOpenLoadning, setModalIsOpenLoadning] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            await fetchSimpleUser(absence, setUser,setModalIsOpenLoadning);
            await fetchAbsenceType(absence.absence_type_id, setAbsenceType);
          };
          fetchData();

    }, [absence.absence_type_id, absence.user_id]);

    const subbmisionDate = () => new Date(absence.submission).toLocaleDateString();
    const startDate = () => new Date(absence.start).toLocaleDateString();
    const endDate = () => new Date(absence.end).toLocaleDateString();
    const workingDays = () => absence.working_days ?? 0;

    const updateAbsenceStatus = async (absenceId: number, statusId: number) => {
        setModalIsOpenLoadning(true);
        try {
            const tokenXSRF = await fetchCsrfToken();

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/absence/${absenceId}/status/${statusId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                        'X-XSRF-TOKEN': tokenXSRF,
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    console.error('Error updating absence status, response not OK');
                    throw new Error('Error updating absence status');
                }

                setModalIsOpenLoadning(false);
                // const responseData = await response.json();
                // console.log('Updated absence status response data:', responseData);
        } catch (error) {
            console.error('Error updating absence status:', error);
            setError('Error updating absence status');
        }
    };

    const handleDeclineClick = async () => {
        try {
            await updateAbsenceStatus(absence.id, 4);
            console.log('Absence rejected');
            onStatusUpdate();
        } catch (error) {
            console.error('Error rejecting absence:', error);
        }
    };

    const handleAcceptClick = async () => {
        try {
            await updateAbsenceStatus(absence.id, 2);
            console.log('Absence approved');
            onStatusUpdate();
        } catch (error) {
            console.error('Error approving absence:', error);
        }
    };

    const renderButtons = () => {
        switch (absence.status.name) {
            case 'approved':
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
            case 'awaiting':
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
                <div className={styles.cancelAbsenceModalOverlay}>
                    <div className={styles.cancelAbsenceModalContent}>
                        <CancelConfirmation
                            onCancel={handleDeclineClick}
                            onClose={() => setModalIsOpenCancelAbsence(false)}
                            absenceType={absenceType?.name ?? 'Unknown'}
                            absenceStartAndEnd={`${startDate()} - ${endDate()}`}
                        />
                    </div>
                </div>
            )}
            {modalIsOpenAproveAbsence && (
                <div className={styles.aproveAbsenceModalOverlay}>
                    <div className={styles.aproveAbsenceModalContent}>
                        <AproveConfirmation
                            onAprove={handleAcceptClick}
                            onClose={() => setModalIsOpenAproveAbsence(false)}
                            absenceType={absenceType?.name ?? 'Unknown'}
                            absenceStartAndEnd={`${startDate()} - ${endDate()}`}
                        />
                    </div>
                </div>
            )}
            {error && <Message severity="error" text={`Error: ${error}`} className={styles.errorMessageComponent} />}

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

export default AbsenceCardEmployer;