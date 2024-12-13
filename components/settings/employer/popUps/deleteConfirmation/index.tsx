'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTurnUp, faTrash } from '@fortawesome/free-solid-svg-icons';
import styles from './main.module.scss';

interface DeleteConfirmationProps {
    onClose: () => void;
    onDelete: () => void;
    info: string;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ onClose, onDelete, info }) => {
    const handleDelete = () => {
        onDelete();
        onClose();
    }
    return (
        <div className={styles.deleteContainerMain}>
            <div className={styles.headerContainer}>
                <label className={styles.headerLabel}>Czy na pewno chcesz usunąć:</label>
                <label className={styles.highlight}>{info}</label>
                <label className={styles.headerLabel}>?</label>
            </div>
            <div className={styles.butonContainter}>
                <button className={styles.closeButton} onClick={onClose}>
                    <FontAwesomeIcon className={styles.buttonIcon} icon={faArrowTurnUp} style={{ transform: 'rotate(-90deg)' }} />
                    <p className={styles.buttonParagraph}>Cofnij</p>
                </button>
                <button className={styles.deleteButton} onClick={handleDelete}>
                    <FontAwesomeIcon className={styles.buttonIcon} icon={faTrash} />
                    <p className={styles.buttonParagraph}>Usuń</p>
                </button>
            </div>
        </div>
    );
};
export default DeleteConfirmation;