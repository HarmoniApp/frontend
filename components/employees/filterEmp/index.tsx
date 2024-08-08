import React from 'react';

interface FilterEmpProps {
  onSortChange: (value: string) => void;
}

const FilterEmp: React.FC<FilterEmpProps> = ({ onSortChange }) => {
  return (
    <div>
      <button>EDIT ROLES</button>
      <select onChange={(e) => onSortChange(e.target.value)}>
        <option value="" disabled selected>Sortuj</option>
        <option value="az">A-Z</option>
        <option value="za">Z-A</option>
      </select>
      <select>Stanowisko</select>
      <button>Wyczysc wszytsko</button>
      <button>import pracowkik</button>
      <button>add pracowkik</button>
      <button>lista widok</button>
      <button>kafelki widok</button>
    </div>
  );
}

export default FilterEmp;
