'use client';
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import EditEmployeeNotificationPopUp from '@/components/employees/employeeData/editEmployeeData/editEmployeeDataNotification';
import styles from './main.module.scss';
import { on } from 'events';

Modal.setAppElement('#root');

interface EmployeeData {
    id: number;
    firstname: string;
    surname: string;
    email: string;
    residence: {
        id: number;
        city: string;
        street: string;
        apartment: string;
        zip_code: string;
        building_number: string;
    };
    roles: {
        id: number;
        name: string;
    }[];
    languages: {
        id: number;
        name: string;
    }[];
    contract_type: {
        id: number;
        name: string;
    };
    contract_signature: string;
    contract_expiration: string;
    work_address: {
        id: number;
    };
    supervisor_id: number;
    phone_number: string;
    employee_id: string;
}

interface EditEmployeeDataProps {
    employee: EmployeeData;
    onCloseEdit: () => void;
    onEmployeeUpdate: () => void;
}
interface Contract {
    id: number;
    name: string;
}
interface Department {
    id: number;
    departmentName: string;
}
interface Supervisor {
    id: number;
    firstname: string;
    surname: string;
    role: {
        id: number;
        name: string;
    }[];
}
interface Role {
    id: number;
    name: string;
}
interface Language {
    id: number;
    name: string;
}
interface ChangedData {
    [key: string]: string | number | undefined | object;
}

