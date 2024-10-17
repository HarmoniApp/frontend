import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faTrashCan, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Language from '@/components/types/language';
import Role from '@/components/types/role';
import styles from './main.module.scss';
import Flag from 'react-flagkit';
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

  const [isPositionOpen, setIsPositionOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const positionListRef = useRef<HTMLDivElement>(null);
  const sortListRef = useRef<HTMLDivElement>(null);
  const languageListRef = useRef<HTMLDivElement>(null);

  const toggleSection = (setIsOpen: React.Dispatch<React.SetStateAction<boolean>>, ref: React.RefObject<HTMLDivElement>) => {
    setIsOpen(prevIsOpen => {
      const isOpen = !prevIsOpen;
      if (ref.current) {
        if (isOpen) {
          ref.current.style.height = `${ref.current.scrollHeight}px`;
        } else {
          ref.current.style.height = '0';
        }
      }
      return isOpen;
    });
  };

  const [searchQuery, setSearchQuery] = useState<string>(''); 

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const filters: { roles?: number[]; languages?: number[]; order?: string; query?: string } = {};
      if (selectedRoles.length) filters.roles = selectedRoles;
      if (selectedLanguages.length) filters.languages = selectedLanguages;
      if (order) filters.order = order;
      if (searchQuery) filters.query = searchQuery; 
      onApplyFilters(filters);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [selectedRoles, selectedLanguages, order, searchQuery]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className={styles.employeesFilerContainerMain}>
      <div className={styles.searchInputContainer}>
        <>
          <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon} />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInputChange}
            placeholder="Wyszukaj"
            className={styles.searchInput}
          />
        </>
      </div>
      <div className={styles.sortContainer}>
        <div className={styles.sortTitleContainer} onClick={() => toggleSection(setIsSortOpen, sortListRef)}>
          <FontAwesomeIcon
            className={`${styles.sortIcon} ${isSortOpen ? styles.iconRotated : ''}`}
            icon={faPlay}
          />
          <h3 className={styles.sortText}>Sortowanie</h3>
        </div>

        <div ref={sortListRef} className={`${styles.listContainer}`}>
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
      </div>

      <div className={styles.languagesContainer}>
        <div className={styles.languagesTitleContainer} onClick={() => toggleSection(setIsLanguageOpen, languageListRef)}>
          <FontAwesomeIcon
            className={`${styles.languageIcon} ${isLanguageOpen ? styles.iconRotated : ''}`}
            icon={faPlay}
          />
          <h3 className={styles.languagesText}>Języki</h3>
        </div>

        <div ref={languageListRef} className={`${styles.listContainer}`}>
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
              <Flag className={styles.languageFlag} country={language.code.toUpperCase()} />
            </label>
          ))}
        </div>
      </div>

      <div className={styles.positionContainer}>
        <div className={styles.positionTitleContainer} onClick={() => toggleSection(setIsPositionOpen, positionListRef)}>
          <FontAwesomeIcon
            className={`${styles.positionIcon} ${isPositionOpen ? styles.iconRotated : ''}`}
            icon={faPlay}
          />
          <h3 className={styles.positionText}>Stanowsiko</h3>
        </div>
        <div ref={positionListRef} className={`${styles.listContainer}`}>
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
      </div>

      <div className={styles.buttonContainer}>
        <button className={styles.clearButton} onClick={handleClearFilters}>
          <FontAwesomeIcon className={styles.clearButtonIcon} icon={faTrashCan} />
          Wyczyść wszystko
        </button>
      </div>
    </div>
  );
};
export default FilterEmployee;