import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTurnUp, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import Role from '@/components/types/role';
import User from '@/components/types/user';
import PredefinedShifts from '@/components/types/predefinedShifts';
import styles from './main.module.scss';
interface AddShiftModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddShift: (shiftData: { start: string; end: string; userId: number; roleName: string; }) => void;
    user: User;
    day: string;
}

const AddShiftModal: React.FC<AddShiftModalProps> = ({ isOpen, onClose, onAddShift, user, day }) => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [predefineShifts, setPredefineShifts] = useState<PredefinedShifts[]>([]);
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [selectedStartTime, setSelectedStartTime] = useState<string>('00:00');
    const [selectedEndTime, setSelectedEndTime] = useState<string>('00:00');

    const shiftHours: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const formattedHour = hour.toString().padStart(2, '0');
            const formattedMinute = minute.toString().padStart(2, '0');
            shiftHours.push(`${formattedHour}:${formattedMinute}`);
        }
    }

    const handleTimeChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (event: React.ChangeEvent<HTMLSelectElement>) => {
        setter(event.target.value);
    };

    const handleStartTimeChange = handleTimeChange(setSelectedStartTime);
    const handleEndTimeChange = handleTimeChange(setSelectedEndTime);

    const shiftTime = () => {
        const convertTimeToDecimal = (time: string) => {
            const [hours, minutes] = time.split(':');
            return parseInt(hours) + parseInt(minutes) / 60;
        };

        const startTime = convertTimeToDecimal(selectedStartTime);
        const endTime = convertTimeToDecimal(selectedEndTime);
        const duration = startTime <= endTime ? endTime - startTime : 24 - startTime + endTime;

        return isNaN(duration) ? 0 : duration;
    };

    useEffect(() => {
        if (!isOpen) return;

        fetch('http://localhost:8080/api/v1/role')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log('Fetched roles:', data);
                setRoles(data);
            })
            .catch((error) => {
                console.error('Error fetching roles:', error);
            });

        fetch('http://localhost:8080/api/v1/predefine-shift')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log('Fetched predefineShifts:', data);
                setPredefineShifts(data);
            })
            .catch((error) => {
                console.error('Error fetching predefineShifts:', error);
            });
    }, [isOpen]);

    const newDayFormat = () => {
        return day.split('-').reverse().join('.');
    };

    const resetForm = () => {
        setSelectedRole('');
        setSelectedStartTime('00:00');
        setSelectedEndTime('00:00');
    };

    const handlePredefinedShift = (predefinedShift: PredefinedShifts) => {
        setSelectedStartTime(predefinedShift.start.slice(0, 5));
        setSelectedEndTime(predefinedShift.end.slice(0, 5));
    };

    const handleSubmit = () => {
        const newStart = `${day}T${selectedStartTime}`;
        const newEnd = `${day}T${selectedEndTime}`;

        onAddShift({
            start: newStart,
            end: newEnd,
            userId: user.id,
            roleName: selectedRole,
        });

        resetForm();
        onClose();
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return isOpen ? (
        <div className={styles.addShiftModalOverlay}>
            <div className={styles.addShiftModalContent}>
                <div className={styles.titleContainer}>
                    <label className={styles.title}>Dodaj zmianę</label>
                </div>
                <div className={styles.basicInfoContainer}>
                    <div className={styles.personFullnameContainer}>
                        <div className={styles.fullNameContainer}>
                            <label className={styles.fullNameLabel}></label>Imie i Nazwisko:
                        </div>
                        <div className={styles.fullNameParagraphContainer}>
                            <p className={styles.firstnameParagraph}>{user.firstname}</p>
                            <p className={styles.surnameParagraph}>{user.surname}</p>
                        </div>
                    </div>
                    <div className={styles.dayContainer}>
                        <div className={styles.dayLabelContainer}>
                            <label className={styles.dayLabel}></label>  Data:
                        </div>
                        <div className={styles.dayParagraphContainer}>
                            <p className={styles.dayParagraph}>{newDayFormat()}</p>
                        </div>
                    </div>
                </div>
                <div className={styles.hoursConstainerMain}>
                    <div className={styles.hourInfoContainer}>
                        <label className={styles.hourInfoLabel}>Godziny:</label>
                        <label className={styles.hourInfoAdviceLabel}>(wybierz gotowe... lub dodaj własne)</label>
                    </div>
                    <div className={styles.hoursConstainer}>
                        <div className={styles.startHour}>
                            <label className={styles.startHourLabel}>Początek zmiany:</label>
                            <select className={styles.hourSelect} value={selectedStartTime} onChange={handleStartTimeChange}>
                                {shiftHours.map((time, index) => (
                                    <option key={index} value={time}>
                                        {time}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.endHour}>
                            <label className={styles.endHourLabel}>Koniec zmiany:</label>
                            <select className={styles.hourSelect} value={selectedEndTime} onChange={handleEndTimeChange}>
                                {shiftHours.map((time, index) => (
                                    <option key={index} value={time}>
                                        {time}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className={styles.shiftTimeContainer}>
                    <label className={styles.shiftTimeLabel}>Czas trwania zmiany: {shiftTime()}h.</label>
                </div>
                <div className={styles.predefinedShiftsContainer}>
                    {predefineShifts.map((predefinedShift) => (
                        <button
                            onClick={() => handlePredefinedShift(predefinedShift)}
                            key={predefinedShift.id}
                            className={styles.predefinedShiftButton}
                        >
                            <p className={styles.predefinedShiftParagraph}>{predefinedShift.name}</p>
                        </button>
                    ))}
                </div>
                <div className={styles.roleContainer}>
                    <label className={styles.roleLabel}>Rola na zmianie: </label>
                    <select
                        className={styles.roleSelect}
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                    >
                        <option value="">Wybierz rolę</option>
                        {roles.map((role) => (
                            <option key={role.id} value={role.name}>
                                {role.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.buttonContainer}>
                    <button className={styles.addShiftButton} onClick={handleSubmit}><FontAwesomeIcon className={styles.buttonIcon} icon={faCircleCheck} /><p className={styles.buttonParagraph}>Dodaj zmianę</p></button>
                    <button className={styles.closeButton} onClick={handleClose}><FontAwesomeIcon className={styles.buttonIcon} icon={faArrowTurnUp} style={{ transform: 'rotate(-90deg)' }}/><p className={styles.buttonParagraph}>Anuluj</p></button>
                </div>
            </div>
        </div>
    ) : null;
};
export default AddShiftModal;