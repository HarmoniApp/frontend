'use client';
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import EditEmployeeNotificationPopUp from '@/components/employees/employeeData/editEmployeeData/editEmployeeDataNotification';
import EmployeeDataWorkAdressOnlyId from '@/components/types/employeeDataWorkAdressOnlyId';
import Department from '@/components/types/department';
import Supervisor from '@/components/types/supervisor';
import Role from '@/components/types/role';
import Language from '@/components/types/language';
import Contract from '@/components/types/contract';

import styles from './main.module.scss';

Modal.setAppElement('#root');

interface EditEmployeeDataProps {
    employee: EmployeeDataWorkAdressOnlyId;
    onCloseEdit: () => void;
}
interface ChangedData {
    [key: string]: string | number | undefined | object;
}

const EditEmployeeDataPopUp: React.FC<EditEmployeeDataProps> = ({ employee, onCloseEdit }) => {
    const [formData, setFormData] = useState<EmployeeDataWorkAdressOnlyId>(employee);
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [departmentMap, setDepartmentMap] = useState<{ [key: number]: string }>({});
    const [supervisorMap, setSupervisorMap] = useState<{ [key: number]: string }>({});
    const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [languages, setLanguages] = useState<Language[]>([]);

    const [modalIsOpenEditEmployeeNotification, setModalEditEmployeeNotification] = useState(false);
    const openModaEditEmployeeNotification = (changedData: ChangedData) => {
        setModalEditEmployeeNotification(true);
        setChangedData(changedData);
    }
    const closeModalEditEmployeeNotification = () => {
        setModalEditEmployeeNotification(false);
    };

    const [changedData, setChangedData] = useState<ChangedData>({});

    useEffect(() => {
        fetch('http://localhost:8080/api/v1/contract-type')
            .then(response => response.json())
            .then(data => setContracts(data))
            .catch(error => console.error('Error fetching contracts:', error));

        fetch('http://localhost:8080/api/v1/address/departments')
            .then(response => response.json())
            .then(data => {
                setDepartments(data);
                const deptMap: { [key: number]: string } = {};
                data.forEach((dept: Department) => {
                    deptMap[dept.id] = dept.departmentName;
                });
                setDepartmentMap(deptMap);
            })
            .catch(error => console.error('Error fetching departments:', error));

        fetch('http://localhost:8080/api/v1/user/supervisor')
            .then(response => response.json())
            .then(data => {
                setSupervisors(data);
                const supervisorMap: { [key: number]: string } = {};
                data.forEach((supervisor: Supervisor) => {
                    supervisorMap[supervisor.id] = `${supervisor.firstname} ${supervisor.surname}`;
                });
                setSupervisorMap(supervisorMap);
            })
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

    const getChangedData = (): ChangedData => {
        const changes: ChangedData = {};

        if (formData.firstname !== employee.firstname) changes.firstname = formData.firstname;
        if (formData.surname !== employee.surname) changes.surname = formData.surname;
        if (formData.email !== employee.email) changes.email = formData.email;
        if (formData.phone_number !== employee.phone_number) changes.phone_number = formData.phone_number;
        if (formData.employee_id !== employee.employee_id) changes.employee_id = formData.employee_id;
        if (formData.contract_signature !== employee.contract_signature) changes.contract_signature = formData.contract_signature;
        if (formData.contract_expiration !== employee.contract_expiration) changes.contract_expiration = formData.contract_expiration;

        if (formData.work_address.id !== employee.work_address.id) {
            const departmentName = departmentMap[formData.work_address.id];
            changes.work_address = departmentName ? departmentName : 'Unknown Department';
        }

        if (formData.supervisor_id !== employee.supervisor_id) {
            const selectedSupervisor = supervisorMap[formData.supervisor_id];
            changes.supervisor = selectedSupervisor ? selectedSupervisor : 'Unknown Supervisor';
        }

        if (formData.residence.street !== employee.residence.street) changes.residenceStreet = formData.residence.street;
        if (formData.residence.building_number !== employee.residence.building_number) changes.residenceBuildingNumber = formData.residence.building_number;
        if (formData.residence.apartment !== employee.residence.apartment) changes.residenceApartment = formData.residence.apartment;
        if (formData.residence.city !== employee.residence.city) changes.residenceCity = formData.residence.city;
        if (formData.residence.zip_code !== employee.residence.zip_code) changes.residenceZipCode = formData.residence.zip_code;

        if (formData.contract_type.name !== employee.contract_type.name) changes.contract_type = formData.contract_type.name;

        if (JSON.stringify(formData.roles.map(role => role.name)) !== JSON.stringify(employee.roles.map(role => role.name))) {
            changes.roles = formData.roles.map(role => role.name).join(', ');
        }

        if (JSON.stringify(formData.languages.map(lang => lang.name)) !== JSON.stringify(employee.languages.map(lang => lang.name))) {
            changes.languages = formData.languages.map(lang => lang.name).join(', ');
        }

        return changes;
    };

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
                setChangedData(changedData);
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
                    changedData={changedData}
                    onCloseEditData={onCloseEdit}
                />
            </Modal>

        </div>
    );
};
export default EditEmployeeDataPopUp;