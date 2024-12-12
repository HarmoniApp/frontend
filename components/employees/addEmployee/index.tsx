"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDeleteLeft, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { fetchLanguages } from "@/services/languageService";
import { fetchRoles } from "@/services/roleService"
import { fetchContracts } from '@/services/contractService';
import { fetchDepartments } from '@/services/departmentService';
import { fetchSupervisors, postUser } from '@/services/userService';
import Flag from 'react-flagkit';
import Role from '@/components/types/role';
import Contract from '@/components/types/contract';
import Language from '@/components/types/language';
import Supervisor from '@/components/types/supervisor';
import Department from '@/components/types/department';
import classNames from 'classnames';
import * as Yup from 'yup';
import AddEmployeeNotificationPopUp from '@/components/employees/addEmployee/addEmplyeeNotification';
import LoadingSpinner from '@/components/loadingSpinner';
import styles from './main.module.scss';

const AddEmployee: React.FC = () => {
  const router = useRouter();
  const onBack = () => {
    router.push('/employees');
  };

  const [roles, setRoles] = useState<Role[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCountdown, setModalCountdown] = useState(10);
  const [employeeLink, setEmployeeLink] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  if (modalCountdown === 0) onBack();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchRoles(setRoles);
      await fetchContracts(setContracts);
      await fetchLanguages(setLanguages);
      await fetchSupervisors(setSupervisors);
      await fetchDepartments(setDepartments);
      setLoading(false);
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
        const invalidChars = findInvalidCharacters(value || '', /^[0-9 +]*$/);
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
          const invalidChars = findInvalidCharacters(value || '', /^[a-zA-Z ]*$/);
          return invalidChars.length === 0
            ? true
            : this.createError({ message: `Niedozwolone znak: ${invalidChars.join(', ')}` });
        }),
      street: Yup.string()
        .min(1, 'Min 1 znaków')
        .max(100, 'Max 100 znaków')
        .required('Pole wymagane')
        .test('no-invalid-chars', function (value) {
          const invalidChars = findInvalidCharacters(value || '', /^[a-zA-Z ]*$/);
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

  const handleSubmit = async (values: typeof initialValues, { resetForm }: { resetForm: () => void }) => {
    setLoading(true);
    try {
      await postUser(values, setEmployeeLink);

      setIsModalOpen(true);
      resetForm();

      const countdownInterval = setInterval(() => {
        setModalCountdown((prev) => {
          if (prev === 1) {
            clearInterval(countdownInterval);
            setIsModalOpen(false);
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Error adding employee:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const initialValues = {
    firstname: '',
    surname: '',
    email: '',
    residence: {
      city: '',
      street: '',
      apartment: '',
      zip_code: '',
      building_number: '',
    },
    roles: [] as { id: number }[],
    languages: [] as { id: number }[],
    contract_type: { id: 0 },
    contract_signature: '',
    contract_expiration: '',
    work_address: { id: 0 },
    supervisor_id: '',
    phone_number: '',
    employee_id: '',
  };

  return (
    <div className={styles.addEmployeeContainerMain}>
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
                <Field className={classNames(styles.formInput, {
                  [styles.errorInput]: errors.employee_id && touched.employee_id,
                })}
                  name="employee_id"
                  placeholder="Wpisz ID" />
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
                  <ErrorMessage name="residence.apartment" component="div" className={styles.errorMessage} />
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
                  onChange={handleChange}
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
                <button className={styles.backButton} type="button" onClick={onBack}>
                  <FontAwesomeIcon className={styles.buttonIcon} icon={faDeleteLeft} />
                  <p className={styles.buttonParagraph}>Anuluj dodanie</p>
                </button>
                <button className={styles.addButton} type="submit">
                  <FontAwesomeIcon className={styles.buttonIcon} icon={faCircleCheck} />
                  <p className={styles.buttonParagraph}>Zapisz pracownika</p>
                </button>
              </div>
            </div>

            {isModalOpen && (
              <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                  <AddEmployeeNotificationPopUp
                    firstname={values.firstname}
                    surname={values.surname}
                    employeeId={employeeLink}
                    modalCountdown={modalCountdown}
                    onClose={() => {
                      setIsModalOpen(false);
                      onBack();
                    }}
                  />
                </div>
              </div>
              /* zielony popUp */
            )}
          </Form>
        )}
      </Formik>
      {loading && <LoadingSpinner />}
    </div>
  );
};
export default AddEmployee;