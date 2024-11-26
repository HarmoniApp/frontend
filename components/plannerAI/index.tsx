'use client';
import React, { useEffect, useState } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import styles from './main.module.scss';
import RequirementsForm from '@/components/plannerAI/requirementsForm'

const PlanerAi = () => {
//   const [userId, setUserId] = useState<number>(0);

//   useEffect(() => {
//     const storedUserId = sessionStorage.getItem('userId');

//     if (storedUserId !== null) {
//       setUserId(Number(storedUserId));
//     }
//   }, []);

  return (
    <div className={styles.planerAiContainerMain}>
      {/* {userId !== 0 ? ( */}
       <RequirementsForm />
      
    {/* //   ) : ( */}
    {/* //     <div className={styles.spinnerContainer}><ProgressSpinner /></div> */}
    {/* //   )} */}
    </div>
  );
};

export default PlanerAi;