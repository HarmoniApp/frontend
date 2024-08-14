import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser } from '@fortawesome/free-solid-svg-icons'
import styles from './main.module.scss';

interface Role {
  id: number;
  name: string;
}

interface Contract {
  id: number;
  name: string;
}
interface Language {
  id: number;
  name: string;
}
interface Supervisor {
  id: number;
  firstname: string;
  surname: string;
  role: {
    id: number;
    name: string;
  }[];
  employeeId: string;
}
interface Department {
  id: number;
  departmentName: string;
}
const AddEmpPopUp = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

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

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/language')
      .then(response => response.json())
      .then(data => setLanguages(data))
      .catch(error => console.error('Error fetching languages:', error));
  }, []);

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/user/supervisor')
      .then(response => response.json())
      .then(data => setSupervisors(data))
      .catch(error => console.error('Error fetching supervisors:', error));
  }, []);

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/address/departments')
      .then(response => response.json())
      .then(data => setDepartments(data))
      .catch(error => console.error('Error fetching supervisors:', error));
  }, []);



  return (
    <div>
      <div className={styles.firtsCol}>
        <FontAwesomeIcon icon={faCircleUser} />
        <a>Edytuj zdjecie</a>
        <label>
          <p>Nie wymagane (Opcjonalne)</p>
          ID: <input name="id" />
        </label>
      </div>
      <div className={styles.secoundCol}>
        <label>
          IMIĘ: <input name="firstname" required />
        </label>
        <label>
          NAZWISKO: <input name="surname" required />
        </label>
        <label>
          E-MAIL: <input name="emial" required />
        </label>
        <label>
          NUMER TELEFONU: <input name="phoneNumber" required />
        </label>
      </div>
      <div className={styles.thirdCol}>
        <label>
          ULICA: <input name="homeAdress" required />
        </label>
        <label>
          NUMER BUDYNKU: <input name="building" required />
        </label>
        <label>
          MIESZKANIE: <input name="apartment" required />
        </label>
        <label>
          MIASTO: <input name="city" required />
        </label>
        <label>
          KOD POCZTOWY: <input name="postCode" required />
        </label>
        <label>
          LOGIN: <input name="login" required />
        </label>
      </div>
      <div className={styles.fourthCol}>
        <div className={styles.contractContainerMain}>
          <p>UMOWA:</p>
          <select name="contract" id="" required>
            <option value="" disabled>Wybierz umowe:</option>
            {contracts.map(contract => (
              <option key={contract.id} value={contract.id}>
                {contract.name}
              </option>
            ))}
          </select>
          <label>
            DATA ZAWARCIA: <input type='date' name="startDate" required />
          </label>
          <label>
            DATA ZAKOŃCZENIA: <input type='date' name="endDate" required />
          </label>
        </div>
        <div className={styles.supervisorContainerMain}>
          <p>PRZEŁOŻONY:</p>
          <select name="supervisor" id="" required>
            <option value="" disabled>Wybierz przełożonego:</option>
            {supervisors.map(supervisor => (
              <option key={supervisor.id} value={supervisor.employeeId}>
                {supervisor.firstname} {supervisor.surname} → {supervisor.role.map(role => role.name).join(', ')}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.departmentContainerMain}>
          <p>ODDZIAŁ:</p>
          <select name="department" id="" required>
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
                value={role.id}
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
                value={language.id}
              />
              {language.name}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AddEmpPopUp;
