'use client';
import React from 'react';
import styles from './main.module.scss';
import RequirementsForm from '@/components/plannerAI/requirementsForm'

const PlanerAi = () => {
  return (
    <div className={styles.planerAiContainerMain}>
       <RequirementsForm />
    </div>
  );
};
export default PlanerAi;