"use client";
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faPen, faXmark, faCheck } from '@fortawesome/free-solid-svg-icons';
import PredefinedShift from '@/components/types/predefinedShifts';
import styles from './main.module.scss';

const PredefinedShifts: React.FC = () => {
  const [shifts, setShifts] = useState<PredefinedShift[]>([]);
  const [newShift, setNewShift] = useState<PredefinedShift>({ id: 0, name: '', start: '00:00', end: '00:00' });
  const [editingShiftId, setEditingShiftId] = useState<number | null>(null);
  const [editedShift, setEditedShift] = useState<PredefinedShift>({ id: 0, name: '', start: '00:00', end: '00:00' });

  const shiftHours: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      shiftHours.push(`${formattedHour}:${formattedMinute}`);
    }
  }

  useEffect(() => {
    fetchPredefinedShifts();
  }, []);

  const fetchPredefinedShifts = () => {
    fetch('http://localhost:8080/api/v1/predefine-shift')
      .then(response => response.json())
      .then(data => setShifts(data))
      .catch(error => console.error('Error fetching predefined shifts:', error));
  };

  const handleAddShift = () => {
    if (newShift.name.trim() && newShift.start.trim() && newShift.end.trim()) {
      fetch('http://localhost:8080/api/v1/predefine-shift', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newShift.name, start: newShift.start, end: newShift.end }),
      })
        .then(response => response.json())
        .then((data: PredefinedShift) => {
          setShifts([...shifts, data]);
          setNewShift({ id: 0, name: '', start: '00:00', end: '00:00' });
        })
        .catch(error => console.error('Error adding predefined shift:', error));
    }
  };

  const handleEditShift = (shift: PredefinedShift) => {
    setEditingShiftId(shift.id);
    setEditedShift({
      id: shift.id,
      name: shift.name,
      start: shift.start.slice(0, 5), 
      end: shift.end.slice(0, 5),
    });
  };

  const handleDeleteShift = (shiftId: number) => {
    fetch(`http://localhost:8080/api/v1/predefine-shift/${shiftId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setShifts(shifts.filter((shift) => shift.id !== shiftId));
        } else {
          console.error('Failed to delete shift');
        }
      })
      .catch(error => console.error('Error deleting shift:', error));
  };

  const handleSaveEdit = () => {
    fetch(`http://localhost:8080/api/v1/predefine-shift/${editedShift.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedShift),
    })
      .then(response => response.json())
      .then((data: PredefinedShift) => {
        setShifts(shifts.map((shift) => (shift.id === data.id ? data : shift)));
        setEditingShiftId(null);
        setEditedShift({ id: 0, name: '', start: '00:00', end: '00:00' });
      })
      .catch(error => console.error('Error updating predefined shift:', error));
  };

  const handleCancelEdit = () => {
    setEditingShiftId(null);
    setEditedShift({ id: 0, name: '', start: '00:00', end: '00:00' });
  };

  return (
    <div className={styles.predefinedShiftsContainerMain}>
      <div className={styles.showShiftMapContainer}>
        {shifts.map((shift) => (
          <div key={shift.id} className={styles.showShiftContainer}>
            <div className={styles.shiftInfoContainer}>
              {editingShiftId === shift.id ? (
                <>
                  <input
                    type="text"
                    value={editedShift.name}
                    onChange={(e) => setEditedShift({ ...editedShift, name: e.target.value })}
                    className={styles.shiftNameInput}
                  />
                </>
              ) : (
                <>
                  <p className={styles.shiftNameParagraph}>{shift.name}</p>
                  <p className={styles.shiftTimeParagraph}>{shift.start.slice(0, 5)} - {shift.end.slice(0, 5)}</p>
                </>
              )}
            </div>
            <div className={styles.editAndRemoveButtonContainer}>
              {editingShiftId === shift.id ? (
                <>
                  <select
                    value={editedShift.start}
                    onChange={(e) => setEditedShift({ ...editedShift, start: e.target.value })}
                    className={styles.shiftTimeSelect}
                  >
                    {shiftHours.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  <select
                    value={editedShift.end}
                    onChange={(e) => setEditedShift({ ...editedShift, end: e.target.value })}
                    className={styles.shiftTimeSelect}
                  >
                    {shiftHours.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  <button className={styles.yesButton} onClick={handleSaveEdit}>
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
                  <button className={styles.noButton} onClick={handleCancelEdit}>
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </>
              ) : (
                <>
                  <button className={styles.editButton} onClick={() => handleEditShift(shift)}>
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                  <button className={styles.removeButton} onClick={() => handleDeleteShift(shift.id)}>
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className={styles.addContainer}>
        <input
          type="text"
          className={styles.addInput}
          value={newShift.name}
          onChange={(e) => setNewShift({ ...newShift, name: e.target.value })}
          placeholder="Wpisz nazwę predefiniowanej zmiany"
        />
        <select
          value={newShift.start}
          onChange={(e) => setNewShift({ ...newShift, start: e.target.value })}
          className={styles.addShiftTimeSelect}
        >
          {shiftHours.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
        <select
          value={newShift.end}
          onChange={(e) => setNewShift({ ...newShift, end: e.target.value })}
          className={styles.addShiftTimeSelect}
        >
          {shiftHours.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
        <button className={styles.addButton} onClick={handleAddShift}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
    </div>
  );
};
export default PredefinedShifts;