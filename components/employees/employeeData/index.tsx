"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EmployeeData from '@/components/types/employeeData';
import Department from '@/components/types/department';
import Flag from 'react-flagkit';
import styles from './main.module.scss';
import NewPassword from './newPassword';
import { fetchDepartments } from '@/services/departmentService';
import Supervisor from '@/components/types/supervisor';
import { deleteUser, fetchUserData } from '@/services/userService';
import LoadingSpinner from '@/components/loadingSpinner';
import { patchResetPassword } from '@/services/passwordService';
import ConfirmationPopUp from '@/components/confirmationPopUp';
import CustomButton from '@/components/customButton';

const EmployeeDataComponent: React.FC<{ userId: number }> = ({ userId }) => {
  const [employee, setEmployee] = useState<EmployeeData | null>();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [supervisorData, setSupervisorData] = useState<Supervisor | null>(null);
  const [modalIsOpenDeleteEmployee, setModalDeleteEmployee] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [modalNewPassword, setModalNewPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (userId) {
      const loadData = async () => {
        await fetchDepartments(setDepartments);
        await fetchUserData(userId, setEmployee, setSupervisorData)
      }

      loadData();
    }
  }, [userId]);

  if (!employee) return <LoadingSpinner wholeModal={false} />;

  const department = departments.find(dept => dept.id === employee.work_address.id);

  const handleEditEmployee = () => {
    router.push(`/employees/user/${userId}/edit`);
  };

  const handleDeleteEmployee = async () => {
    try {
      setModalDeleteEmployee(false)
      router.push("/employees");
      await deleteUser(userId);
    } catch (error) {
      console.error('Error deleting employee:', error)
    }
  };

  const handlePasswordResetSubmit = async () => {
    setLoading(true);
    try {
      await patchResetPassword(userId, setNewPassword);
      setModalNewPassword(true);
    } catch (error) {
      console.error('Error while reseting password: ', error);
    } finally {
      setLoading(false);
    }
  };

  const goToChat = () => {

  }

  return (
    <div className={styles.employeeDataContainerMain}>
      <div className={styles.rowButtonContainer}>
        <div className={styles.buttonContainer}>
          <CustomButton icon="comments" writing="Chat" action={goToChat} />
          <CustomButton icon="userLock" writing="Zresetuj hasło" action={handlePasswordResetSubmit} />
        </div>
        <div className={styles.buttonContainer}>
          <CustomButton icon="userPen" writing="Edytuj" action={handleEditEmployee} />
          <CustomButton icon="userMinus" writing="Usuń" action={() => setModalDeleteEmployee(true)} />
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
            <p className={styles.supervisorDataParagraph}>{supervisorData ? `${supervisorData.firstname} ${supervisorData.surname}` : "Brak przypisanego przełożonego"}</p>
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
            <p className={styles.departmentDataParagraph}>{department ? department.departmentName : 'Brak przypisanego oddziału'}</p>
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
            <ConfirmationPopUp action={handleDeleteEmployee} onClose={() => setModalDeleteEmployee(false)} description={`Usunąć użytkownika: ${employee.firstname} ${employee.surname}`} />
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
      {loading && <LoadingSpinner />}
    </div>
  );
}
export default EmployeeDataComponent;