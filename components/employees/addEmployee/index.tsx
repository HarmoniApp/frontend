"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDeleteLeft, faCircleCheck, faSquareCaretDown } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import Flag from 'react-flagkit';
import AddEmployeeNotificationPopUp from '@/components/employees/addEmployee/addEmplyeeNotification';
import Role from '@/components/types/role';
import Contract from '@/components/types/contract';
import Language from '@/components/types/language';
import Supervisor from '@/components/types/supervisor';
import Department from '@/components/types/department';
import styles from './main.module.scss';

Modal.setAppElement('#root');

const languageAbbreviations: { [key: string]: string } = {
  Arabic: 'AE',
  Bengali: 'BD',
  English: 'GB',
  French: 'FR',
  German: 'DE',
  Hindi: 'IN',
  Italian: 'IT',
  Japanese: 'JP',
  Korean: 'KR',
  Mandarin: 'CN',
  Other: 'IL',
  Persian: 'IR',
  Polish: 'PL',
  Portuguese: 'PT',
  Russian: 'RU',
  Spanish: 'ES',
  Turkish: 'TR',
  Vietnamese: 'VN',
};

const AddEmployee: React.FC = () => {
  const router = useRouter();
  const onBack = () => {
    router.push('/employees')
  }
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

  if (modalCountdown == 0) onBack();

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
        const countdownInterval = setInterval(() => {
          setModalCountdown(prev => {
            if (prev === 1) {
              clearInterval(countdownInterval);
              setIsModalOpen(false);
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
    <div className={styles.addEmployeeContainerMain}>
      <form onSubmit={handleSubmit}>
        <div className={styles.rowContainerTop}>
          <div className={styles.columnContainer}>
            <label className={styles.essentialDataLabel}>ID (Opcjonalne)<input className={styles.formInput} name="employee_id" value={formData.employee_id} onChange={handleInputChange} placeholder='Wpisz ID' /></label>
            <label className={styles.essentialDataLabel}>Imię<input className={styles.formInput} name="firstname" onChange={handleInputChange} placeholder='Wpisz imię' required /></label>
            <label className={styles.essentialDataLabel}>Nazwisko<input className={styles.formInput} name="surname" onChange={handleInputChange} placeholder='Wpisz nazwisko' required /></label>
            <label className={styles.essentialDataLabel}>E-mail<input className={styles.formInput} name="email" onChange={handleInputChange} placeholder='Wpisz e-mail' required /></label>
            <label className={styles.essentialDataLabel}>Nr telefonu<input className={styles.formInput} name="phone_number" onChange={handleInputChange} placeholder='Wpisz numer telefonu' required /></label>
          </div>
          <div className={styles.columnContainer}>
            <label className={styles.residenceLabel}>Ulica<input className={styles.formInput} name="residence.street" onChange={handleInputChange} placeholder='Wpisz ulice' required /></label>
            <label className={styles.residenceLabel}>Numer budynku<input className={styles.formInput} name="residence.building_number" onChange={handleInputChange} placeholder='Wpisz numer budynku' required /></label>
            <label className={styles.residenceLabel}>Numer mieszkania<input className={styles.formInput} name="residence.apartment" onChange={handleInputChange} placeholder='Wpisz numer mieszkania' /></label>
            <label className={styles.residenceLabel}>Miasto<input className={styles.formInput} name="residence.city" onChange={handleInputChange} placeholder='Wpisz miasto' required /></label>
            <label className={styles.residenceLabel}>Kod pocztowy<input className={styles.formInput} name="residence.zip_code" onChange={handleInputChange} placeholder='Wpisz kod pocztowy' required /></label>
          </div>
          <div className={styles.columnContainer}>
            <label className={styles.contractDateLables}>Data zawarcia umowy<input className={`${styles.formInput} ${styles.pointer}`} type='date' name="contract_signature" onChange={handleInputChange} required /></label>
            <label className={styles.contractDateLables}>Data zakończenia umowy<input className={`${styles.formInput} ${styles.pointer}`} type='date' name="contract_expiration" onChange={handleInputChange} required /></label>
            <label className={styles.contractTypeLabel}>Rodzaj umowy
              <select className={`${styles.formInput} ${styles.formSelect} ${styles.pointer}`} name="contract_type" value={formData.contract_type.id === 0 ? '' : formData.contract_type.id} onChange={handleInputChange} required>
                <option className={styles.defaultOption} value="" disabled>Wybierz rodzaj umowy</option>
                {contracts.map(contract => (
                  <option key={contract.id} value={contract.id}>
                    {contract.name}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.supervisorLabel}>Przełożony
              <select className={`${styles.formInput} ${styles.formSelect} ${styles.pointer}`} name="supervisor_id" value={formData.supervisor_id} onChange={handleInputChange}>
                <option className={styles.defaultOption} value="" disabled>Wybierz przełożonego</option>
                {supervisors.map(supervisor => (
                  <option key={supervisor.id} value={supervisor.id}>
                    {supervisor.firstname} {supervisor.surname} → {supervisor.role.map(role => role.name).join(', ')}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.departmentLabel}>Oddział
              <select className={`${styles.formInput} ${styles.formSelect} ${styles.pointer}`} name="work_address" value={formData.work_address.id === 0 ? '' : formData.work_address.id} onChange={handleInputChange} required>
                <option className={styles.defaultOption} value="" disabled>Wybierz oddział</option>
                {departments.map(department => (
                  <option key={department.id} value={department.id}>
                    {department.departmentName}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
        <div className={styles.rowContainerMiddle}>
          <div className={styles.columnContainerMiddle}>
            <p className={styles.roleParagraph}>Wybierz role dla pracownika</p>
            <div className={styles.roleContainer}>
              {roles.map(role => (
                <label key={role.id} className={styles.roleLabel}>
                  <input className={styles.roleCheckbox} type="checkbox" name="roles" value={role.id} onChange={handleCheckboxChange} /> {role.name}
                </label>
              ))}
            </div>
          </div>
          <div className={styles.columnContainerMiddle}>
            <p className={styles.languageParagraph}>Wybierz języki dla pracownika</p>
            <div className={styles.languagesContainer}>
              {languages.map(language => (
                <label key={language.id} className={styles.languageLabel}>
                  <input className={styles.languageCheckbox} type="checkbox" name="languages" value={language.id} onChange={handleCheckboxChange} />
                  <span className={styles.languageCheckboxLabel}>{language.name}</span>
                  <Flag className={styles.languageFlag} country={languageAbbreviations[language.name]} />
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.rowContainerBottom}>
          <div className={styles.buttonContainer}>
            <button className={styles.backButton} type="button" onClick={onBack}><FontAwesomeIcon className={styles.buttonIcon} icon={faDeleteLeft} /><p className={styles.buttonParagraph}>Anuluj dodanie</p></button>
            <button className={styles.addButton} type="submit"><FontAwesomeIcon className={styles.buttonIcon} icon={faCircleCheck} /><p className={styles.buttonParagraph}>Zapisz pracownika</p></button>
          </div>
        </div>
      </form>
      <Modal
        isOpen={isModalOpen}
        contentLabel="Employee Added"
        className={styles.modalContentOfAddEmployee}
        overlayClassName={styles.modalOverlayOfAddEmployee}
      >
        <AddEmployeeNotificationPopUp
          firstname={formData.firstname}
          surname={formData.surname}
          employeeLink={employeeLink}
          modalCountdown={modalCountdown}
          onClose={() => {
            setIsModalOpen(false)
            onBack()
          }}
        />
      </Modal>
    </div>
  );
}
export default AddEmployee;