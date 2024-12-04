import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import styles from "./main.module.scss";

interface InstructionProps {
    isOpen: boolean;
    onClose: () => void;
}

const Instruction: React.FC<InstructionProps> = ({ isOpen, onClose }) => {
    return (
        <div className={`${styles.instructionOverlay} ${isOpen ? styles.open : styles.closed}`}>
            <div className={`${styles.instructionContent} ${isOpen ? styles.open : styles.closed}`}>
                <button className={styles.instructionClose} onClick={onClose}>
                    <FontAwesomeIcon icon={faCircleXmark} />
                </button>
                <ul>
                    <li>
                        <strong>Wybór daty i zmiany:</strong> Wybierz datę w polu daty u góry, a następnie zaznacz jedną lub więcej zmian (np. „Custom3”) w sekcji z predefiniowanymi zmianami. To pozwala ustalić, dla jakich zmian będziesz przypisywać role.
                    </li>
                    <li>
                        <strong>Przypisywanie ról i liczby osób:</strong> W sekcji poniżej wybierz role, które chcesz przypisać do danej zmiany (np. „Barman”), a następnie ustaw liczbę osób, które mają pełnić tę rolę na wybranej zmianie (np. 1 lub 2 barmanów).
                    </li>
                    <li>
                        <strong>Generowanie grafiku:</strong> Kliknij „Generuj”, aby utworzyć grafik na podstawie wybranych zmian i przypisanych ról. Opcja „Dodaj kolejny dzień” pozwala na dodanie następnego dnia do grafiku.
                    </li>
                    <li>
                        <strong>Czyszczenie i usuwanie:</strong> Jeśli po wygenerowaniu grafiku chcesz go zresetować, możesz kliknąć „Usuń wszystkie zmiany ostatnio wprowadzone przez PlanerAI”. Pamiętaj, że opcja „Usuń dzień” pozwala na usunięcie wybranego dnia z grafiku, a czyszczenie działa tylko po wcześniejszym użyciu przycisku „Generuj”.
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Instruction;
