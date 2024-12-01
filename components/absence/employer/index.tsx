'use client';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRectangleList, faGrip, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import AbsenceCard from '@/components/absence/employer/absenceCard';
import Absence from '@/components/types/absence';
import AbsenceUser from '@/components/types/absenceUser';
import AbsenceStatus from '@/components/types/absenceStatus';
import User from '@/components/types/user';
import styles from './main.module.scss';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';

const AbsenceEmployer: React.FC = () => {
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [absencesStatus, setAbsencesStatus] = useState<AbsenceStatus[]>([]);
  const [viewMode, setViewMode] = useState('tiles');
  const [selectedStatus, setSelectedStatus] = useState<number | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAbsences = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/absence`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
        },
      });
      const data = await response.json();
      setAbsences(data.content);
    } catch (error) {
      console.error('Error fetching absences:', error);
      setError('Error fetching absences');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    let pageNumber = 0;
    let totalPages = 1;
    const allUsers = [];

    try {
      while (pageNumber < totalPages) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/simple?pageNumber=${pageNumber}&pageSize=10`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
          },
        });
        const data = await response.json();

        allUsers.push(...data.content);
        totalPages = data.totalPages;
        pageNumber += 1;
      }

      setUsers(allUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbsences();
    fetchUsers();

    const fetchAbsencesStatus = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/status`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
          },
        });
        const data = await response.json();
        setAbsencesStatus(data);
      } catch (error) {
        console.error('Error fetching absence statuses:', error);
      }
    };

    fetchAbsencesStatus();
  }, []);

  const handleStatusChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const statusId = event.target.value === 'clear' ? undefined : parseInt(event.target.value);

    setLoading(true);
    setError(null);
    setSelectedStatus(statusId);

    try {
      const url = statusId !== undefined
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/absence/status/${statusId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/v1/absence`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
        },
      });
      const data = await response.json();
      setAbsences(data.content);
    } catch (error) {
      console.error('Error fetching absences by status:', error);
      setError('Error fetching absences by status');
    } finally {
      setLoading(false);
    }
  };

  const getUserById = (userId: number): AbsenceUser | undefined => {
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

        {loading && <div className={styles.spinnerContainer}><ProgressSpinner /></div>}
        {error && <Message severity="error" text={`Error: ${error}`} className={styles.errorMessageComponent} />}
        {!loading && !error && filteredAbsences.length === 0 && (
          <Card title="No Data" className={styles.noDataCard}><p>There is no data available at the moment.</p></Card>
        )}
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