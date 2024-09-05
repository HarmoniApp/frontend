"use client";
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faPen, faXmark, faCheck } from '@fortawesome/free-solid-svg-icons';
import RoleWithColour from '@/components/types/roleWithColour';
import styles from './main.module.scss';

const Roles: React.FC = () => {
  const [roles, setRoles] = useState<RoleWithColour[]>([]);
  const [newRoleName, setNewRoleName] = useState<string>('');
  const [newRoleColor, setNewRoleColor] = useState<string>('#ffb6c1');
  const [editingRoleId, setEditingRoleId] = useState<number | null>(null);
  const [editedRoleName, setEditedRoleName] = useState<string>('');
  const [editedRoleColor, setEditedRoleColor] = useState<string>('');

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
      body: JSON.stringify({ name: newRoleName, color: newRoleColor }),
    })
      .then(response => response.json())
      .then(() => {
        fetchRoles();
        setNewRoleName('');
        setNewRoleColor('#ffb6c1');
      })
      .catch(error => console.error('Error adding role:', error));
  };

  const handleEditRole = (role: RoleWithColour) => {
    setEditingRoleId(role.id);
    setEditedRoleName(role.name);
    setEditedRoleColor(role.color || '#ffb6c1');
  };

  const handleCancelEdit = () => {
    setEditingRoleId(null);
    setEditedRoleName('');
    setEditedRoleColor('#ffb6c1');
  };

  const handleSaveEdit = () => {
    if (editingRoleId !== null && editedRoleName.trim() !== '') {
      fetch(`http://localhost:8080/api/v1/role/${editingRoleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editedRoleName, color: editedRoleColor }),
      })
        .then(response => response.json())
        .then(() => {
          fetchRoles();
          setEditingRoleId(null);
          setEditedRoleName('');
          setEditedRoleColor('#ffb6c1');
        })
        .catch(error => console.error('Error updating role:', error));
    }
  };

  return (
    <div className={styles.roleContainerMain}>
      <div className={styles.showRoleMapConteiner}>
        {roles.map(role => (
          <div key={role.id} className={styles.showRoleConteiner}>
            <div className={styles.roleInfoContainer}>
              {editingRoleId === role.id ? (
                <>
                  <input
                    type="text"
                    value={editedRoleName}
                    onChange={(e) => setEditedRoleName(e.target.value)}
                    className={styles.roleNameInput}
                  />
                </>
              ) : (
                <>
                  <p className={styles.roleNameParagraph}>{role.name}</p>
                </>
              )}
            </div>
            <div className={styles.editAndRemoveButtonContainer}>
              {editingRoleId === role.id ? (
                <>
                  <input
                    type="color"
                    value={editedRoleColor}
                    onChange={(e) => setEditedRoleColor(e.target.value)}
                    className={styles.colorPicker}
                    style={{ backgroundColor: editedRoleColor }}
                  />
                  <button className={styles.yesButton} onClick={handleSaveEdit}>
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
                  <button className={styles.noButton} onClick={handleCancelEdit}>
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="color"
                    value={role.color}
                    className={styles.colorPicker}
                    style={{ backgroundColor: role.color , cursor: 'default' }}
                    disabled
                  />
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
        <input
          type="color"
          value={newRoleColor}
          onChange={(e) => setNewRoleColor(e.target.value)}
          className={styles.colorPicker}
          style={{ backgroundColor: newRoleColor }}
        />
        <button className={styles.addButton} onClick={handleAddRole}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
    </div>
  );
};
export default Roles;