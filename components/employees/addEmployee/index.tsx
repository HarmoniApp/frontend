"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDeleteLeft, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Flag from 'react-flagkit';
import classNames from 'classnames';
import LoadingSpinner from '@/components/loadingSpinner';
import styles from './main.module.scss';
import { employeeValidationSchema } from '@/validationSchemas/employeeValiadtionSchema';
import Department from '@/components/types/department';
import Supervisor from '@/components/types/supervisor';
import Role from '@/components/types/role';
import Language from '@/components/types/language';
import Contract from '@/components/types/contract';
import useEmployeeDataForm from '@/hooks/useEditEmployeeData';

const AddEmployee: React.FC = () => {
  const onBack = () => {
    router.push('/employees');
  };

  const router = useRouter();
  const { 
    roles, 
    contracts, 
    languages, 
    supervisors, 
    departments, 
    loading,
    handleSaveEmployee } = useEmployeeDataForm();

  const handleSubmit = async (values: typeof initialValues, { resetForm }: { resetForm: () => void }) => {
    await handleSaveEmployee(values, "add");
    router.push("/employees");
    resetForm();
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
        validationSchema={employeeValidationSchema}
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
                  {contracts.map((contract: Contract) => (
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
                  {supervisors.map((supervisor: Supervisor) => (
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
                  {departments.map((department: Department) => (
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
                  {roles.map((role: Role) => (
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
                  {languages.map((language: Language) => (
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
          </Form>
        )}
      </Formik>
      {loading && <LoadingSpinner />}
    </div>
  );
};
export default AddEmployee;