import React, { useEffect, useState } from 'react';
import Tile from '@/components/employees/tile';
import FilterEmp from '@/components/employees/filterEmp';
import styles from './main.module.scss';

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

const Employees: React.FC = () => {
  const [data, setData] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState('');
  const [selectedSort, setSelectedSort] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/user/simple')
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
  }, []);

  const handleSortChange = (value: string) => {
    setSortOrder(value);
    setSelectedSort(value);
  };

  const handleClearFilters = () => {
    setSortOrder('');
    setSelectedSort('');
  };

  const sortedData = [...data].sort((a, b) => {
    if (sortOrder === 'az') {
      return a.firstname.localeCompare(b.firstname);
    } else if (sortOrder === 'za') {
      return b.firstname.localeCompare(a.firstname);
    }
    return 0;
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <FilterEmp onSortChange={handleSortChange} onClearFilters={handleClearFilters} selectedSort={selectedSort} />
      <div className={styles.container}>
        {sortedData.map((person, index) => (
          <Tile key={index} person={person} />
        ))}
      </div>
    </div>
  );
}

export default Employees;
