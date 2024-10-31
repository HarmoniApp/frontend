"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faPlane, faChartBar, faUserMinus, faUserPen, faUserLock } from '@fortawesome/free-solid-svg-icons';
import DeleteEmployeePopUp from '@/components/employees/employeeData/deleteEmployee';
import EmployeeData from '@/components/types/employeeData';
import Department from '@/components/types/department';
import SupervisorDataSimple from '@/components/types/supervisorDataSimple';
import Flag from 'react-flagkit';
import styles from './main.module.scss';

const EmployeeDataComponent: React.FC<{ userId: number }> = ({ userId }) => {
  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [supervisorData, setSupervisorData] = useState<SupervisorDataSimple | null>(null);
  const [modalIsOpenDeleteEmployee, setModalDeleteEmployee] = useState(false);

  const router = useRouter();

  const openModalDeleteEmployee = () => setModalDeleteEmployee(true);
  const closeModalDeleteEmployee = () => setModalDeleteEmployee(false);

  useEffect(() => {
    if (userId) {
      const fetchDepartments = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/address/departments`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            },
          });
          const data = await response.json();
          setDepartments(data);
        } catch (error) {
          console.error('Error fetching departments:', error);
        }
      };

      const fetchEmployee = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/${userId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            },
          });
          const data = await response.json();
          setEmployee(data);
          if (data.supervisor_id) {
            fetchSupervisor(data.supervisor_id);
          }
        } catch (error) {
          console.error('Error fetching employee data:', error);
        }
      };

      const fetchSupervisor = async (supervisorId: number) => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/simple/${supervisorId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            },
          });
          const supervisorData = await response.json();
          setSupervisorData(supervisorData);
        } catch (error) {
          console.error('Error fetching supervisor data:', error);
        }
      };

      fetchDepartments();
      fetchEmployee();
    }
  }, [userId]);

  if (!employee) return <div>Loading...</div>;

  const department = departments.find(dept => dept.id === employee.work_address.id);

  const handleEditEmployee = () => {
    router.push(`/employees/user/${userId}/edit`);
  };

  return (
    <div className={styles.employeeDataContainerMain}>
      <div className={styles.rowButtonContainer}>
        <div className={styles.buttonContainer}>
          <button className={styles.chatButton}>
            <FontAwesomeIcon className={styles.buttonIcon} icon={faComments} />
            <p className={styles.buttonParagraph}>Chat</p>
          </button>
          <button className={styles.absencesButton}>
            <FontAwesomeIcon className={styles.buttonIcon} icon={faPlane} />
            <p className={styles.buttonParagraph}>Urolopy</p>
          </button>
          <button className={styles.statisticsButton}>
            <FontAwesomeIcon className={styles.buttonIcon} icon={faChartBar} />
            <p className={styles.buttonParagraph}>Statystki</p>
          </button>
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.editButton} onClick={handleEditEmployee}>
            <FontAwesomeIcon className={styles.buttonIcon} icon={faUserPen} />
            <p className={styles.buttonParagraph}>Edytuj</p>
          </button>
          <button className={styles.resetPasswordButton}>
            <FontAwesomeIcon className={styles.buttonIcon} icon={faUserLock} />
            <p className={styles.buttonParagraph}>Zresetuj hasło</p>
          </button>
          <button className={styles.deleteButton} onClick={openModalDeleteEmployee}>
            <FontAwesomeIcon className={styles.buttonIcon} icon={faUserMinus} />
            <p className={styles.buttonParagraph}>Usuń</p>
          </button>
        </div>
      </div>

      <div className={styles.fullNameAndIdContainer}>
        <div className={styles.fullNameColumnContainer}>
          <div className={styles.firstNameContainer}>
            <p className={styles.firstNameParagraph}>Imię:</p>
            <p className={styles.firstNameDataParagraph}>{employee.firstname}</p>
          </div>
          <div className={styles.surnameContainer}>
            <p className={styles.surnameParagraph}>Nazwisko:</p>
            <p className={styles.surnameDataParagraph}>{employee.surname}</p>
          </div>
        </div>
        <div className={styles.employeeIdContainer}>
          <p className={styles.idParagraph}>ID pracownika:</p>
          <p className={styles.idDataParagraph}>{employee.employee_id}</p>
        </div>
      </div>

      <div className={styles.emplyeeDataContainer}>
        <div className={styles.columnContainer}>
          <label className={styles.residenceLabel}>
            <p className={styles.homeAdressParagraph}>Adres zamieszkania</p>
            <p className={styles.homeAdressDataParagraph}>ul. {employee.residence.street} {employee.residence.building_number} {employee.residence.apartment ? '/ ' + employee.residence.apartment : ''}, {employee.residence.city} {employee.residence.zip_code}</p>
          </label>
          <label className={styles.supervisorLabel}>
            <p className={styles.supervisorParagraph}>Przełożony</p>
            <p className={styles.supervisorDataParagraph}>{supervisorData ? `${supervisorData.firstname} ${supervisorData.surname}` : 'Loading...'}</p>
          </label>
          <label className={styles.phoneNumberLabel}>
            <p className={styles.phoneNumberParagraph}>Nr telefonu</p>
            <p className={styles.phoneNumberDataParagraph}>{employee.phone_number}</p>
          </label>
          <label className={styles.emailLabel}>
            <p className={styles.emailParagraph}>E-mail</p>
            <p className={styles.emailDataParagraph}>{employee.email}</p>
          </label>
        </div>
        <div className={styles.columnContainer}>
          <label className={styles.startContractDateLables}>
            <p className={styles.startContractDateParagraph}>Data zawarcia umowy</p>
            <p className={styles.startContractDateDataParagraph}>{employee.contract_signature}</p>
          </label>
          <label className={styles.endContractDateLables}>
            <p className={styles.endContractDateParagraph}>Data zakończenia sie umowy</p>
            <p className={styles.endContractDateDataParagraph}>{employee.contract_expiration}</p>
          </label>
          <label className={styles.contractTypeLabel}>
            <p className={styles.contractTypeParagraph}>Typ umowy</p>
            <p className={styles.contractTypeDataParagraph}>{employee.contract_type.name}</p>
          </label>
          <label className={styles.departmentLabel}>
            <p className={styles.departmentParagraph}>Oddział</p>
            <p className={styles.departmentDataParagraph}>{department ? department.departmentName : 'We do not have a branch under this name. Error!'}</p>
          </label>
        </div>
      </div>

      <div className={styles.roleAndLanguagesContainer}>
        <div className={styles.columnContainer}>
          <p className={styles.roleParagraph}>Role przypisane do pracownika</p>
          <div className={styles.roleContainer}>
            {employee.roles.map((role) => (
              <label key={role.id} className={styles.roleLabel}>
                <span>{role.name}</span>
              </label>
            ))}
          </div>
        </div>
        <div className={styles.columnContainer}>
          <p className={styles.languageParagraph}>Ten pracownik posługuję się tymi językami</p>
          <div className={styles.languagesContainer}>
            {employee.languages.map((language) => (
              <label key={language.id} className={styles.languageLabel}>
                <span className={styles.languageName}>{language.name}</span>
                <Flag className={styles.languageFlag} country={language.code.toUpperCase()} />
              </label>
            ))}
          </div>
        </div>
      </div>

      {modalIsOpenDeleteEmployee && (
        <div className={styles.modalOverlayDeleteEmployee}>
          <div className={styles.modalContentOfDeleteEmployee}>
            <DeleteEmployeePopUp
              userId={employee.id}
              firstName={employee.firstname}
              surname={employee.surname}
              onClose={closeModalDeleteEmployee}
            />
          </div>
        </div>
      )}
    </div>
  );
}
export default EmployeeDataComponent;