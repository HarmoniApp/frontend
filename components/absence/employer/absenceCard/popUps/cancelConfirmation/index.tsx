'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faArrowTurnUp } from '@fortawesome/free-solid-svg-icons';
import styles from './main.module.scss';

interface CancelConfirmationProps {
    onCancel: () => void;
    onClose: () => void;
    absenceType: string;
    absenceStartAndEnd: string;
}

const CancelConfirmation: React.FC<CancelConfirmationProps> = ({ onCancel, onClose, absenceType, absenceStartAndEnd }) => {

    const handleCancel = () => {
        onCancel();
        onClose();
    }

    absenceStartAndEnd = absenceStartAndEnd.replace(/\//g, '.');

    return (
        <div className={styles.cancelContainerMain}>
            <div className={styles.headerContainer}>
                <label className={styles.headerLabel}>Czy na pewno chcesz anulować ten wniosek o urlop:</label>
                <label className={styles.highlight}>{absenceType}</label>
                <label className={styles.headerLabel}>{absenceStartAndEnd}</label>
            </div>
            <div className={styles.butonContainter}>
                <button className={styles.closeButton} onClick={onClose}>
                    <FontAwesomeIcon className={styles.buttonIcon} icon={faArrowTurnUp} style={{ transform: 'rotate(-90deg)' }} />
                    <p className={styles.buttonParagraph}>Cofnij</p>
                </button>
                <button className={styles.cancelButton} onClick={handleCancel}>
                    <FontAwesomeIcon className={styles.buttonIcon} icon={faCircleXmark} />
                    <p className={styles.buttonParagraph}>Odmów</p>
                </button>
            </div>
        </div>
    );
};
export default CancelConfirmation;