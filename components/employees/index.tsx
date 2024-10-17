'use client';
import React, { useEffect, useState } from 'react';
import Tile from '@/components/employees/tile';
import EmployeeFilter from '@/components/employees/employeeFilter';
import EmployeeBar from '@/components/employees/employeeBar';
import PersonTile from '@/components/types/personTile';
import styles from './main.module.scss';
import './main.css';

import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import 'primereact/resources/themes/saga-blue/theme.css'; 

const EmployeesComponent: React.FC = () => {
  const [activeView, setActiveView] = useState<'tiles' | 'list'>('tiles');
  const [data, setData] = useState<PersonTile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(21);
  const [totalRecords, setTotalRecords] = useState(0); 

  const fetchFilteredData = (filters: { roles?: number[]; languages?: number[]; order?: string } = {}, pageNumber: number = 1, pageSize: number = 10) => {
    let url = `http://localhost:8080/api/v1/user/simple?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    const params = new URLSearchParams();

    if (filters.roles && filters.roles.length) {
      filters.roles.forEach(role => params.append('role', role.toString()));
    }
    if (filters.languages && filters.languages.length) {
      filters.languages.forEach(language => params.append('language', language.toString()));
    }
    if (filters.order) params.append('order', filters.order);

    if (params.toString()) url += `&${params.toString()}`;

    console.log('Fetching data from URL:', url);

    fetch(url)
      .then(response => {
        console.log('API Response:', response);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(responseData => {
        if (responseData && responseData.content) {
          setData(responseData.content);
          setTotalRecords(responseData.pageSize * responseData.totalPages);
        } else {
          setData([]);
          setTotalRecords(0);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    console.log('Initial data fetch with rows:', rows);
    fetchFilteredData({}, 1, rows);
  }, [rows]);

  const onPageChange = (e: PaginatorPageChangeEvent) => {
    console.log('Page change event:', e);
    setFirst(e.first);
    setRows(e.rows);
    const pageNumber = Math.floor(e.first / e.rows) + 1;
    console.log('Fetching page:', pageNumber, 'with pageSize:', e.rows);
    fetchFilteredData({}, pageNumber, e.rows);
  };

  return (
    <div className={styles.employeesContainerMain}>
      <div className={styles.emplyeesBarContainer}>
        <EmployeeBar setActiveView={setActiveView} activeView={activeView} />
      </div>
      <div className={styles.employeesFilterAndListContainer}>
        <div className={styles.emplyeesFilterContainer}>
          <EmployeeFilter onApplyFilters={(filters) => fetchFilteredData(filters, 1, rows)} />
        </div>
        <div className={`${styles.employeesListcontainer} ${activeView === 'tiles' ? styles.tilesView : styles.listView}`}>
          {loading && <div>Loading...</div>}
          {error && <div>Error: {error}</div>}
          {!loading && !error && data.length === 0 && <div>No data available</div>}
          {!loading && !error && data.length > 0 && data.map((person, index) => (
            <Tile key={index} person={person} view={activeView} />
          ))}
        </div>
      </div>
      
      <Paginator 
        first={first} 
        rows={rows} 
        totalRecords={totalRecords} 
        rowsPerPageOptions={[21, 49, 70]} 
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default EmployeesComponent;