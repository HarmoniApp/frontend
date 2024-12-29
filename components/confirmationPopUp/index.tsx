import CustomButton from '../customButton';
import styles from './main.module.scss';

interface ConfirmationPopUpProps {
    action: () => void;
    onClose: () => void;
    description: string;
}

const ConfirmationPopUp: React.FC<ConfirmationPopUpProps> = ({ action, onClose, description }) => {
    return (
        <div className={styles.confirmationPopUpContainer}>
            <div className={styles.headerContainer}>
                <label className={styles.headerLabel}>Czy na pewno chcesz wykonać tą akcję?</label>
                <label className={styles.headerLabelHighlight}>{description}</label>
            </div>
            <div className={styles.butonContainter}>
                <CustomButton action={onClose} writing="Cofnij" icon={"arrowTurnUp"} additionalClass='atBackPopUp'/>
                <CustomButton action={action} writing="Wykonaj" icon={"squareCheck"} additionalClass='atConfirmPopUp'/>
            </div>
        </div>
    );
};
export default ConfirmationPopUp;