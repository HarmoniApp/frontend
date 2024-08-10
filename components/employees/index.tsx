import React, { useEffect, useState } from 'react';
import Tile from '@/components/employees/tile';
import FilterEmp from '@/components/employees/filterEmp';
import styles from './main.module.scss';
import NavEmp from '@/components/employees/navEmp';

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
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

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

  const handleClearFilters = () => {
    setSelectedRoles([]);
  };

  const handleRoleChange = (roleId: number) => {
    setSelectedRoles((prevSelectedRoles) => {
      if (prevSelectedRoles.includes(roleId)) {
        return prevSelectedRoles.filter((id) => id !== roleId);
      } else {
        return [...prevSelectedRoles, roleId];
      }
    });
  };

  const filteredData = data.filter(person => {
    if (selectedRoles.length === 0) return true;
    return person.languages.some(language => selectedRoles.includes(language.id));
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <NavEmp />
      <FilterEmp/>
      <div className={styles.container}>
        {data.map((person, index) => (
          <Tile key={index} person={person} />
        ))}
      </div>
    </div>
  );
}

export default Employees;
