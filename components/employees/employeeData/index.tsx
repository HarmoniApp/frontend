"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from 'react-modal';
import DeleteEmployeePopUp from '@/components/employees/employeeData/deleteEmployee';
import EmployeeData from '@/components/types/employeeData';
import Department from '@/components/types/department';
import SupervisorDataSimple from '@/components/types/supervisorDataSimple';
import styles from './main.module.scss';

Modal.setAppElement('#root');

export default function EmployeeDataComponent({ userId }: { userId: number }) {
  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [supervisorData, setSupervisorData] = useState<SupervisorDataSimple | null>(null);
  const [modalIsOpenDeleteEmployee, setModalDeleteEmployee] = useState(false);

  const router = useRouter();

  const openModalDeleteEmployee = () => setModalDeleteEmployee(true);
  const closeModalDeleteEmployee = () => setModalDeleteEmployee(false);

  useEffect(() => {
    if (userId) {

      fetch('http://localhost:8080/api/v1/address/departments')
        .then(response => response.json())
        .then(data => setDepartments(data))
        .catch(error => console.error('Error fetching departments:', error));

      fetch(`http://localhost:8080/api/v1/user/${userId}`)
        .then(response => response.json())
        .then(data => {
          setEmployee(data);
          if (data.supervisor_id) {
            fetch(`http://localhost:8080/api/v1/user/simple/${data.supervisor_id}`)
              .then(response => response.json())
              .then(supervisorData => setSupervisorData(supervisorData))
              .catch(error => console.error('Error fetching supervisor data:', error));
          }
        })
        .catch(error => console.error('Error fetching employee data:', error));
    }
  }, [userId]);

  if (!employee) return <div>Loading...</div>;

  const department = departments.find(dept => dept.id === employee.work_address.id);

  const handleEditEmployee = () => {
    router.push(`/employees/user/${userId}/edit`);
  };

  return (
    <div>
      <h2>{employee.firstname} {employee.surname}</h2>
      <p>Email: {employee.email}</p>
      <p>Phone Number: {employee.phone_number}</p>
      <p>Employee ID: {employee.employee_id}</p>
      <h3>Residence</h3>
      <p>Street: {employee.residence.street} {employee.residence.building_number} {employee.residence.apartment ? `/${employee.residence.apartment}` : ''} </p>
      <p>City: {employee.residence.city} {employee.residence.zip_code}</p>
      <h3>Roles</h3>
      <ul>
        {employee.roles.map(role => (
          <li key={role.id}>{role.name}</li>
        ))}
      </ul>
      <h3>Languages</h3>
      <ul>
        {employee.languages.map(lang => (
          <li key={lang.id}>{lang.name}</li>
        ))}
      </ul>
      <h3>Contract</h3>
      <p>Type: {employee.contract_type.name}</p>
      <p>Signature Date: {employee.contract_signature}</p>
      <p>Expiration Date: {employee.contract_expiration}</p>
      <h3>Department Name</h3>
      {department ? (
        <p>{department.departmentName}</p>
      ) : (
        <p>We do not have a branch under this name. Error!</p>
      )}
      <h3>Work Address</h3>
      <p>{employee.work_address.street}, {employee.work_address.building_number}/{employee.work_address.apartment}, {employee.work_address.zip_code}</p>
      <p>Supervisor: {supervisorData ? `${supervisorData.firstname} ${supervisorData.surname}` : 'Loading...'}</p>
      <button>Statistics</button>
      <button>Absences</button>
      <button>Chat</button>

      <button onClick={handleEditEmployee}>Edit employee</button>

      <Modal
        isOpen={modalIsOpenDeleteEmployee}
        contentLabel="Delete Employee"
        className={styles.modalContent}
        overlayClassName={styles.modalOverlay}
      >
        <DeleteEmployeePopUp
          userId={employee.id}
          firstName={employee.firstname}
          surname={employee.surname}
          roles={employee.roles}
          departmentName={department ? department.departmentName : 'Loading...'}
          onClose={closeModalDeleteEmployee}
        />
      </Modal>
      <button onClick={openModalDeleteEmployee}>Usuń pracownika</button>
    </div>
  );
}