import React, { useEffect, useState } from 'react';
import AbsenceCard from '@/components/absence/employer/absentCard';
import styles from './main.module.scss';

interface Absence {
  id: number;
  start: string;
  end: string;
  status: {
    id: number;
    name: string;
  };
  submission: string;
  updated: string;
  user_id: number;
  absence_type_id: number;
}

const AbsenceEmployer: React.FC = () => {
  const [absences, setAbsences] = useState<Absence[]>([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/absence')
      .then(response => response.json())
      .then(data => setAbsences(data))
      .catch(error => console.error('Error fetching absences:', error));
  }, []);

  return (
    <div>
      {absences.map(absence => (
        <AbsenceCard key={absence.id} absence={absence} />
      ))}
    </div>
  );
};

export default AbsenceEmployer;
