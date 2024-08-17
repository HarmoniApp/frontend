"use client";
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser } from '@fortawesome/free-solid-svg-icons'
import Modal from 'react-modal';
import AddEmployeeConfirmationPopUp from '@/components/employees/addEmployee/addEmplyeeConfirmation';
import Role from '@/components/types/role';
import Contract from '@/components/types/contract';
import Language from '@/components/types/language';
import Supervisor from '@/components/types/supervisor';
import Department from '@/components/types/department';
import styles from './main.module.scss';

Modal.setAppElement('#root');

interface AddEmployeeProps {
  onClose: () => void;
  onRefreshData: () => void;
}

const AddEmployee: React.FC<AddEmployeeProps> = ({ onClose, onRefreshData }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [formData, setFormData] = useState({
    firstname: '',
    surname: '',
    email: '',
    residence: {
      city: '',
      street: '',
      apartment: '',
      zip_code: '',
      building_number: ''
    },
    roles: [] as { id: number }[],
    languages: [] as { id: number }[],
    contract_type: { id: 0 },
    contract_signature: '',
    contract_expiration: '',
    work_address: { id: 0 },
    supervisor_id: '',
    phone_number: '',
    employee_id: ''
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCountdown, setModalCountdown] = useState(10);

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/role')
      .then(response => response.json())
      .then(data => setRoles(data))
      .catch(error => console.error('Error fetching roles:', error));

    fetch('http://localhost:8080/api/v1/contract-type')
      .then(response => response.json())
      .then(data => setContracts(data))
      .catch(error => console.error('Error fetching contract-type:', error));

    fetch('http://localhost:8080/api/v1/language')
      .then(response => response.json())
      .then(data => setLanguages(data))
      .catch(error => console.error('Error fetching languages:', error));

    fetch('http://localhost:8080/api/v1/user/supervisor')
      .then(response => response.json())
      .then(data => setSupervisors(data))
      .catch(error => console.error('Error fetching supervisors:', error));

    fetch('http://localhost:8080/api/v1/address/departments')
      .then(response => response.json())
      .then(data => setDepartments(data))
      .catch(error => console.error('Error fetching departments:', error));
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch('http://localhost:8080/api/v1/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(data => {
        const userId = data.id;
        setIsModalOpen(true);
        onRefreshData();
        const countdownInterval = setInterval(() => {
          setModalCountdown(prev => {
            if (prev === 1) {
              clearInterval(countdownInterval);
              setIsModalOpen(false);
              onClose();
            }
            return prev - 1;
          });
        }, 1000);

        setEmployeeLink(`/employees/user/${userId}`);

      })
      .catch(error => {
        alert('Błąd podczas dodawania pracownika');
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'contract_type') {
      setFormData({
        ...formData,
        contract_type: { id: parseInt(value) }
      });
    } else if (name === 'work_address') {
      setFormData({
        ...formData,
        work_address: { id: parseInt(value) }
      });
    } else if (name.includes('residence.')) {
      const residenceField = name.split('.')[1];
      setFormData(prevFormData => ({
        ...prevFormData,
        residence: {
          ...prevFormData.residence,
          [residenceField]: value
        }
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
      if (checked) {
        setFormData({
          ...formData,
          roles: [...(formData.roles as { id: number }[]), { id: parseInt(value) }]
        });
      } else {
        setFormData({
          ...formData,
          roles: (formData.roles as { id: number }[]).filter(role => role.id !== parseInt(value))
        });
      }
    } else if (name === "languages") {
      if (checked) {
        setFormData({
          ...formData,
          languages: [...(formData.languages as { id: number }[]), { id: parseInt(value) }]
        });
      } else {
        setFormData({
          ...formData,
          languages: (formData.languages as { id: number }[]).filter(lang => lang.id !== parseInt(value))
        });
      }
    }
  };

  const [employeeLink, setEmployeeLink] = useState<string | null>(null);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className={styles.firtsCol}>
          <FontAwesomeIcon icon={faCircleUser} />
          <a>Edytuj zdjecie</a>
          <label>
            <p>Nie wymagane (Opcjonalne)</p>
            ID: <input name="employee_id" value={formData.employee_id} onChange={handleInputChange} />
          </label>
        </div>
        <div className={styles.secoundCol}>
          <label>
            IMIĘ: <input name="firstname" onChange={handleInputChange} required />
          </label>
          <label>
            NAZWISKO: <input name="surname" onChange={handleInputChange} required />
          </label>
          <label>
            E-MAIL: <input name="email" onChange={handleInputChange} required />
          </label>
          <label>
            NUMER TELEFONU: <input name="phone_number" onChange={handleInputChange} required />
          </label>
        </div>
        <div className={styles.thirdCol}>
          <label>
            ULICA: <input name="residence.street" onChange={handleInputChange} required />
          </label>
          <label>
            NUMER BUDYNKU: <input name="residence.building_number" onChange={handleInputChange} required />
          </label>
          <label>
            MIESZKANIE: <input name="residence.apartment" onChange={handleInputChange} />
          </label>
          <label>
            MIASTO: <input name="residence.city" onChange={handleInputChange} required />
          </label>
          <label>
            KOD POCZTOWY: <input name="residence.zip_code" onChange={handleInputChange} required />
          </label>
          <label>
            LOGIN: <input name="login" />
            {/*Waitng for login input */}
          </label>
        </div>
        <div className={styles.fourthCol}>
          <div className={styles.contractContainerMain}>
            <p>UMOWA:</p>
            <select name="contract_type" value={formData.contract_type.id === 0 ? '' : formData.contract_type.id} onChange={handleInputChange} required>
              <option value="" disabled>Wybierz umowe:</option>
              {contracts.map(contract => (
                <option key={contract.id} value={contract.id}>
                  {contract.name}
                </option>
              ))}
            </select>
            <label>
              DATA ZAWARCIA: <input type='date' name="contract_signature" onChange={handleInputChange} required />
            </label>
            <label>
              DATA ZAKOŃCZENIA: <input type='date' name="contract_expiration" onChange={handleInputChange} required />
            </label>
          </div>
          <div className={styles.supervisorContainerMain}>
            <p>PRZEŁOŻONY:</p>
            <select name="supervisor_id" value={formData.supervisor_id} onChange={handleInputChange}>
              <option value="" disabled>Wybierz przełożonego:</option>
              {supervisors.map(supervisor => (
                <option key={supervisor.id} value={supervisor.id}>
                  {supervisor.firstname} {supervisor.surname} → {supervisor.role.map(role => role.name).join(', ')}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.departmentContainerMain}>
            <p>ODDZIAŁ:</p>
            <select name="work_address" value={formData.work_address.id === 0 ? '' : formData.work_address.id} onChange={handleInputChange} required>
              <option value="" disabled>Wybierz oddział:</option>
              {departments.map(department => (
                <option key={department.id} value={department.id}>
                  {department.departmentName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles.fifthCol}>
          <div className={styles.roleContainerMain}>
            <p>ROLA:</p>
            {roles.map(role => (
              <label key={role.id} >
                <input
                  type="checkbox"
                  name="roles"
                  value={role.id}
                  onChange={handleCheckboxChange}
                />
                {role.name}
              </label>
            ))}
          </div>
          <div className={styles.languagesContainerMain}>
            <p>Języki:</p>
            {languages.map(language => (
              <label key={language.id} >
                <input
                  type="checkbox"
                  name="languages"
                  value={language.id}
                  onChange={handleCheckboxChange}
                />
                {language.name}
              </label>
            ))}
          </div>
        </div>
        <div>
          <button type="submit">Dodaj</button>
          <button type="button" onClick={onClose}>Cofnij</button>
        </div>
      </form>
      <Modal
        isOpen={isModalOpen}
        contentLabel="Employee Added"
        className={styles.modalContent}
        overlayClassName={styles.modalOverlay}
      >
        <AddEmployeeConfirmationPopUp
          firstname={formData.firstname}
          surname={formData.surname}
          employeeLink={employeeLink}
          modalCountdown={modalCountdown}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default AddEmployee;