import React, { useEffect, useState } from 'react';
import Role from '@/components/types/role';
import Shift from '@/components/types/shift';
import styles from './main.module.scss';

interface EditShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditShift: (shiftData: { id: number; start: string; end: string; userId: number; roleName: string; }) => void;
  shift: Shift;
  firstName: string;
  surname: string;
}

const EditShift: React.FC<EditShiftModalProps> = ({ isOpen, onClose, onEditShift, shift, firstName, surname }) => {
  console.log('Rendering EditShift with isOpen:', isOpen);
  console.log('Shift data:', shift);

  if (!isOpen) return null;

  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>(shift.role_name);
  const [selectedStartTime, setSelectedStartTime] = useState<string>(shift.start.split('T')[1].slice(0, 5));
  const [selectedEndTime, setSelectedEndTime] = useState<string>(shift.end.split('T')[1].slice(0, 5));

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
    fetch('http://localhost:8080/api/v1/role')
      .then(response => response.json())
      .then(data => {
        setRoles(data);
        console.log('Fetched roles:', data);
      })
      .catch(error => console.error('Error fetching roles:', error));
  }, []);

  const handleSubmit = () => {
    const newStart = `${shift.start.split('T')[0]}T${selectedStartTime}`;
    const newEnd = `${shift.end.split('T')[0]}T${selectedEndTime}`;

    onEditShift({
      id: shift.id,
      start: newStart,
      end: newEnd,
      userId: shift.user_id,
      roleName: selectedRole,
    });

    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Edytuj Zmianę</h2>
        <p>Pracownik: {firstName} {surname}</p>
        <p>Data: {shift.start.split('T')[0]}</p>
        <p>Czas zmiany {shiftTime()}</p>
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
        <button onClick={handleSubmit}>Zapisz Zmianę</button>
        <button onClick={handleClose}>Anuluj</button>
      </div>
    </div>
  );
};
export default EditShift;