"use client";
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRectangleList, faGrip, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import AbsenceCard from '@/components/absence/employer/absenceCard';
import Absence from '@/components/types/absence';
import AbsenceStatus from '@/components/types/absenceStatus';
import User from '@/components/types/user';
import styles from './main.module.scss';

const AbsenceEmployer: React.FC = () => {
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [absencesStatus, setAbsencesStatus] = useState<AbsenceStatus[]>([]);
  const [viewMode, setViewMode] = useState('tiles');
  const [selectedStatus, setSelectedStatus] = useState<number | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAbsences = () => {
    setLoading(true);
    setError(null);

    fetch('http://localhost:8080/api/v1/absence')
      .then(response => response.json())
      .then(data => {
        setAbsences(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching absences:', error);
        setError('Error fetching absences');
        setLoading(false);
      });
  };

  const fetchUsers = () => {
    fetch('http://localhost:8080/api/v1/user/simple')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  };

  useEffect(() => {
    fetchAbsences();
    fetchUsers();

    fetch('http://localhost:8080/api/v1/status')
      .then(response => response.json())
      .then(data => setAbsencesStatus(data))
      .catch(error => console.error('Error fetching absence statuses:', error));
  }, []);

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const statusId = event.target.value === 'clear' ? undefined : parseInt(event.target.value);

    setLoading(true);
    setError(null);

    if (statusId === undefined) {
      setSelectedStatus(undefined);
      fetchAbsences();
    } else {
      setSelectedStatus(statusId);
      fetch(`http://localhost:8080/api/v1/absence/status/${statusId}`)
        .then(response => response.json())
        .then(data => {
          setAbsences(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching absences by status:', error);
          setError('Error fetching absences by status');
          setLoading(false);
        });
    }
  };

  const getUserById = (userId: number): User | undefined => {
    return users.find(user => user.id === userId);
  };

  const filteredAbsences = absences.filter(absence => {
    const user = getUserById(absence.user_id);

    const absenceTypeMatches = absence.status?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const userMatches = user?.firstname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.surname?.toLowerCase().includes(searchQuery.toLowerCase());

    return absenceTypeMatches || userMatches;
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
                onChange={(e) => setSearchQuery(e.target.value)}
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

        {loading && <div>Ładowanie danych...</div>}
        {error && <div>Błąd: {error}</div>}
        {!loading && !error && filteredAbsences.length === 0 && <div>Brak dostępnych danych</div>}
        {!loading && !error && filteredAbsences.length > 0 && (
          <div className={
            viewMode === 'tiles'
              ? styles.cardsViewContainerTiles
              : styles.cardsViewContainerList
          }>
            {filteredAbsences.map(absence => (
              <AbsenceCard key={absence.id} absence={absence} onStatusUpdate={fetchAbsences} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AbsenceEmployer;