'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxArchive, faArrowTurnUp } from '@fortawesome/free-solid-svg-icons';
import styles from './main.module.scss';

interface ArchiveConfirmationProps {
    onArchive: () => void;
    onClose: () => void;
    absenceType: string;
    absenceStartAndEnd: string;
}

const ArchiveConfirmation: React.FC<ArchiveConfirmationProps> = ({ onArchive, onClose, absenceType, absenceStartAndEnd }) => {
    const handleArchive = () => {
        onArchive();
        onClose();
    }
    return (
        <div className={styles.archiveConfirmationContainerMain}>
            <div className={styles.headerContainer}>
                <label className={styles.headerLabel}>Czy chcesz zaachowizować ten urlop:</label>
                <label className={styles.highlight}>{absenceType}</label>
                <label className={styles.headerLabel}>{absenceStartAndEnd}</label>
            </div>
            <div className={styles.butonContainter}>
                <button className={styles.closeButton} onClick={onClose}>
                    <FontAwesomeIcon className={styles.buttonIcon} icon={faArrowTurnUp} style={{ transform: 'rotate(-90deg)' }} />
                    <p className={styles.buttonParagraph}>Cofnij</p>
                </button>
                <button className={styles.archiveButton} onClick={handleArchive}>
                    <FontAwesomeIcon className={styles.buttonIcon} icon={faBoxArchive} />
                    <p className={styles.buttonParagraph}>Archiwizuj</p>
                </button>
            </div>
        </div>
    );
};
export default ArchiveConfirmation;