"use client";
import React from 'react';
import { Department } from '@/components/types/department';
import Flag from 'react-flagkit';
import styles from './main.module.scss';
import NewPassword from './newPassword';
import LoadingSpinner from '@/components/loadingSpinner';
import ConfirmationPopUp from '@/components/confirmationPopUp';
import CustomButton from '@/components/customButton';
import { Tooltip } from 'primereact/tooltip';
import { useEmployeeData } from '@/hooks/employees/useEmployeeData';
import { wrapText } from '@/utils/wrapText';

interface EmployeeDataComponentProps {
  userId: number;
}

const EmployeeDataComponent: React.FC<EmployeeDataComponentProps> = ({ userId }) => {
  const {
    employee,
    departments,
    supervisorData,
    loading,
    modalIsOpenDeleteEmployee,
    modalNewPassword,
    newPassword,
    setModalDeleteEmployee,
    setModalNewPassword,
    handleEditEmployee,
    handleDeleteEmployee,
    handlePasswordResetSubmit,
  } = useEmployeeData(userId);

  if (!employee) return <LoadingSpinner wholeModal={false} />;

  const department = departments.find((dept: Department) => dept.id === employee.work_address.id);

  const goToChat = () => {
    //TODO: add link to chat
  };

  const isTruncatedDepartment = department
    ? wrapText(department.departmentName, 30) !== department.departmentName
    : false;
  const departmentElementId = `departmentName-${userId}`;

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
            <p className={styles.homeAdressDataParagraph}>
              ul. {employee.residence.street} {employee.residence.building_number} {employee.residence.apartment ? '/ ' + employee.residence.apartment : ''}, {employee.residence.city} {employee.residence.zip_code}
            </p>
          </label>
          <label className={styles.supervisorLabel}>
            <p className={styles.supervisorParagraph}>Przełożony</p>
            <p className={styles.supervisorDataParagraph}>
              {supervisorData ? `${supervisorData.firstname} ${supervisorData.surname}` : "Brak przypisanego przełożonego"}
            </p>
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
            <p className={styles.endContractDateParagraph}>Data zakończenia umowy</p>
            <p className={styles.endContractDateDataParagraph}>{employee.contract_expiration}</p>
          </label>
          <label className={styles.contractTypeLabel}>
            <p className={styles.contractTypeParagraph}>Typ umowy</p>
            <p className={styles.contractTypeDataParagraph}>{employee.contract_type.name}</p>
          </label>
          <label className={styles.departmentLabel}>
            <p className={styles.departmentParagraph}>Oddział</p>
            <p
              className={styles.departmentDataParagraph}
              data-pr-tooltip={department ? department.departmentName : 'Brak przypisanego oddziału'}
              data-pr-position="left"
              id={departmentElementId}
              style={{
                cursor: isTruncatedDepartment ? 'pointer' : 'default',
              }}
            >
              {department ? wrapText(department.departmentName, 30) : 'Brak przypisanego oddziału'}
            </p>
            {isTruncatedDepartment && (
              <Tooltip target={`#${departmentElementId}`} autoHide />
            )}
          </label>
        </div>
      </div>

      <div className={styles.roleAndLanguagesContainer}>
        <div className={styles.columnContainer}>
          <p className={styles.roleParagraph}>Role przypisane do pracownika</p>
          <div className={styles.roleContainer}>
            {employee.roles.map((role) => {
              const isTruncatedRole = wrapText(role.name, 18) !== role.name;
              const roleElementId = `roleName-${role.id}`;

              return (
                <label key={role.id} className={styles.roleLabel}>
                  <span
                    data-pr-tooltip={role.name}
                    data-pr-position="bottom"
                    id={roleElementId}
                    style={{
                      cursor: isTruncatedRole ? 'pointer' : 'default',
                    }}
                  >
                    {wrapText(role.name, 18)}
                  </span>
                  {isTruncatedRole && (
                    <Tooltip target={`#${roleElementId}`} autoHide />
                  )}
                </label>
              );
            })}
          </div>
        </div>
        <div className={styles.columnContainer}>
          <p className={styles.languageParagraph}>Ten pracownik posługuje się tymi językami</p>
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
            <ConfirmationPopUp
              action={handleDeleteEmployee}
              onClose={() => setModalDeleteEmployee(false)}
              description={`Usunąć użytkownika: ${employee.firstname} ${employee.surname}`}
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
              surname={employee.surname}
            />
          </div>
        </div>
      )}
      {loading && <LoadingSpinner />}
    </div>
  );
};
export default EmployeeDataComponent;