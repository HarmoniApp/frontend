'use client';
import React, { useEffect, useState } from 'react';
import Tile from '@/components/employees/tile';
import EmployeeFilter from '@/components/employees/employeeFilter';
import EmployeeBar from '@/components/employees/employeeBar';
import PersonTile from '@/components/types/personTile';
import styles from './main.module.scss';
import '@/styles/components/pagination.css';

import { ProgressSpinner } from 'primereact/progressspinner';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import { Message as PrimeMessage } from 'primereact/message';
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

  const fetchFilteredData = async (filters: { roles?: number[]; languages?: number[]; order?: string; query?: string } = {}, pageNumber: number = 1, pageSize: number = 21) => {
    setLoading(true);

    let url = '';

    if (filters.query && filters.query.trim() !== '') {
      url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/simple/search?q=${filters.query}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/simple?pageNumber=${pageNumber}&pageSize=${pageSize}`;

      const params = new URLSearchParams();

      if (filters.roles && filters.roles.length) {
        filters.roles.forEach(role => params.append('role', role.toString()));
      }
      if (filters.languages && filters.languages.length) {
        filters.languages.forEach(language => params.append('language', language.toString()));
      }
      if (filters.order) params.append('order', filters.order);

      if (params.toString()) {
        url += `&${params.toString()}`;
      }
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
        }

      });
      const responseData = await response.json();
      if (responseData && responseData.content) {
        setData(responseData.content);
        setTotalRecords(responseData.pageSize * responseData.totalPages);
      } else if (responseData && responseData.length > 0) {
        setData(responseData);
      } else {
        setData([]);
        setTotalRecords(0);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Błąd podczas filtrowania danychTets');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredData({}, 1, rows);
  }, [rows]);

  const onPageChange = (e: PaginatorPageChangeEvent) => {
    setFirst(e.first);
    setRows(e.rows);
    const pageNumber = Math.floor(e.first / e.rows) + 1;
    fetchFilteredData({}, pageNumber, e.rows);
  };

  return (
    <div className={styles.employeesContainerMain}>
      <div className={styles.emplyeesBarContainer}>
        <EmployeeBar setActiveView={setActiveView} activeView={activeView} />
      </div>
      <div className={styles.employeesFilterAndListContainer}>
        <div className={styles.emplyeesFilterContainer}>
          <EmployeeFilter onApplyFilters={(filters) => fetchFilteredData(filters, 1, rows)} setError={setError} />
        </div>
        <div className={`${styles.employeesListcontainer} ${activeView === 'tiles' ? styles.tilesView : styles.listView}`}>
          {loading && <div className={styles.spinnerContainer}><ProgressSpinner /></div>}
          {!loading && error && <Message severity="error" text={`Error: ${error}`} className={styles.errorMessage} />}
          {!loading && !error && data.length === 0 && <Card title="No Data" className={styles.noDataCard}><p>There is no data available at the moment.</p></Card>}
          {!loading && !error && data.length > 0 && data.map((person, index) => (
            <Tile key={index} person={person} view={activeView} setError={setError} />
          ))}
          {error && <PrimeMessage severity="error" text={`Error: ${error}`} className={styles.errorMessageComponent} />}
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