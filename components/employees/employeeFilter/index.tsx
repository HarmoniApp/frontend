import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faTrashCan, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import styles from './main.module.scss';
import Flag from 'react-flagkit';
import { useFilterEmployee } from '@/hooks/useFilterEmployees';

interface FilterEmployeeProps {
  onApplyFilters: (filters: { roles?: number[]; languages?: number[]; order?: string }) => void;
}

const FilterEmployee: React.FC<FilterEmployeeProps> = ({ onApplyFilters }) => {
  const {
    roles,
    languages,
    selectedRoles,
    selectedLanguages,
    order,
    searchQuery,
    isPositionOpen,
    isSortOpen,
    isLanguageOpen,
    setIsPositionOpen,
    setIsSortOpen,
    setIsLanguageOpen, 
    positionListRef,
    sortListRef,
    languageListRef,
    setOrder,
    setSearchQuery,
    handleRoleChange,
    handleLanguageChange,
    handleClearFilters,
    toggleSection,
  } = useFilterEmployee(onApplyFilters);

  return (
    <div className={styles.employeesFilerContainerMain}>
      <div className={styles.searchInputContainer}>
        <>
          <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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