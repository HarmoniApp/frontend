import React from 'react';

interface FilterEmpProps {
  onSortChange: (value: string) => void;
  onClearFilters: () => void;
  selectedSort: string;
}

const FilterEmp: React.FC<FilterEmpProps> = ({ onSortChange, onClearFilters, selectedSort }) => {
  return (
    <div>
      <button>EDIT ROLES</button>
      <select value={selectedSort} onChange={(e) => onSortChange(e.target.value)}>
        <option value="" disabled>Sortuj</option>
        <option value="az">A-Z</option>
        <option value="za">Z-A</option>
      </select>
      <select>Stanowisko</select>
      <button onClick={onClearFilters}>Wyczyść wszystko</button>
      <button>import pracowkik</button>
      <button>add pracowkik</button>
      <button>lista widok</button>
      <button>kafelki widok</button>
    </div>
  );
}

export default FilterEmp;
