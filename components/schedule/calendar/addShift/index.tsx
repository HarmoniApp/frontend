import React, { useEffect, useState } from 'react';
import Role from '@/components/types/role';
import User from '@/components/types/user';
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
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [selectedStartTime, setSelectedStartTime] = useState('');
    const [selectedEndTime, setSelectedEndTime] = useState('');

    const shiftHours = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const formattedHour = hour.toString().padStart(2, '0');
            const formattedMinute = minute.toString().padStart(2, '0');
            shiftHours.push(`${formattedHour}:${formattedMinute}`);
        }
    }

    const handleTimeChange = (setter: any) => (event: any) => {
        setter(event.target.value);
    };

    const handleStartTimeChange = handleTimeChange(setSelectedStartTime);
    const handleEndTimeChange = handleTimeChange(setSelectedEndTime);

    const shiftTime = () => {
        const convertTimeToDecimal = (time: string) => {
            const [hours, minutes] = time.split(':');
            return parseInt(hours) + (parseInt(minutes) / 60);
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
    }, [isOpen]);

    const resetForm = () => {
        setSelectedRole('');
        setSelectedStartTime('');
        setSelectedEndTime('');
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
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Dodaj Zmianę dla {user.firstname} {user.surname} na dzień {day}</h2>
                <div>
                    <select value={selectedStartTime} onChange={handleStartTimeChange}>
                        {shiftHours.map((time, index) => (
                            <option key={index} value={time}>
                                {time}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <select value={selectedEndTime} onChange={handleEndTimeChange}>
                        {shiftHours.map((time, index) => (
                            <option key={index} value={time}>
                                {time}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <p>Czas zmiany {shiftTime()}</p>
                </div>
                <select
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
                <button onClick={handleSubmit}>Dodaj Zmianę</button>
                <button onClick={handleClose}>Anuluj</button>
            </div>
        </div>
    ) : null;
};

export default AddShiftModal;