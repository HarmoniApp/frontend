"use client";
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faPen, faXmark, faCheck } from '@fortawesome/free-solid-svg-icons';
import Role from '@/components/types/role';
import styles from './main.module.scss';

interface RolePopUpProps {
  onClick: () => void;
}

const RolePopUp: React.FC<RolePopUpProps> = ({ onClick }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [newRoleName, setNewRoleName] = useState<string>('');
  const [editingRoleId, setEditingRoleId] = useState<number | null>(null);
  const [editedRoleName, setEditedRoleName] = useState<string>('');

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = () => {
    fetch('http://localhost:8080/api/v1/role')
      .then(response => response.json())
      .then(data => setRoles(data))
      .catch(error => console.error('Error fetching roles:', error));
  };

  const handleDeleteRole = (roleId: number) => {
    fetch(`http://localhost:8080/api/v1/role/${roleId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          fetchRoles();
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
        fetchRoles();
        setNewRoleName('');
      })
      .catch(error => console.error('Error adding role:', error));
  };

  const handleEditRole = (role: Role) => {
    setEditingRoleId(role.id);
    setEditedRoleName(role.name);
  };

  const handleCancelEdit = () => {
    setEditingRoleId(null);
    setEditedRoleName('');
  };

  const handleSaveEdit = () => {
    if (editingRoleId !== null && editedRoleName.trim() !== '') {
      fetch(`http://localhost:8080/api/v1/role/${editingRoleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editedRoleName }),
      })
        .then(response => response.json())
        .then(() => {
          fetchRoles();
          setEditingRoleId(null);
          setEditedRoleName('');
        })
        .catch(error => console.error('Error updating role:', error));
    }
  };

  return (
    <div className={styles.rolePopUpContainerMain}>
      <div className={styles.showRoleMapConteiner}>
        {roles.map(role => (
          <div key={role.id} className={styles.showRoleConteiner}>
            {editingRoleId === role.id ? (
              <input
                type="text"
                value={editedRoleName}
                onChange={(e) => setEditedRoleName(e.target.value)}
                className={styles.roleNameInput}
              />
            ) : (
              <p className={styles.roleNameParagraph}>{role.name}</p>
            )}
            <div className={styles.editAndRemoveButtonContainer}>
              {editingRoleId === role.id ? (
                <>
                  <button className={styles.yesButton} onClick={handleSaveEdit}>
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
                  <button className={styles.noButton} onClick={handleCancelEdit}>
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </>
              ) : (
                <>
                  <button className={styles.editButton} onClick={() => handleEditRole(role)}>
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                  <button className={styles.removeButton} onClick={() => handleDeleteRole(role.id)}>
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
                </>
              )}
            </div>
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
        <button className={styles.addButton} onClick={handleAddRole}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.closeButton} onClick={onClick}>Zamknij</button>
      </div>
    </div>
  );
};
export default RolePopUp;