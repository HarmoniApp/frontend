'use client';
import React, { useEffect, useState } from 'react';
import Tile from '@/components/employees/tile';
import EmployeeFilter from '@/components/employees/employeeFilter';
import EmployeeBar from '@/components/employees/employeeBar';
import { PersonTile } from '@/components/types/personTile';
import styles from './main.module.scss';
import '@/styles/components/pagination.css';
import { Card } from 'primereact/card';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import LoadingSpinner from '../loadingSpinner';
import { fetchFilterUsers } from '@/services/userService';

const EmployeesComponent: React.FC = () => {
  const [activeView, setActiveView] = useState<'tiles' | 'list'>('tiles');
  const [data, setData] = useState<PersonTile[]>([]);
  const [loading, setLoading] = useState(true);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(21);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchFilteredData = async (filters: { roles?: number[]; languages?: number[]; order?: string; query?: string } = {}, pageNumber: number = 1, pageSize: number = 21) => {
    setLoading(true);
    try {
      await fetchFilterUsers(filters, pageNumber, pageSize, setData, setTotalRecords)
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
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
          <EmployeeFilter onApplyFilters={(filters) => fetchFilteredData(filters, 1, rows)} />
        </div>
        <div className={`${styles.employeesListcontainer} ${activeView === 'tiles' ? styles.tilesView : styles.listView}`}>
          {loading && <LoadingSpinner wholeModal={false} />}
          {!loading && data.length === 0 && <Card title="Brak pracowników" className={styles.noDataCard}></Card>}
          {!loading && data.length > 0 && data.map((person, index) => (
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