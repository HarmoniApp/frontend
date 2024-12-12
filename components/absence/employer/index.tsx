'use client';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRectangleList, faGrip, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import AbsenceCard from '@/components/absence/employer/absenceCard';
import Absence from '@/components/types/absence';
import SimpleUser from '@/components/types/simpleUser';
import AbsenceStatus from '@/components/types/absenceStatus';
import styles from './main.module.scss';
import { Card } from 'primereact/card';
import { fetchAbsences, fetchAbsencesByStatus, fetchAbsencesStatus } from '@/services/absenceService';
import LoadingSpinner from '@/components/loadingSpinner';
import { fetchSimpleUsersWithPagination } from '@/services/userService';
import ActionStatusPopUp from '@/components/actionStatusPopUp';

const AbsenceEmployer: React.FC = () => {
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [users, setUsers] = useState<SimpleUser[]>([]);
  const [absencesStatus, setAbsencesStatus] = useState<AbsenceStatus[]>([]);
  const [viewMode, setViewMode] = useState('tiles');
  const [selectedStatus, setSelectedStatus] = useState<number | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [actionStatus, setActionStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [isPopUpVisible, setPopUpVisible] = useState(false);

  const showPopUp = (type: "success" | "error", msg: string) => {
    setActionStatus({ type, msg });
    setPopUpVisible(true);
    setTimeout(() => setPopUpVisible(false), 5000);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await fetchAbsences(setAbsences);
      await fetchAbsencesStatus(setAbsencesStatus);
      await fetchSimpleUsersWithPagination(setUsers);
      setLoading(false)
    };
    loadData();
  }, []);

  const handleStatusChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const statusId = event.target.value === 'clear' ? undefined : parseInt(event.target.value);

    setLoading(true);
    setSelectedStatus(statusId);

    try {
      if(statusId !== undefined){
        await fetchAbsencesByStatus(setAbsences, statusId)
      } else {
        await fetchAbsences(setAbsences);
      }
    } catch (error) {
      console.error('Error fetching absences by status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserById = (userId: number): SimpleUser | undefined => {
    return users.find(user => user.id === userId);
  };

  const filteredAbsences = absences.filter(absence => {
    const user = getUserById(absence.user_id);

    if (searchQuery === '') {
      return true;
    }

    const userFirstNameMatches = user?.firstname?.toLowerCase().includes(searchQuery.toLowerCase());
    const userSurnameMatches = user?.surname?.toLowerCase().includes(searchQuery.toLowerCase());

    return userFirstNameMatches || userSurnameMatches;
  });

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

        
        {!loading  && filteredAbsences.length === 0 && (
          <Card title="Brak danych" className={styles.noDataCard}><p>Nie znaleziono urlopów.</p></Card>
        )}
        {!loading && filteredAbsences.length > 0 && (
          <div className={
            viewMode === 'tiles'
              ? styles.cardsViewContainerTiles
              : styles.cardsViewContainerList
          }>
            {filteredAbsences.map(absence => (
              <AbsenceCard key={absence.id} absence={absence} onStatusUpdate={() => fetchAbsences(setAbsences)} showGreenPanel={showPopUp}/>
            ))}
          </div>
        )}
      </div>
      {loading && <LoadingSpinner wholeModal={false}/>}
      <ActionStatusPopUp
        type={actionStatus?.type || "success"}
        msg={actionStatus?.msg || ""}
        isVisible={isPopUpVisible}
      />
    </div>
  );
};

export default AbsenceEmployer;