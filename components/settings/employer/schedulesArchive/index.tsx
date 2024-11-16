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
    const fetchShifts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/archived-shifts`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
          }
        });
        if (response.ok) {
          const data = await response.json();
          setShifts(data);
        } else {
          console.error("Failed to fetch shifts:", response.statusText);
        }
      } catch (error) {
        setError('Error fetching archived shifts');
      } finally {
        setLoading(false);
      }
    };

    fetchShifts();
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