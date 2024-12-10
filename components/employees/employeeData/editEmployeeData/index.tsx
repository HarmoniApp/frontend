"use client";
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDeleteLeft, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import Flag from 'react-flagkit';
import EditEmployeeNotificationPopUp from '@/components/employees/employeeData/editEmployeeData/editEmployeeDataNotification';
import EmployeeDataWorkAdressOnlyId from '@/components/types/employeeDataWorkAdressOnlyId';
import Role from '@/components/types/role';
import Contract from '@/components/types/contract';
import Language from '@/components/types/language';
import Supervisor from '@/components/types/supervisor';
import Department from '@/components/types/department';
import { fetchLanguages } from "@/services/languageService";
import { fetchRoles } from "@/services/roleService"
import { Message } from 'primereact/message';
import styles from './main.module.scss';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { ProgressSpinner } from 'primereact/progressspinner';
import * as Yup from 'yup';
import classNames from 'classnames';
import { fetchCsrfToken } from '@/services/csrfService';
import { fetchContracts } from '@/services/contractService';
import { fetchDepartments } from '@/services/departmentService';
import { fetchSupervisors } from '@/services/userService';
import LoadingSpinner from '@/components/loadingSpinner';

interface EditEmployeeDataProps {
  employee: EmployeeDataWorkAdressOnlyId;
  onCloseEdit: () => void;
}

interface ChangedData {
  [key: string]: string | number | undefined | object;
}

