'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarWeek, faArrowTurnUp } from '@fortawesome/free-solid-svg-icons';
import styles from './main.module.scss';

interface PublishConfirmationProps {
    onPublish: () => void;
    onClose: () => void;
    week: string;
}

const ArchiveConfirmation: React.FC<PublishConfirmationProps> = ({ onPublish, onClose, week }) => {
    const handlePublish = () => {
        onPublish();
        onClose();
    }

    return (
        <div className={styles.archiveConfirmationContainerMain}>
            <div className={styles.headerContainer}>
                <label className={styles.headerLabel}>Czy chcesz opublikować zmiany w kalendarzu?</label>
                <label className={styles.highlight}>{week}</label>
            </div>
            <div className={styles.butonContainter}>
                <button className={styles.closeButton} onClick={onClose}>
                    <FontAwesomeIcon className={styles.buttonIcon} icon={faArrowTurnUp} style={{ transform: 'rotate(-90deg)' }} />
                    <p className={styles.buttonParagraph}>Cofnij</p>
                </button>
                <button className={styles.archiveButton} onClick={handlePublish}>
                    <FontAwesomeIcon className={styles.buttonIcon} icon={faCalendarWeek} />
                    <p className={styles.buttonParagraph}>Opublikuj</p>
                </button>
            </div>
        </div>
    );
};
export default ArchiveConfirmation;