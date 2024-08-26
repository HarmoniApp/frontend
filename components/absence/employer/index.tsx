"use client"
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRectangleList, faGrip } from '@fortawesome/free-solid-svg-icons';
import AbsenceCard from '@/components/absence/employer/absentCard';
import Absence from '@/components/types/absence';
import AbsenceStatus from '@/components/types/absenceStatus';
import styles from './main.module.scss';

const AbsenceEmployer: React.FC = () => {
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [absencesStatus, setAbsencesStatus] = useState<AbsenceStatus[]>([]);
  const [viewMode, setViewMode] = useState('tiles');
  const [selectedStatus, setSelectedStatus] = useState<number | undefined>(undefined);

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/absence')
      .then(response => response.json())
      .then(data => setAbsences(data))
      .catch(error => console.error('Error fetching absences:', error));

    fetch('http://localhost:8080/api/v1/status')
      .then(response => response.json())
      .then(data => setAbsencesStatus(data))
      .catch(error => console.error('Error fetching absence statuses:', error));
  }, []);

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const statusId = event.target.value === 'clear' ? undefined : parseInt(event.target.value);

    if (statusId === undefined) {
      setSelectedStatus(undefined);
      fetch('http://localhost:8080/api/v1/absence')
        .then(response => response.json())
        .then(data => setAbsences(data))
        .catch(error => console.error('Error fetching absences:', error));
    } else {
      setSelectedStatus(statusId);
      fetch(`http://localhost:8080/api/v1/absence/status/${statusId}`)
        .then(response => response.json())
        .then(data => setAbsences(data))
        .catch(error => console.error('Error fetching absences by status:', error));
    }
  };

  return (
    <div className={styles.absenceEmployerContainerMain}>
      <div className={styles.absenceEmployerContainer}>
        <div className={styles.buttonContainer}>
          <div className={styles.selectContainer}>
            <select
              className={styles.roleSelect}
              name="status"
              onChange={handleStatusChange}
              value={selectedStatus !== undefined ? selectedStatus : 'default'}
            >
              <option value="default" disabled>Filtruj</option>
              {absencesStatus.map(absenceStatus => (
                <option
                  className={styles.filterOption}
                  key={absenceStatus.id}
                  value={absenceStatus.id}
                >
                  {absenceStatus.name}
                </option>
              ))}
              <option className={styles.clearFilter} value="clear">Wyczyść filtry</option>
            </select>
          </div>
          <div className={styles.viewContainer}>
            <button
              className={`${styles.listViewButton} ${viewMode === 'list' ? styles.active : ''}`}
              onClick={() => setViewMode('list')}
            >
              <FontAwesomeIcon icon={faRectangleList} />
            </button>
            <button
              className={`${styles.tilesViewButton} ${viewMode === 'tiles' ? styles.active : ''}`}
              onClick={() => setViewMode('tiles')}
            >
              <FontAwesomeIcon icon={faGrip} />
            </button>
          </div>
        </div>
        <div className={
          viewMode === 'tiles'
            ? styles.cardsViewContainerTiles
            : styles.cardsViewContainerList
        }>
          {absences.map(absence => (
            <AbsenceCard key={absence.id} absence={absence} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default AbsenceEmployer;