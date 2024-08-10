import React, { useEffect, useState } from 'react';
import styles from './main.module.scss';

interface Role {
  id: number;
  name: string;
}

interface Language {
  id: number;
  name: string;
}

interface FilterEmpProps {
  onApplyFilters: (filters: { roles?: number[]; languages?: number[]; order?: string }) => void;
}

const FilterEmp: React.FC<FilterEmpProps> = ({ onApplyFilters }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<number[]>([]);
  const [order, setOrder] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/role')
      .then(response => response.json())
      .then(data => setRoles(data))
      .catch(error => console.error('Error fetching roles:', error));
  }, []);

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/language')
      .then(response => response.json())
      .then(data => setLanguages(data))
      .catch(error => console.error('Error fetching languages:', error));
  }, []);

  useEffect(() => {
    const filters: { roles?: number[]; languages?: number[]; order?: string } = {};
    if (selectedRoles.length) filters.roles = selectedRoles;
    if (selectedLanguages.length) filters.languages = selectedLanguages;
    if (order) filters.order = order;
    onApplyFilters(filters);
  }, [selectedRoles, selectedLanguages, order, onApplyFilters]);

  const handleRoleChange = (roleId: number) => {
    setSelectedRoles((prevSelectedRoles) => {
      if (prevSelectedRoles.includes(roleId)) {
        return prevSelectedRoles.filter((id) => id !== roleId);
      } else {
        return [...prevSelectedRoles, roleId];
      }
    });
  };

  const handleLanguageChange = (languageId: number) => {
    setSelectedLanguages((prevSelectedLanguages) => {
      if (prevSelectedLanguages.includes(languageId)) {
        return prevSelectedLanguages.filter((id) => id !== languageId);
      } else {
        return [...prevSelectedLanguages, languageId];
      }
    });
  };

  const handleClearFilters = () => {
    setSelectedRoles([]);
    setSelectedLanguages([]);
    setOrder(null);
    onApplyFilters({});
  };

  return (
    <div className={styles.mainContainer}>
      <h3>Sortowanie</h3>
      <label>
        <input
          type="checkbox"
          className={styles.ascCheckbox}
          value="asc"
          checked={order === 'asc'}
          onChange={() => setOrder(order === 'asc' ? null : 'asc')}
        /> A-Z
      </label>
      <label>
        <input
          type="checkbox"
          className={styles.descCheckbox}
          value="desc"
          checked={order === 'desc'}
          onChange={() => setOrder(order === 'desc' ? null : 'desc')}
        /> Z-A
      </label>

      <h3>Języki</h3>
      {languages.map(language => (
        <label key={language.id}>
          <input
            type="checkbox"
            value={language.id}
            checked={selectedLanguages.includes(language.id)}
            onChange={() => handleLanguageChange(language.id)}
          />
          {language.name}
        </label>
      ))}
      
      <h3>Stanowisko:</h3>
      {roles.map(role => (
        <label key={role.id}>
          <input
            type="checkbox"
            value={role.id}
            checked={selectedRoles.includes(role.id)}
            onChange={() => handleRoleChange(role.id)}
          />
          {role.name}
        </label>
      ))}
      
      <button onClick={handleClearFilters}>Wyczyść wszystko</button>
    </div>
  );
}

export default FilterEmp;
