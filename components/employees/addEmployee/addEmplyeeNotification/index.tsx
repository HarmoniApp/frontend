import styles from './main.module.scss';

interface AddEmployeeConfirmationProps {
    firstname: string;
    surname: string;
    employeeLink: string | null;
    modalCountdown: number;
    onClose: () => void;
}

const AddEmployeeNotification: React.FC<AddEmployeeConfirmationProps> = ({ firstname, surname, employeeLink, modalCountdown, onClose }) => {
    return (
        <div className={styles.addEmplyeeConfirmationContainerMain}>
            <div className={styles.questionContainer}>
                <p className={styles.questionParagraph}>Właśnie dodałeś pracownika:</p>
                <span className={styles.highlight}>{firstname} {surname}</span>
            </div>
            <div className={styles.counterContainter}>
                <p className={styles.counterParagraph}>Powrót do listy pracowników za:</p>
                <div className={styles.counterTimer}>
                    <span className={styles.highlight}>{modalCountdown}</span>
                    <p className={styles.counterParagraph}>sekund.</p>
                 </div>
            </div>
            <div className={styles.buttonConianer}>
                {employeeLink && <button className={styles.employeeInfo}><a className={styles.a} href={employeeLink}>Szczegóły</a></button>}
                <button className={styles.backButton} onClick={onClose}>Zamknij</button>
            </div>
        </div>
    );
};
export default AddEmployeeNotification;