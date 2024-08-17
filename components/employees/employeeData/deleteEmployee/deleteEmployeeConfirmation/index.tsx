import React from 'react';
import styles from './main.module.scss';

interface DeleteEmployeeConfirmationPopUpProps {
    firstName: string;
    surname: string;
    employeeLink: string | null;
    onClose: () => void;
    modalCountdown: number;
}

const DeleteEmployeeConfirmationPopUp:React.FC<DeleteEmployeeConfirmationPopUpProps> = ({ firstName, surname, employeeLink, onClose, modalCountdown }) => {
    const BackToEmployee = "/employees";
    return (
    <div>
      <p>Użytkownik {firstName} {surname} został usunięty!</p>
      <p>Przekierowanie do listy pracowników za {modalCountdown} sekund</p><p>lub kliknij przycisk poniżej</p>
      <button onClick={onClose}><a href={employeeLink ?? ''}>Powrót</a></button>

    </div>
    );
}
export default DeleteEmployeeConfirmationPopUp;