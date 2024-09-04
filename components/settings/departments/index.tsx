"use client";

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPen, faCheck, faXmark, faPlus } from '@fortawesome/free-solid-svg-icons';
import styles from './main.module.scss';

interface DepartmentAddress {
    id: number;
    city: string;
    street: string;
    apartment: string;
    zip_code: string;
    building_number: string;
    department_name: string;
}

const Departments: React.FC = () => {
    const [departments, setDepartments] = useState<DepartmentAddress[]>([]);
    const [newDepartment, setNewDepartment] = useState<DepartmentAddress>({
        id: 0,
        city: '',
        street: '',
        apartment: '',
        zip_code: '',
        building_number: '',
        department_name: ''
    });
    const [editingDepartmentId, setEditingDepartmentId] = useState<number | null>(null);
    const [editedDepartment, setEditedDepartment] = useState<DepartmentAddress | null>(null);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = () => {
        fetch('http://localhost:8080/api/v1/address')
            .then(response => response.json())
            .then(data => {
                const filteredDepartments = data.filter((dept: DepartmentAddress) => dept.department_name !== null);
                setDepartments(filteredDepartments);
            })
            .catch(error => console.error('Error fetching departments:', error));
    };

    const handleAddDepartment = () => {
        if (newDepartment.department_name.trim()) {
            fetch('http://localhost:8080/api/v1/address', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newDepartment),
            })
                .then(response => response.json())
                .then((addedDepartment) => {
                    setDepartments([...departments, addedDepartment]);
                    setNewDepartment({
                        id: 0,
                        city: '',
                        street: '',
                        apartment: '',
                        zip_code: '',
                        building_number: '',
                        department_name: ''
                    });
                })
                .catch(error => console.error('Error adding department:', error));
        }
    };

    const handleEditDepartment = (department: DepartmentAddress) => {
        setEditingDepartmentId(department.id);
        setEditedDepartment(department);
    };

    const handleCancelEdit = () => {
        setEditingDepartmentId(null);
        setEditedDepartment(null);
    };

    const handleSaveEdit = () => {
        if (editingDepartmentId !== null && editedDepartment) {
            fetch(`http://localhost:8080/api/v1/address/${editingDepartmentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedDepartment),
            })
                .then(response => response.json())
                .then((updatedDepartment) => {
                    setDepartments(prevDepartments =>
                        prevDepartments.map(dept =>
                            dept.id === updatedDepartment.id ? updatedDepartment : dept
                        )
                    );
                    setEditingDepartmentId(null);
                    setEditedDepartment(null);
                })
                .catch(error => console.error('Error updating department:', error));
        }
    };

    const handleDeleteDepartment = (departmentId: number) => {
        fetch(`http://localhost:8080/api/v1/address/${departmentId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    setDepartments(departments.filter(dept => dept.id !== departmentId));
                } else {
                    console.error('Failed to delete department');
                }
            })
            .catch(error => console.error('Error deleting department:', error));
    };

    return (
        <div className={styles.departmentContainerMain}>
            <div className={styles.showDepartmentsMapConteiner}>
                {departments.map(department => (
                    <div key={department.id} className={styles.showDepartmentConteiner}>
                        <div className={styles.departmentInfoContainer}>
                            {editingDepartmentId === department.id ? (
                                <>
                                    <label className={styles.inputLabel}>Nazwa Oddziału</label>
                                    <input
                                        type="text"
                                        value={editedDepartment?.department_name || ''}
                                        onChange={(e) => setEditedDepartment({ ...editedDepartment!, department_name: e.target.value })}
                                        className={styles.departmentInput}
                                        placeholder="Nazwa Oddziału"
                                    />
                                    <label className={styles.inputLabel}>Ulica</label>
                                    <input
                                        type="text"
                                        value={editedDepartment?.street || ''}
                                        onChange={(e) => setEditedDepartment({ ...editedDepartment!, street: e.target.value })}
                                        className={styles.departmentInput}
                                        placeholder="Ulica"
                                    />

                                    <label className={styles.inputLabel}>Numer budynku</label>
                                    <input
                                        type="text"
                                        value={editedDepartment?.building_number || ''}
                                        onChange={(e) => setEditedDepartment({ ...editedDepartment!, building_number: e.target.value })}
                                        className={styles.departmentInput}
                                        placeholder="Numer budynku"
                                    />

                                    <label className={styles.inputLabel}>Numer mieszkania</label>
                                    <input
                                        type="text"
                                        value={editedDepartment?.apartment || ''}
                                        onChange={(e) => setEditedDepartment({ ...editedDepartment!, apartment: e.target.value })}
                                        className={styles.departmentInput}
                                        placeholder="Numer mieszkania"
                                    />

                                    <label className={styles.inputLabel}>Miasto</label>
                                    <input
                                        type="text"
                                        value={editedDepartment?.city || ''}
                                        onChange={(e) => setEditedDepartment({ ...editedDepartment!, city: e.target.value })}
                                        className={styles.departmentInput}
                                        placeholder="Miasto"
                                    />

                                    <label className={styles.inputLabel}>Kod pocztowy</label>
                                    <input
                                        type="text"
                                        value={editedDepartment?.zip_code || ''}
                                        onChange={(e) => setEditedDepartment({ ...editedDepartment!, zip_code: e.target.value })}
                                        className={styles.departmentInput}
                                        placeholder="Kod pocztowy"
                                    />
                                </>
                            ) : (
                                <>
                                    <div className={styles.departmentNameContainer}>
                                        <label className={styles.departmentNameLabel}>{department.department_name}</label>
                                    </div>
                                    <div className={styles.departmentInfoRowContainer}>
                                        <div className={styles.departmentDataContainer}>
                                            <label className={`${styles.departmentCityLabel} ${styles.largeAll}`}>Miasto:</label>
                                            <label className={`${styles.departmentCityLabel} ${styles.comma}`}>{department.city}</label>
                                            <label className={styles.departmentCityLabel}>{department.zip_code}</label>
                                        </div>
                                        <div className={styles.departmentDataContainer}>
                                            <label className={`${styles.departmentCityLabel} ${styles.largeAll}`}>Ulica:</label>
                                            <label className={styles.departmentCityLabel}>{department.street}</label>
                                            <div className={styles.buildingNumbersContainer}>
                                                {department.apartment == "" ? (
                                                    <label className={styles.departmentCityLabel}>{department.building_number}</label>
                                                ) : (
                                                    <>
                                                        <label className={`${styles.departmentCityLabel} ${styles.slash}`}>{department.building_number}</label>
                                                        <label className={styles.departmentCityLabel}>{department.apartment}</label>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className={styles.editAndRemoveButtonContainer}>
                            {editingDepartmentId === department.id ? (
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
                                    <button className={styles.editButton} onClick={() => handleEditDepartment(department)}>
                                        <FontAwesomeIcon icon={faPen} />
                                    </button>
                                    <button className={styles.removeButton} onClick={() => handleDeleteDepartment(department.id)}>
                                        <FontAwesomeIcon icon={faMinus} />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.addDepartmentContainer}>
                <div className={styles.addItemContainer}>
                    <label className={styles.inputLabel}>Nazwa Oddziału</label>
                    <input
                        type="text"
                        placeholder="Wpisz nazwa oddziału"
                        value={newDepartment.department_name}
                        onChange={(e) => setNewDepartment({ ...newDepartment, department_name: e.target.value })}
                        className={styles.departmentNameInput}
                    />
                </div>
                <div className={styles.addItemContainer}>
                    <label className={styles.inputLabel}>Miasto</label>
                    <input
                        type="text"
                        placeholder="Wpisz miasto"
                        value={newDepartment.city}
                        onChange={(e) => setNewDepartment({ ...newDepartment, city: e.target.value })}
                        className={styles.departmentInput}
                    />
                </div>
                <div className={styles.addItemContainer}>
                    <label className={styles.inputLabel}>Kod pocztowy</label>
                    <input
                        type="text"
                        placeholder="Wpisz kod pocztowy"
                        value={newDepartment.zip_code}
                        onChange={(e) => setNewDepartment({ ...newDepartment, zip_code: e.target.value })}
                        className={styles.departmentInput}
                    />
                </div>
                <div className={styles.addItemContainer}>
                    <label className={styles.inputLabel}>Ulica</label>
                    <input
                        type="text"
                        placeholder="Wpisz ulicę"
                        value={newDepartment.street}
                        onChange={(e) => setNewDepartment({ ...newDepartment, street: e.target.value })}
                        className={styles.departmentInput}
                    />
                </div>
                <div className={styles.addItemContainer}>
                    <label className={styles.inputLabel}>Numer budynku</label>
                    <input
                        type="text"
                        placeholder="Wpisz numer budynku"
                        value={newDepartment.building_number}
                        onChange={(e) => setNewDepartment({ ...newDepartment, building_number: e.target.value })}
                        className={styles.departmentInput}
                    />
                </div>
                <div className={styles.addItemContainer}>
                    <label className={styles.inputLabel}>Numer mieszkania</label>
                    <input
                        type="text"
                        placeholder="Wpisz numer mieszkania"
                        value={newDepartment.apartment}
                        onChange={(e) => setNewDepartment({ ...newDepartment, apartment: e.target.value })}
                        className={styles.departmentInput}
                    />
                </div>
            </div>
            <div className={styles.buttonContainer}>
                <button onClick={handleAddDepartment} className={styles.addButton}>
                    <FontAwesomeIcon icon={faPlus} />
                </button>
            </div>
        </div>
    );
};
export default Departments;