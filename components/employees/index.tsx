'use client';
import React, { useEffect, useState } from 'react';
import Tile from '@/components/employees/tile';
import FilterEmployee from '@/components/employees/filterEmployee';
import styles from './main.module.scss';
import NavEmp from '@/components/employees/navEmployee';

interface Language {
  id: number;
  name: string;
}

interface Person {
  id: number;
  firstname: string;
  surname: string;
  languages: Language[];
}

const EmployeesComponent: React.FC = () => {
  const [data, setData] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFilteredData = (filters: { roles?: number[]; languages?: number[]; order?: string }) => {
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
    <div>
      <NavEmp />
      <FilterEmployee onApplyFilters={fetchFilteredData} />
      <div className={styles.container}>
        {loading && <div>Loading...</div>}
        {error && <div>Error: {error}</div>}
        {!loading && !error && data.length === 0 && <div>No data available</div>}
        {!loading && !error && data.length > 0 && data.map((person, index) => (
          <Tile key={index} person={person} />
        ))}
      </div>
    </div>
  );
}

export default EmployeesComponent;
