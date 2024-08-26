import React, { useEffect, useState } from 'react';
import AbsenceCard from '@/components/absence/employer/absentCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRectangleList, faGrip } from '@fortawesome/free-solid-svg-icons';
import Absence from '@/components/types/absence';
import AbsenceStatus from '@/components/types/absenceStatus';
import styles from './main.module.scss';



const AbsenceEmployer: React.FC = () => {
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [absencesStatus, setAbsencesStatus] = useState<AbsenceStatus[]>([]);
  const [viewMode, setViewMode] = useState('tiles');

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/absence')
      .then(response => response.json())
      .then(data => setAbsences(data))
      .catch(error => console.error('Error fetching absences:', error));

      fetch('http://localhost:8080/api/v1/status')
      .then(response => response.json())
      .then(data => setAbsencesStatus(data))
      .catch(error => console.error('Error fetching absences:', error));
  }, []);

  return (
    <div className={styles.absenceEmployerContainerMain}>
      <div className={styles.absenceEmployerContainer}>
        <div className={styles.buttonContainer}>
          <div className={styles.selectContainer}>
            <select className={styles.roleSelect} name="status" id="">
              <option className="defalutOption" selected disabled>Filtruj</option>
              {absencesStatus.map(absenceStatus => (
                <option className={styles.filterOption} key={absenceStatus.id} value={absenceStatus.name}>{absenceStatus.name}</option>
              ))}
              <option className="clearFilter" value="clear">Wyczyść filtry</option>
            </select>
          </div>
          <div className={styles.viewContainer}>
            <button
              className={`${styles.listViewButton} ${viewMode === 'list' ? styles.active : ''}`}
              onClick={() => setViewMode('list')}> <FontAwesomeIcon icon={faRectangleList} />
            </button>
            <button
              className={`${styles.tilesViewButton} ${viewMode === 'tiles' ? styles.active : ''}`}
              onClick={() => setViewMode('tiles')}><FontAwesomeIcon icon={faGrip} />
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
