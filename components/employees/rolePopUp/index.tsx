"use client";
import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPlus  } from '@fortawesome/free-solid-svg-icons'
import Role from '@/components/types/role';
import styles from './main.module.scss';

interface RolePopUpProps {
  onClick: () => void;
  onWidthChange: (width: number) => void;
}

const RolePopUp:React.FC<RolePopUpProps> = ({onClick, onWidthChange}) => {
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

  const roleContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (roleContainerRef.current) {
            onWidthChange(roleContainerRef.current.offsetWidth);
        }
    }, [onWidthChange]);

  return (
    <div ref={roleContainerRef} className={styles.rolePopUpContainerMain}>
      <div className={styles.showRoleMapConteiner}>
        {roles.map(role => (
          <div key={role.id} className={styles.showRoleConteiner}>
            <p className={styles.roleNameParagraph}>{role.name}</p>
            <button className={styles.removeButton} onClick={() => handleDeleteRole(role.id)}><FontAwesomeIcon icon={faMinus} /></button>
          </div>
        ))}
      </div>
      <div className={styles.addContainer}>
        <input
          type="text"
          className={styles.addInput}
          value={newRoleName}
          onChange={(e) => setNewRoleName(e.target.value)}
          placeholder="Wpisz nazwę nowej roli"
        />
        <button className={styles.addButton} onClick={handleAddRole}><FontAwesomeIcon icon={faPlus} /></button>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.closeButton} onClick={onClick}>Zamknij</button>
      </div>
    </div>
  );
}
export default RolePopUp;