const EditEmployeeDataPopUp: React.FC<EditEmployeeDataProps> = ({ employee, onCloseEdit, onEmployeeUpdate }) => {
    const [formData, setFormData] = useState<EmployeeData>(employee);
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [languages, setLanguages] = useState<Language[]>([]);

    const [modalIsOpenEditEmployeeNotification, setModalEditEmployeeNotification] = useState(false);
    const openModaEditEmployeeNotification = (changedData: ChangedData) => {
        setModalEditEmployeeNotification(true);
        setChangedData(changedData);
    }
    const closeModalEditEmployeeNotification = () => setModalEditEmployeeNotification(false);
    const [changedData, setChangedData] = useState<ChangedData>({});
    const getChangedData = (): ChangedData => {
        const changes: ChangedData = {};
      
        if (formData.firstname !== employee.firstname) changes.firstname = formData.firstname;
        if (formData.surname !== employee.surname) changes.surname = formData.surname;
        if (formData.email !== employee.email) changes.email = formData.email;
        if (formData.phone_number !== employee.phone_number) changes.phone_number = formData.phone_number;
        if (formData.employee_id !== employee.employee_id) changes.employee_id = formData.employee_id;
        if (formData.contract_signature !== employee.contract_signature) changes.contract_signature = formData.contract_signature;    
        if (formData.contract_expiration !== employee.contract_expiration) changes.contract_expiration = formData.contract_expiration;
        if (formData.work_address.id !== employee.work_address.id) changes.work_address = formData.work_address;
        if (formData.supervisor_id !== employee.supervisor_id) changes.supervisor_id = formData.supervisor_id;
        if (JSON.stringify(formData.residence) !== JSON.stringify(employee.residence)) {
          changes.residence = formData.residence;
        }
        if (JSON.stringify(formData.contract_type) !== JSON.stringify(employee.contract_type)) {
          changes.contract_type = formData.contract_type;
        }
        if (JSON.stringify(formData.roles) !== JSON.stringify(employee.roles)) {
          changes.roles = formData.roles;
        }
        if (JSON.stringify(formData.languages) !== JSON.stringify(employee.languages)) {
          changes.languages = formData.languages;
        }
      
        return changes;
      };
      
    useEffect(() => {
        fetch('http://localhost:8080/api/v1/contract-type')
            .then(response => response.json())
            .then(data => setContracts(data))
            .catch(error => console.error('Error fetching contracts:', error));

        fetch('http://localhost:8080/api/v1/address/departments')
            .then(response => response.json())
            .then(data => setDepartments(data))
            .catch(error => console.error('Error fetching departments:', error));

        fetch('http://localhost:8080/api/v1/user/supervisor')
            .then(response => response.json())
            .then(data => setSupervisors(data))
            .catch(error => console.error('Error fetching supervisors:', error));

        fetch('http://localhost:8080/api/v1/role')
            .then(response => response.json())
            .then(data => setRoles(data))
            .catch(error => console.error('Error fetching roles:', error));

        fetch('http://localhost:8080/api/v1/language')
            .then(response => response.json())
            .then(data => setLanguages(data))
            .catch(error => console.error('Error fetching languages:', error));
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name.includes('residence.')) {
            const residenceField = name.split('.')[1];
            setFormData(prevFormData => ({
                ...prevFormData,
                residence: {
                    ...prevFormData.residence,
                    [residenceField]: value
                }
            }));
        } else if (name === 'contract_type') {
            const selectedContract = contracts.find(contract => contract.id === parseInt(value));
            if (selectedContract) {
                setFormData(prevFormData => ({
                    ...prevFormData,
                    contract_type: { id: selectedContract.id, name: selectedContract.name }
                }));
            }
        } else if (name === 'work_address') {
            setFormData(prevFormData => ({
                ...prevFormData,
                work_address: { id: parseInt(value) }
            }));
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked } = e.target;

        if (name === "roles") {
            const selectedRole = roles.find(role => role.id === parseInt(value));

            if (selectedRole) {
                setFormData(prevFormData => ({
                    ...prevFormData,
                    roles: checked
                        ? [...prevFormData.roles, selectedRole]
                        : prevFormData.roles.filter(role => role.id !== selectedRole.id)
                }));
            }
        } else if (name === "languages") {
            const selectedLanguage = languages.find(language => language.id === parseInt(value));

            if (selectedLanguage) {
                setFormData(prevFormData => ({
                    ...prevFormData,
                    languages: checked
                        ? [...prevFormData.languages, selectedLanguage]
                        : prevFormData.languages.filter(lang => lang.id !== selectedLanguage.id)
                }));
            }
        }
    };

    const handleSave = () => {
        const dataToSend = {
            firstname: formData.firstname,
            surname: formData.surname,
            email: formData.email,
            residence: {
                city: formData.residence.city,
                street: formData.residence.street,
                apartment: formData.residence.apartment,
                zip_code: formData.residence.zip_code,
                building_number: formData.residence.building_number
            },
            roles: formData.roles,
            languages: formData.languages,
            contract_type: formData.contract_type,
            contract_signature: formData.contract_signature,
            contract_expiration: formData.contract_expiration,
            work_address: formData.work_address,
            supervisor_id: formData.supervisor_id,
            phone_number: formData.phone_number,
            employee_id: formData.employee_id
        };

        const changedData = getChangedData();
        fetch(`http://localhost:8080/api/v1/user/${employee.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        })
            .then(response => response.json())
            .then(data => {
                return fetch(`http://localhost:8080/api/v1/user/${employee.id}`);
            })
            .then(response => response.json())
            .then(updatedData => {
                onEmployeeUpdate();
                setChangedData(changedData);
                // onCloseEdit();
                openModaEditEmployeeNotification(changedData);
            })
            .catch(error => {
                alert('Failed to update employee data');
            });
    };

    return (
        <div className={styles.modalContent}>
            <h2>Edit Employee Data</h2>
            <div className={styles.formGroup}>
                <label>Employee Id:</label>
                <input name="employee_id" value={formData.employee_id} onChange={handleInputChange} />
            </div>
            <div className={styles.formGroup}>
                <label>First Name:</label>
                <input name="firstname" value={formData.firstname} onChange={handleInputChange} />
            </div>
            <div className={styles.formGroup}>
                <label>Surname:</label>
                <input name="surname" value={formData.surname} onChange={handleInputChange} />
            </div>
            <div className={styles.formGroup}>
                <label>Email:</label>
                <input name="email" value={formData.email} onChange={handleInputChange} />
            </div>
            <div className={styles.formGroup}>
                <label>Phone Number:</label>
                <input name="phone_number" value={formData.phone_number} onChange={handleInputChange} />
            </div>

            <h3>Residence</h3>
            <div className={styles.formGroup}>
                <label>Street:</label>
                <input name="residence.street" value={formData.residence.street} onChange={handleInputChange} />
            </div>
            <div className={styles.formGroup}>
                <label>Building Number:</label>
                <input name="residence.building_number" value={formData.residence.building_number} onChange={handleInputChange} />
            </div>
            <div className={styles.formGroup}>
                <label>Apartment:</label>
                <input name="residence.apartment" value={formData.residence.apartment} onChange={handleInputChange} />
            </div>
            <div className={styles.formGroup}>
                <label>City:</label>
                <input name="residence.city" value={formData.residence.city} onChange={handleInputChange} />
            </div>
            <div className={styles.formGroup}>
                <label>Zip Code:</label>
                <input name="residence.zip_code" value={formData.residence.zip_code} onChange={handleInputChange} />
            </div>

            <h4>Contract</h4>
            <div className={styles.formGroup}>
                <label>Contract Type:</label>
                <select name="contract_type" value={formData.contract_type.id} onChange={handleInputChange}>
                    {contracts.map(contract => (
                        <option key={contract.id} value={contract.id}>
                            {contract.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className={styles.formGroup}>
                <label>Departments:</label>
                <select name="work_address" value={formData.work_address.id} onChange={handleInputChange}>
                    {departments.map(department => (
                        <option key={department.id} value={department.id}>
                            {department.departmentName}
                        </option>
                    ))}
                </select>
            </div>
            <div className={styles.formGroup}>
                <label>Supervisor:</label>
                <select name="supervisor_id" value={formData.supervisor_id} onChange={handleInputChange}>
                    {supervisors.map(supervisor => (
                        <option key={supervisor.id} value={supervisor.id}>
                            {supervisor.firstname} {supervisor.surname} → {supervisor.role.map(role => role.name).join(', ')}
                        </option>
                    ))}
                </select>
            </div>
            <div className={styles.formGroup}>
                <label>Contract signature:</label>
                <input type="date" name="contract_signature" value={formData.contract_signature} onChange={handleInputChange} />
            </div>
            <div className={styles.formGroup}>
                <label>Contract expiration:</label>
                <input type="date" name="contract_expiration" value={formData.contract_expiration} onChange={handleInputChange} />
            </div>

            <h4>Roles</h4>
            <div className={styles.formGroup}>
                {roles.map(role => (
                    <label key={role.id} >
                        <input
                            type="checkbox"
                            name="roles"
                            value={role.id}
                            checked={formData.roles.some(userRole => userRole.id === role.id)}
                            onChange={handleCheckboxChange}
                        />
                        {role.name}
                    </label>
                ))}
            </div>
            <h4>Languages</h4>
            <div className={styles.formGroup}>
                {languages.map(language => (
                    <label key={language.id} >
                        <input
                            type="checkbox"
                            name="languages"
                            value={language.id}
                            checked={formData.languages.some(userLang => userLang.id === language.id)}
                            onChange={handleCheckboxChange}
                        />
                        {language.name}
                    </label>
                ))}
            </div>

            <div className={styles.modalActions}>
                <button onClick={handleSave}>Save</button>
                <button onClick={onCloseEdit}>Cancel</button>
            </div>
            <Modal
                isOpen={modalIsOpenEditEmployeeNotification}
                contentLabel="Edit Employee Notification"
                className={styles.modalContent}
                overlayClassName={styles.modalOverlay}
            >
                <EditEmployeeNotificationPopUp
                    onClose={closeModalEditEmployeeNotification}
                    firstName={formData.firstname}
                    surname={formData.surname}
                    changedData={changedData}
                    onCloseEditData={onCloseEdit}
                />
            </Modal>

        </div>
    );
};

export default EditEmployeeDataPopUp;