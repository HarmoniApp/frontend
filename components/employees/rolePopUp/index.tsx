"use client";
import React, { useEffect, useState } from 'react';
import Role from '@/components/types/role';
import styles from './main.module.scss';

interface RolePopUpProps {
  onClick: () => void;
}

const RolePopUp:React.FC<RolePopUpProps> = ({onClick}) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [newRoleName, setNewRoleName] = useState<string>('');

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/role')
      .then(response => response.json())
      .then(data => setRoles(data))
      .catch(error => console.error('Error fetching roles:', error));
  }, []);

  const handleDeleteRole = (roleId: number) => {
    fetch(`http://localhost:8080/api/v1/role/${roleId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setRoles(roles.filter(role => role.id !== roleId));
        } else {
          console.error('Failed to delete role');
        }
      })
      .catch(error => console.error('Error deleting role:', error));
  };

  const handleAddRole = () => {
    if (newRoleName.trim() === '') {
      return;
    }

    fetch('http://localhost:8080/api/v1/role', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newRoleName }),
    })
      .then(response => response.json())
      .then(newRole => {
        setRoles([...roles, newRole]);
        setNewRoleName('');
      })
      .catch(error => console.error('Error adding role:', error));
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.addConteinerMain}>
        {roles.map(role => (
          <div key={role.id} className={styles.addContainer}>
            <p>{role.name}</p>
            <button onClick={() => handleDeleteRole(role.id)}>-</button>
          </div>
        ))}
      </div>
      <div className={styles.addContainer}>
        <input
          type="text"
          value={newRoleName}
          onChange={(e) => setNewRoleName(e.target.value)}
          placeholder="Nowa rola"
        />
        <button onClick={handleAddRole}>+</button>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.closeButton} onClick={onClick}>Zamknij</button>
      </div>
    </div>
  );
}

export default RolePopUp;
