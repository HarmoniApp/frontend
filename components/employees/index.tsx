'use client';
import React, { useEffect, useState } from 'react';
import Tile from '@/components/employees/tile';
import EmployeeFilter from '@/components/employees/employeeFilter';
import EmployeeBar from '@/components/employees/employeeBar';
import PersonTile from '@/components/types/personTile';
import styles from './main.module.scss';

const EmployeesComponent: React.FC = () => {
  const [activeView, setActiveView] = useState<'tiles' | 'list'>('tiles');
  const [data, setData] = useState<PersonTile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchFilteredData = (filters: { roles?: number[]; languages?: number[]; order?: string } = {}) => {
    let url = 'http://localhost:8080/api/v1/user/simple';
    const params = new URLSearchParams();

    if (filters.roles && filters.roles.length) {
      filters.roles.forEach(role => params.append('role', role.toString()));
    }
    if (filters.languages && filters.languages.length) {
      filters.languages.forEach(language => params.append('language', language.toString()));
    }
    if (filters.order) params.append('order', filters.order);

    if (params.toString()) url += `?${params.toString()}`;

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFilteredData({});
  }, []);

  return (
    <div className={styles.employeesContainerMain}>
      <div className={styles.emplyeesBarContainer}>
        <EmployeeBar setActiveView={setActiveView} activeView={activeView}/>
      </div>
      <div className={styles.employeesFilterAndListContainer}>
        <div className={styles.emplyeesFilterContainer}>
          <EmployeeFilter onApplyFilters={fetchFilteredData} />
        </div>
        <div className={`${styles.employeesListcontainer} ${activeView === 'tiles' ? styles.tilesView : styles.listView}`}>
          {loading && <div>Loading...</div>}
          {error && <div>Error: {error}</div>}
          {!loading && !error && data.length === 0 && <div>No data available</div>}
          {!loading && !error && data.length > 0 && data.map((person, index) => (
            <Tile key={index} person={person} view={activeView}/>
          ))}
        </div>
      </div>
    </div>
  );
}
export default EmployeesComponent;