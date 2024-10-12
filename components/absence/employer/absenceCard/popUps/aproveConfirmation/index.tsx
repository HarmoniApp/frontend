'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faArrowTurnUp } from '@fortawesome/free-solid-svg-icons';
import styles from './main.module.scss';

interface ArchiveConfirmationProps {
    onAprove: () => void;
    onClose: () => void;
    absenceType: string;
    absenceStartAndEnd: string;
}

const ArchiveConfirmation: React.FC<ArchiveConfirmationProps> = ({ onAprove, onClose, absenceType, absenceStartAndEnd }) => {
    const handleArchive = () => {
        onAprove();
        onClose();
    }
    
    absenceStartAndEnd = absenceStartAndEnd.replace(/\//g, '.');

    return (
        <div className={styles.aproveConfirmationContainerMain}>
            <div className={styles.headerContainer}>
                <label className={styles.headerLabel}>Czy chcesz zaakceptować ten urlop:</label>
                <label className={styles.highlight}>{absenceType}</label>
                <label className={styles.headerLabel}>{absenceStartAndEnd}</label>
            </div>
            <div className={styles.butonContainter}>
                <button className={styles.closeButton} onClick={onClose}>
                    <FontAwesomeIcon className={styles.buttonIcon} icon={faArrowTurnUp} style={{ transform: 'rotate(-90deg)' }} />
                    <p className={styles.buttonParagraph}>Cofnij</p>
                </button>
                <button className={styles.aproveButton} onClick={handleArchive}>
                    <FontAwesomeIcon className={styles.buttonIcon} icon={faCircleCheck} />
                    <p className={styles.buttonParagraph}>Zaakceptuj</p>
                </button>
            </div>
        </div>
    );
};
export default ArchiveConfirmation;