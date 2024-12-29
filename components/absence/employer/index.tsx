'use client';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRectangleList, faGrip, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import AbsenceCard from '@/components/absence/employer/absenceCard';
import styles from './main.module.scss';
import { Card } from 'primereact/card';
import { fetchAbsences } from '@/services/absenceService';
import LoadingSpinner from '@/components/loadingSpinner';
import { useAbsenceEmployer } from '@/hooks/absences/useAbsenceEmployer';

const AbsenceEmployer: React.FC = () => {
  const {
    absences,
    setAbsences,
    absencesStatus,
    viewMode,
    selectedStatus,
    searchQuery,
    loading,
    setViewMode,
    setSearchQuery,
    handleStatusChange,
  } = useAbsenceEmployer();

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
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Wyszukaj"
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
              />
              <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon} />
            </div>
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
        {!loading  && absences.length === 0 && (
          <Card title="Brak wniosków urlopowych" className={styles.noDataCard}></Card>
        )}
        {!loading && absences.length > 0 && (
          <div className={
            viewMode === 'tiles'
              ? styles.cardsViewContainerTiles
              : styles.cardsViewContainerList
          }>
            {absences.map(absence => (
              <AbsenceCard key={absence.id} absence={absence} onStatusUpdate={() => fetchAbsences(setAbsences)}/>
            ))}
          </div>
        )}
      </div>
      {loading && <LoadingSpinner wholeModal={false}/>}
      
    </div>
  );
};
export default AbsenceEmployer;