const EditEmployeeDataPopUp: React.FC<EditEmployeeDataProps> = ({ employee, onCloseEdit }) => {

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [supervisorMap, setSupervisorMap] = useState<{ [key: number]: string }>({});
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [changedData, setChangedData] = useState<ChangedData>({});
  const [modalIsOpenLoadning, setModalIsOpenLoadning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllSupervisors = async () => {
    try {
      await fetchSupervisors(setSupervisors)

      const supervisorMap: { [key: number]: string } = {};
      supervisors.forEach((supervisor: Supervisor) => {
        supervisorMap[supervisor.id] = `${supervisor.firstname} ${supervisor.surname}`;
      });
      setSupervisorMap(supervisorMap);
    } catch (error) {
      console.error('Error fetching supervisors:', error);
      setError('Błąd podczas pobierania przełoonych');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchContracts(setContracts, setModalIsOpenLoadning);
      await fetchDepartments(setDepartments, setModalIsOpenLoadning);
      await fetchAllSupervisors();
      await fetchRoles(setRoles, setModalIsOpenLoadning);
      await fetchLanguages(setLanguages, setError, setModalIsOpenLoadning);
    };

    loadData();
  }, []);

  const findInvalidCharacters = (value: string, allowedPattern: RegExp): string[] => {
    const invalidChars = value.split('').filter(char => !allowedPattern.test(char));
    return Array.from(new Set(invalidChars));
  };

  const validationSchema = Yup.object({
    employee_id: Yup.string()
      .min(1, 'Min 1 znaków')
      .max(20, 'Max 20 znaków')
      .required('Pole wymagane')
      .test('no-invalid-chars', function (value) {
        const invalidChars = findInvalidCharacters(value || '', /^[a-zA-Z0-9-]*$/);
        return invalidChars.length === 0
          ? true
          : this.createError({ message: `Niedozwolone znak: ${invalidChars.join(', ')}` });
      }),
    firstname: Yup.string()
      .min(2, 'Min 2 znaków')
      .max(50, 'Max 50 znaków')
      .required('Pole wymagane')
      .test('no-invalid-chars', function (value) {
        const invalidChars = findInvalidCharacters(value || '', /^[a-zA-Z]*$/);
        return invalidChars.length === 0
          ? true
          : this.createError({ message: `Niedozwolone znak: ${invalidChars.join(', ')}` });
      }),
    surname: Yup.string()
      .min(2, 'Min 2 znaków')
      .max(50, 'Max 50 znaków')
      .required('Pole wymagane')
      .test('no-invalid-chars', function (value) {
        const invalidChars = findInvalidCharacters(value || '', /^[a-zA-Z -]*$/);
        return invalidChars.length === 0
          ? true
          : this.createError({ message: `Niedozwolone znak: ${invalidChars.join(', ')}` });
      }),
    email: Yup.string()
      .email('Niepoprawny email')
      .required('Pole wymagane')
      .test('no-invalid-chars', function (value) {
        const invalidChars = findInvalidCharacters(value || '', /^[a-zA-Z0-9@.-]*$/);
        return invalidChars.length === 0
          ? true
          : this.createError({ message: `Niedozwolone znak: ${invalidChars.join(', ')}` });
      })
      .test('no-consecutive-special-chars', 'Niedozwolone znaki', function (value) {
        const invalidPattern = /(\.\.|--|@@)/;
        return !invalidPattern.test(value || '');
      }),
    phone_number: Yup.string()
      .min(9, 'Min 9 znaków')
      .max(15, 'Max 15 znaków')
      .required('Pole wymagane')
      .test('no-invalid-chars', function (value) {
        const invalidChars = findInvalidCharacters(value || '', /^[0-9+ ]*$/);
        return invalidChars.length === 0
          ? true
          : this.createError({ message: `Niedozwolone znak: ${invalidChars.join(', ')}` });
      }),
    residence: Yup.object().shape({
      city: Yup.string()
        .min(1, 'Min 1 znaków')
        .max(50, 'Max 50 znaków')
        .required('Pole wymagane')
        .test('no-invalid-chars', function (value) {
          const invalidChars = findInvalidCharacters(value || '', /^[a-zA-Z0-9\s]*$/);
          return invalidChars.length === 0
            ? true
            : this.createError({ message: `Niedozwolone znak: ${invalidChars.join(', ')}` });
        }),
      street: Yup.string()
        .min(1, 'Min 1 znaków')
        .max(100, 'Max 100 znaków')
        .required('Pole wymagane')
        .test('no-invalid-chars', function (value) {
          const invalidChars = findInvalidCharacters(value || '', /^[a-zA-Z0-9\s]*$/);
          return invalidChars.length === 0
            ? true
            : this.createError({ message: `Niedozwolone znak: ${invalidChars.join(', ')}` });
        }),
      building_number: Yup.string()
        .min(1, 'Min 1 znaków')
        .max(10, 'Max 10 znaków')
        .required('Pole wymagane')
        .test('no-invalid-chars', function (value) {
          const invalidChars = findInvalidCharacters(value || '', /^[a-zA-Z0-9]*$/);
          return invalidChars.length === 0
            ? true
            : this.createError({ message: `Niedozwolone znak: ${invalidChars.join(', ')}` });
        }),
      apartment: Yup.string()
        .min(1, 'Min 1 znaków')
        .max(10, 'Max 10 znaków')
        .test('no-invalid-chars', function (value) {
          const invalidChars = findInvalidCharacters(value || '', /^[a-zA-Z0-9]*$/);
          return invalidChars.length === 0
            ? true
            : this.createError({ message: `Niedozwolone znak: ${invalidChars.join(', ')}` });
        }),
      zip_code: Yup.string()
        .min(5, 'Min 5 znaków')
        .max(10, 'Max 10 znaków')
        .required('Pole wymagane')
        .test('no-invalid-chars', function (value) {
          const invalidChars = findInvalidCharacters(value || '', /^[0-9-]*$/);
          return invalidChars.length === 0
            ? true
            : this.createError({ message: `Niedozwolone znak: ${invalidChars.join(', ')}` });
        }),
    }),
    contract_signature: Yup.date()
      .required('Pole wymagane')
      .test('is-before-expiration', 'Brak chronologii', function (value) {
        const { contract_expiration } = this.parent;
        return contract_expiration ? new Date(value) <= new Date(contract_expiration) : true;
      }),
    contract_expiration: Yup.date()
      .required('Pole wymagane')
      .test('is-after-signature', 'Brak chronologii', function (value) {
        const { contract_signature } = this.parent;
        return contract_signature ? new Date(value) >= new Date(contract_signature) : true;
      }),
    contract_type: Yup.object().shape({
      id: Yup.number().min(1, 'Pole wymagane').required('Pole wymagane'),
    }),
    supervisor_id: Yup.string()
      .required('Pole wymagane')
      .test('no-invalid-chars', function (value) {
        const invalidChars = findInvalidCharacters(value || '', /^[a-zA-Z0-9]*$/);
        return invalidChars.length === 0
          ? true
          : this.createError({ message: `Niedozwolone znak: ${invalidChars.join(', ')}` });
      }),
    work_address: Yup.object().shape({
      id: Yup.number().min(1, 'Pole wymagane').required('Pole wymagane'),
    }),
    roles: Yup.array().min(1, 'Przynajmniej jedna rola jest wymagana'),
    languages: Yup.array().min(1, 'Przynajmniej jeden język jest wymagany'),
  });

  const getChangedData = (values: typeof initialValues): ChangedData => {
    const changes: ChangedData = {};

    if (values.firstname !== employee.firstname) changes.firstname = values.firstname;
    if (values.surname !== employee.surname) changes.surname = values.surname;
    if (values.email !== employee.email) changes.email = values.email;
    if (values.phone_number !== employee.phone_number) changes.phone_number = values.phone_number;
    if (values.employee_id !== employee.employee_id) changes.employee_id = values.employee_id;
    if (values.contract_signature !== employee.contract_signature) changes.contract_signature = values.contract_signature;
    if (values.contract_expiration !== employee.contract_expiration) changes.contract_expiration = values.contract_expiration;

    if (values.work_address.id !== employee.work_address.id) {
      const departmentName = departments[values.work_address.id];
      changes.work_address = departmentName ? departmentName : 'Unknown Department';
    }

    if (parseInt(values.supervisor_id) !== employee.supervisor_id) {
      const selectedSupervisor = supervisorMap[parseInt(values.supervisor_id)];
      changes.supervisor = selectedSupervisor ? selectedSupervisor : 'Unknown Supervisor';
    }

    if (values.residence.street !== employee.residence.street) changes.residenceStreet = values.residence.street;
    if (values.residence.building_number !== employee.residence.building_number) changes.residenceBuildingNumber = values.residence.building_number;
    if (values.residence.apartment !== employee.residence.apartment) changes.residenceApartment = values.residence.apartment;
    if (values.residence.city !== employee.residence.city) changes.residenceCity = values.residence.city;
    if (values.residence.zip_code !== employee.residence.zip_code) changes.residenceZipCode = values.residence.zip_code;

    if (values.contract_type.id !== employee.contract_type.id) {
      const selectedContractType = contracts.find(contract => contract.id === values.contract_type.id);
      changes.contract_type = selectedContractType ? selectedContractType.name : 'Unknown Contract Type';
    }

    if (JSON.stringify(values.roles.map(role => role.id)) !== JSON.stringify(employee.roles.map(role => role.id))) {
      changes.roles = values.roles.map(role => roles.find(r => r.id === role.id)?.name).filter(name => name).join(', ');
    }

    if (JSON.stringify(values.languages.map(lang => lang.id)) !== JSON.stringify(employee.languages.map(lang => lang.id))) {
      changes.languages = values.languages.map(lang => languages.find(l => l.id === lang.id)?.name).filter(name => name).join(', ');
    }

    return changes;
  };

  const handleSubmit = async (values: typeof initialValues) => {
    setModalIsOpenLoadning(true);
    try {
      const tokenXSRF = await fetchCsrfToken();

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/${employee.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            'X-XSRF-TOKEN': tokenXSRF,
          },
          credentials: 'include',
          body: JSON.stringify(values),
        });

        const changedData = getChangedData(values);
        if (!response.ok) {
          console.error('Error updating absence status, response not OK');
          throw new Error('Error updating absence status');
        }

        setChangedData(changedData);
        setModalIsOpenLoadning(false);
        setIsModalOpen(true);
    } catch (error) {
      console.error('Błąd podczas aktualizacji danych pracownika:', error);
      setError('Błąd podczas edycji pracownika');
    }
  };

  const initialValues = {
    firstname: employee.firstname || '',
    surname: employee.surname || '',
    email: employee.email || '',
    residence: {
      city: employee.residence?.city || '',
      street: employee.residence?.street || '',
      apartment: employee.residence?.apartment || '',
      zip_code: employee.residence?.zip_code || '',
      building_number: employee.residence?.building_number || '',
    },
    roles: employee.roles.map((role) => ({ id: role.id })) || [],
    languages: employee.languages.map((lang) => ({ id: lang.id })) || [],
    contract_type: { id: employee.contract_type?.id || 0 },
    contract_signature: employee.contract_signature || '',
    contract_expiration: employee.contract_expiration || '',
    work_address: { id: employee.work_address?.id || 0 },
    supervisor_id: employee.supervisor_id?.toString() || '',
    phone_number: employee.phone_number || '',
    employee_id: employee.employee_id || '',
  };

  return (
    <div className={styles.editEmployeeContainerMain}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnBlur={true}
        validateOnChange={false}
        validateOnMount={false}
      >
        {({ values, handleChange, setFieldValue, errors, touched }) => (
          <Form className={styles.formCotainer}>
            <div className={styles.rowContainerTop}>
              <div className={styles.columnContainer}>
                <label className={styles.essentialDataLabel}>
                  ID
                  <ErrorMessage name="employee_id" component="div" className={styles.errorMessage} />
                </label>
                <Field
                  className={classNames(styles.formInput, {
                    [styles.errorInput]: errors.employee_id && touched.employee_id,
                  })}
                  name="employee_id"
                  placeholder="Wpisz ID"
                />
                <label className={styles.essentialDataLabel}>
                  Imię
                  <ErrorMessage name="firstname" component="div" className={styles.errorMessage} />
                </label>
                <Field
                  className={classNames(styles.formInput, {
                    [styles.errorInput]: errors.firstname && touched.firstname,
                  })}
                  name="firstname"
                  placeholder="Wpisz imię"
                />
                <label className={styles.essentialDataLabel}>
                  Nazwisko
                  <ErrorMessage name="surname" component="div" className={styles.errorMessage} />
                </label>
                <Field
                  className={classNames(styles.formInput, {
                    [styles.errorInput]: errors.surname && touched.surname,
                  })}
                  name="surname"
                  placeholder="Wpisz nazwisko"
                />
                <label className={styles.essentialDataLabel}>
                  E-mail
                  <ErrorMessage name="email" component="div" className={styles.errorMessage} />
                </label>
                <Field
                  className={classNames(styles.formInput, {
                    [styles.errorInput]: errors.email && touched.email,
                  })}
                  name="email"
                  placeholder="Wpisz e-mail"
                />
                <label className={styles.essentialDataLabel}>
                  Nr telefonu
                  <ErrorMessage name="phone_number" component="div" className={styles.errorMessage} />
                </label>
                <Field
                  className={classNames(styles.formInput, {
                    [styles.errorInput]: errors.phone_number && touched.phone_number,
                  })}
                  name="phone_number"
                  placeholder="Wpisz numer telefonu"
                />
              </div>
              <div className={styles.columnContainer}>
                <label className={styles.residenceLabel}>
                  Ulica
                  <ErrorMessage name="residence.street" component="div" className={styles.errorMessage} />
                </label>
                <Field
                  className={classNames(styles.formInput, {
                    [styles.errorInput]: errors.residence?.street && touched.residence?.street,
                  })}
                  name="residence.street"
                  placeholder="Wpisz ulice"
                />
                <label className={styles.residenceLabel}>
                  Numer budynku
                  <ErrorMessage name="residence.building_number" component="div" className={styles.errorMessage} />
                </label>
                <Field
                  className={classNames(styles.formInput, {
                    [styles.errorInput]: errors.residence?.building_number && touched.residence?.building_number,
                  })}
                  name="residence.building_number"
                  placeholder="Wpisz numer budynku"
                />
                <label className={styles.residenceLabel}>
                  Numer mieszkania
                </label>
                <Field
                  className={classNames(styles.formInput, {
                    [styles.errorInput]: errors.residence?.apartment && touched.residence?.apartment,
                  })}
                  name="residence.apartment"
                  placeholder="Wpisz numer mieszkania"
                />
                <label className={styles.residenceLabel}>
                  Miasto
                  <ErrorMessage name="residence.city" component="div" className={styles.errorMessage} />
                </label>
                <Field
                  className={classNames(styles.formInput, {
                    [styles.errorInput]: errors.residence?.city && touched.residence?.city,
                  })}
                  name="residence.city"
                  placeholder="Wpisz miasto"
                />
                <label className={styles.residenceLabel}>
                  Kod pocztowy
                  <ErrorMessage name="residence.zip_code" component="div" className={styles.errorMessage} />
                </label>
                <Field
                  className={classNames(styles.formInput, {
                    [styles.errorInput]: errors.residence?.zip_code && touched.residence?.zip_code,
                  })}
                  name="residence.zip_code"
                  placeholder="Wpisz kod pocztowy"
                />
              </div>
              <div className={styles.columnContainer}>
                <label className={styles.contractDateLables}>
                  Data zawarcia umowy
                  <ErrorMessage name="contract_signature" component="div" className={styles.errorMessage} />
                </label>
                <Field
                  className={classNames(styles.formInput, styles.pointer, {
                    [styles.errorInput]: errors.contract_signature && touched.contract_signature,
                  })}
                  type="date"
                  name="contract_signature"
                />
                <label className={styles.contractDateLables}>
                  Data zakończenia umowy
                  <ErrorMessage name="contract_expiration" component="div" className={styles.errorMessage} />
                </label>
                <Field
                  className={classNames(styles.formInput, styles.pointer, {
                    [styles.errorInput]: errors.contract_expiration && touched.contract_expiration,
                  })}
                  type="date"
                  name="contract_expiration"
                />
                <label className={styles.contractTypeLabel}>
                  Rodzaj umowy
                  <ErrorMessage name="contract_type.id" component="div" className={styles.errorMessage} />
                </label>
                <Field
                  as="select"
                  className={classNames(styles.formInput, styles.formSelect, styles.pointer, {
                    [styles.errorInput]: errors.contract_type?.id && touched.contract_type?.id,
                  })}
                  name="contract_type.id"
                  value={values.contract_type.id === 0 ? '' : values.contract_type.id}
                  onChange={(e: any) => {
                    handleChange(e);
                    setFieldValue("contract_type.id", parseInt(e.target.value));
                  }}
                >
                  <option className={styles.defaultOption} value="" disabled>
                    Wybierz rodzaj umowy
                  </option>
                  {contracts.map((contract) => (
                    <option key={contract.id} value={contract.id}>
                      {contract.name}
                    </option>
                  ))}
                </Field>
                <label className={styles.supervisorLabel}>
                  Przełożony
                  <ErrorMessage name="supervisor_id" component="div" className={styles.errorMessage} />
                </label>
                <Field
                  as="select"
                  className={classNames(styles.formInput, styles.formSelect, styles.pointer, {
                    [styles.errorInput]: errors.supervisor_id && touched.supervisor_id,
                  })}
                  name="supervisor_id"
                  value={values.supervisor_id}
                  onChange={handleChange}
                >
                  <option className={styles.defaultOption} value="" disabled>
                    Wybierz przełożonego
                  </option>
                  {supervisors.map((supervisor) => (
                    <option key={supervisor.id} value={supervisor.id}>
                      {supervisor.firstname} {supervisor.surname}
                    </option>
                  ))}
                </Field>
                <label className={styles.departmentLabel}>
                  Oddział
                  <ErrorMessage name="work_address.id" component="div" className={styles.errorMessage} />
                </label>
                <Field
                  as="select"
                  className={classNames(styles.formInput, styles.formSelect, styles.pointer, {
                    [styles.errorInput]: errors.work_address?.id && touched.work_address?.id,
                  })}
                  name="work_address.id"
                  value={values.work_address.id === 0 ? '' : values.work_address.id}
                  onChange={handleChange}
                >
                  <option className={styles.defaultOption} value="" disabled>
                    Wybierz oddział
                  </option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.departmentName}
                    </option>
                  ))}
                </Field>
              </div>
            </div>
            <div className={styles.rowContainerMiddle}>
              <div className={styles.columnContainerMiddle}>
                <p className={styles.roleParagraph}>Wybierz role dla pracownika</p>
                <ErrorMessage name="roles" component="div" className={styles.errorMessage} />
                <div className={styles.roleContainer}>
                  {roles.map((role) => (
                    <label key={role.id} className={styles.roleLabel}>
                      <Field
                        className={styles.roleCheckbox}
                        type="checkbox"
                        name="roles"
                        value={role.id.toString()}
                        checked={values.roles.some((r) => r.id === role.id)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const { checked } = e.target;
                          if (checked) {
                            setFieldValue('roles', [...values.roles, { id: parseInt(e.target.value) }]);
                          } else {
                            setFieldValue('roles', values.roles.filter((r) => r.id !== parseInt(e.target.value)));
                          }
                        }}
                      />{' '}
                      {role.name}
                    </label>
                  ))}
                </div>
              </div>
              <div className={styles.columnContainerMiddle}>
                <p className={styles.languageParagraph}>Wybierz języki dla pracownika</p>
                <ErrorMessage name="languages" component="div" className={styles.errorMessage} />
                <div className={styles.languagesContainer}>
                  {languages.map((language) => (
                    <label key={language.id} className={styles.languageLabel}>
                      <Field
                        className={styles.languageCheckbox}
                        type="checkbox"
                        name="languages"
                        value={language.id.toString()}
                        checked={values.languages.some((lang) => lang.id === language.id)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const { checked } = e.target;
                          if (checked) {
                            setFieldValue('languages', [...values.languages, { id: parseInt(e.target.value) }]);
                          } else {
                            setFieldValue('languages', values.languages.filter((lang) => lang.id !== parseInt(e.target.value)));
                          }
                        }}
                      />
                      <span className={styles.languageCheckboxLabel}>{language.name}</span>
                      <Flag className={styles.languageFlag} country={language.code.toUpperCase()} />
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.rowContainerBottom}>
              <div className={styles.buttonContainer}>
                <button className={styles.backButton} type="button" onClick={onCloseEdit}>
                  <FontAwesomeIcon className={styles.buttonIcon} icon={faDeleteLeft} />
                  <p className={styles.buttonParagraph}>Anuluj</p>
                </button>
                <button className={styles.addButton} type="submit">
                  <FontAwesomeIcon className={styles.buttonIcon} icon={faCircleCheck} />
                  <p className={styles.buttonParagraph}>Zapisz zmiany</p>
                </button>
              </div>
            </div>

            {isModalOpen && (
              <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                  <EditEmployeeNotificationPopUp
                    onClose={() => {
                      setIsModalOpen(false);
                      onCloseEdit();
                    }}
                    changedData={changedData}
                    onCloseEditData={onCloseEdit}
                  />
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
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default EditEmployeeDataPopUp;