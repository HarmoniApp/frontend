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

const FilterEmp = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);

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

  return (
    <div className={styles.mainContainer}>
      <h3>Sortowanie</h3>
      <label>
        <input type="checkbox" className={styles.ascCheckbox} value="asc"/> A-Z
      </label>
      <label>
        <input type="checkbox" className={styles.descCheckbox} value="desc"/> Z-A
      </label>

      <h3>Jezyki</h3>
      {languages.map(language => (
        <label key={language.id}>
          <input
            type="checkbox"
            value={language.id}
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
          />
          {role.name}
        </label>
      ))}
      <button>Wyczyść wszystko</button>
    </div>
  );
}

export default FilterEmp;
