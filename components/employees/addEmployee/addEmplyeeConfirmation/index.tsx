import styles from './main.module.scss';

interface AddEmployeeConfirmationProps {
    firstname: string;
    surname: string;
    employeeLink: string | null;
    modalCountdown: number;
    onClose: () => void;
}

const AddEmployeeConfirmation: React.FC<AddEmployeeConfirmationProps> = ({ firstname, surname, employeeLink, modalCountdown, onClose }) => {
    return (
        <div>
            <h2>Pracownik dodany</h2>
            <p>Właśnie dodałeś pracownika: {firstname} {surname}</p>
            {employeeLink && <p>Więcej w <a href={employeeLink}>więcej</a></p>}
            <p>Zamknięcie modala za: {modalCountdown} sekund</p>
            <button onClick={onClose}>Zamknij</button>
        </div>
    );
};

export default AddEmployeeConfirmation;