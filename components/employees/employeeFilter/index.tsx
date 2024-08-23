"use client";
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import styles from './main.module.scss';
import Flag from 'react-flagkit';

interface Role {
  id: number;
  name: string;
}

interface Language {
  id: number;
  name: string;
}

const languageAbbreviations: { [key: string]: string } = {
  Arabic: 'AE',
  Bengali: 'BD',
  English: 'GB',
  French: 'FR',
  German: 'DE',
  Hindi: 'IN',
  Italian: 'IT',
  Japanese: 'JP',
  Korean: 'KR',
  Mandarin: 'CN',
  Other: 'IL',
  Persian: 'IR',
  Polish: 'PL',
  Portuguese: 'PT',
  Russian: 'RU',
  Spanish: 'ES',
  Turkish: 'TR',
  Vietnamese: 'VN',
};

interface FilterEmployeeProps {
  onApplyFilters: (filters: { roles?: number[]; languages?: number[]; order?: string }) => void;
}

const FilterEmployee: React.FC<FilterEmployeeProps> = ({ onApplyFilters }) => {
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
    const timeoutId = setTimeout(() => {
      const filters: { roles?: number[]; languages?: number[]; order?: string } = {};
      if (selectedRoles.length) filters.roles = selectedRoles;
      if (selectedLanguages.length) filters.languages = selectedLanguages;
      if (order) filters.order = order;
      onApplyFilters(filters);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [selectedRoles, selectedLanguages, order]);

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
    <div className={styles.employeesFilerContainerMain}>
      <div className={styles.sortContainer}>
        <h3 className={styles.sortTitle}><FontAwesomeIcon className={styles.sortIcon} icon={faPlay}/>Sortowanie</h3>
        <label className={styles.ascCheckboxContainer}>
          <input
            type="checkbox"
            className={styles.ascCheckbox}
            value="asc"
            checked={order === 'asc'}
            onChange={() => setOrder(order === 'asc' ? null : 'asc')}
          />
          <span className={styles.ascCheckboxLabel}>A-Z</span>
        </label>
        <label className={styles.descCheckboxContainer}>
          <input
            type="checkbox"
            className={styles.descCheckbox}
            value="desc"
            checked={order === 'desc'}
            onChange={() => setOrder(order === 'desc' ? null : 'desc')}
          />
          <span className={styles.descCheckboxLabel}>Z-A</span>
        </label>
      </div>
      <div className={styles.languagesContainer}>
        <h3 className={styles.languagesTitle}><FontAwesomeIcon className={styles.languageIcon} icon={faPlay}/>Języki</h3>
        {languages.map(language => (
          <label key={language.id} className={styles.languageCheckboxContainer}>
            <input
              type="checkbox"
              value={language.id}
              className={styles.languageCheckbox}
              checked={selectedLanguages.includes(language.id)}
              onChange={() => handleLanguageChange(language.id)}
            />
            <span className={styles.languageCheckboxLabel}>{language.name}</span>
            <Flag className={styles.languageFlag} country={languageAbbreviations[language.name]} />
          </label>
        ))}
      </div>
      <div className={styles.positionContainer}>
        <h3 className={styles.positionTitle}><FontAwesomeIcon className={styles.positionIcon} icon={faPlay}/> Stanowsiko</h3>
        {roles.map(role => (
          <label key={role.id} className={styles.positionCheckboxContainer}>
            <input
              type="checkbox"
              value={role.id}
              className={styles.positionCheckbox}
              checked={selectedRoles.includes(role.id)}
              onChange={() => handleRoleChange(role.id)}
            />
            <span className={styles.positionCheckboxLabel}>{role.name}</span>
          </label>
        ))}
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.clearButton} onClick={handleClearFilters}>Wyczyść wszystko</button>
      </div>
    </div>
  );
}

export default FilterEmployee;