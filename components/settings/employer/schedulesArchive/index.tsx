import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import styles from './main.module.scss';

interface ArchivedShift {
  id: number;
  file_title: string;
}

const SchedulesArchive: React.FC = () => {
  const [shifts, setShifts] = useState<ArchivedShift[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/archived-shifts')
      .then(response => response.json())
      .then(data => {
        setShifts(data);
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching archived shifts');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className={styles.archivedSheduleContainer}>
      {shifts.map(shift => (
        <div key={shift.id} className={styles.shiftItemContainer}>
          <FontAwesomeIcon icon={faFilePdf} className={styles.pdfIcon} />
          <p className={styles.scheduleTitle}>{shift.file_title}</p>
        </div>
      ))}
    </div>
  );
};

export default SchedulesArchive;