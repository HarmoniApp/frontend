import React, { useState, useEffect } from 'react';
import styles from './main.module.scss';

interface Role {
  id: number;
  name: string;
}

interface Contract {
  id: number;
  name: string;
}

const AddEmpPopUp = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/role')
      .then(response => response.json())
      .then(data => setRoles(data))
      .catch(error => console.error('Error fetching roles:', error));
  }, []);

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/contract-type')
      .then(response => response.json())
      .then(data => setContracts(data))
      .catch(error => console.error('Error fetching contract-type:', error));
  }, []);
 
  return (
    <div>
      {contracts.map(contract => (
          <select key={contract.id} className={styles.roleContainer}>
            <p>UMOWA:</p>
            <option>Wybierz umowe:</option>
            <option>{contract.name}</option>
          </select>
        ))}

      {roles.map(role => (
          <select key={role.id} className={styles.roleContainer}>
            <p>ROLA:</p>
            <input
            type="checkbox"
            value={role.id}
          />
          {role.name}
          </select>
        ))}
   
    </div>
  );
}

export default AddEmpPopUp;
