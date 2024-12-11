"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProgressSpinner } from 'primereact/progressspinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faUserMinus, faUserPen, faUserLock } from '@fortawesome/free-solid-svg-icons';
import DeleteEmployeePopUp from '@/components/employees/employeeData/deleteEmployee';
import EmployeeData from '@/components/types/employeeData';
import Department from '@/components/types/department';
import Flag from 'react-flagkit';
import styles from './main.module.scss';
import NewPassword from './newPassword';
import { Message } from 'primereact/message';
import { fetchCsrfToken } from '@/services/csrfService';
import { fetchDepartments } from '@/services/departmentService';
import Supervisor from '@/components/types/supervisor';
import { fetchSimpleUser } from '@/services/userService';
import LoadingSpinner from '@/components/loadingSpinner';

const EmployeeDataComponent: React.FC<{ userId: number }> = ({ userId }) => {
  const [employee, setEmployee] = useState<EmployeeData>();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [supervisorData, setSupervisorData] = useState<Supervisor | null>(null);
  const [modalIsOpenDeleteEmployee, setModalDeleteEmployee] = useState(false);
  const [modalIsOpenLoadning, setModalIsOpenLoadning] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [modalNewPassword, setModalNewPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const openModalDeleteEmployee = () => setModalDeleteEmployee(true);
  const closeModalDeleteEmployee = () => setModalDeleteEmployee(false);

  useEffect(() => {
    if (userId) {
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
            fetchSimpleUser(undefined, data.supervisor_id, setSupervisorData);
          }
        } catch (error) {
          console.error('Error fetching employee data:', error);
          setError('Błąd podczas pobierania pracownika');
        }
      };

      const loadData = async () => {
        await fetchDepartments(setDepartments, setModalIsOpenLoadning);
        await fetchEmployee();
      }

      loadData();
    }
  }, [userId]);

  if (!employee) return <LoadingSpinner wholeModal={false}/>;

  const department = departments.find(dept => dept.id === employee.work_address.id);

  const handleEditEmployee = () => {
    router.push(`/employees/user/${userId}/edit`);
  };

  const handlePasswordResetSubmit = async () => {
    setModalIsOpenLoadning(true);
    try {
      const tokenXSRF = await fetchCsrfToken();

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/${employee.id}/generatePassword`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
          'X-XSRF-TOKEN': tokenXSRF,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        console.error('Error reseting password, response not OK');
        throw new Error('Error reseting password');
      }
      const result = await response.text();
      setNewPassword(result);
      setModalIsOpenLoadning(false);
      setModalNewPassword(true);
    } catch (error) {
      console.error('Błąd podczas resetowania hasła: ', error);
      setError('Błąd podczas resetowania hasła');
    }
  };

  return (
    <div className={styles.employeeDataContainerMain}>
      <div className={styles.rowButtonContainer}>
        <div className={styles.buttonContainer}>
          <button className={styles.chatButton}>
            <FontAwesomeIcon className={styles.buttonIcon} icon={faComments} />
            <p className={styles.buttonParagraph}>Chat</p>
          </button>
          <button className={styles.resetPasswordButton} onClick={handlePasswordResetSubmit}>
            <FontAwesomeIcon className={styles.buttonIcon} icon={faUserLock} />
            <p className={styles.buttonParagraph}>Zresetuj hasło</p>
          </button>
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.editButton} onClick={handleEditEmployee}>
            <FontAwesomeIcon className={styles.buttonIcon} icon={faUserPen} />
            <p className={styles.buttonParagraph}>Edytuj</p>
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
            <p className={styles.supervisorDataParagraph}>{supervisorData ? `${supervisorData.firstname} ${supervisorData.surname}` : <LoadingSpinner wholeModal={false}/>}</p>
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
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <DeleteEmployeePopUp
              userId={employee.id}
              firstName={employee.firstname}
              surname={employee.surname}
              onClose={closeModalDeleteEmployee}
            />
          </div>
        </div>
      )}

      {modalNewPassword && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <NewPassword
              newPassword={newPassword}
              onClose={() => setModalNewPassword(false)}
              firstName={employee.firstname}
              surname={employee.surname} />
          </div>
        </div>
      )}
      {error && <Message severity="error" text={`Error: ${error}`} className={styles.errorMessageComponent} />}

      {modalIsOpenLoadning && (
        // <div className={styles.loadingModalOverlay}>
        //   <div className={styles.loadingModalContent}>
        //     <div className={styles.spinnerContainer}><ProgressSpinner /></div>
        //   </div>
        // </div>
        <LoadingSpinner />
      )}
    </div>
  );
}
export default EmployeeDataComponent;