"use client";
import { useEffect, useState } from 'react';

interface EmployeeData {
  id: number;
  firstname: string;
  surname: string;
  email: string;
  residence: {
    id: number;
    street: string;
    apartment: string;
    zip_code: string;
    building_number: string;
  };
  roles: {
    id: number;
    name: string;
    sup: boolean;
  }[];
  languages: {
    id: number;
    name: string;
  }[];
  contract_type: {
    id: number;
    name: string;
  };
  contract_signature: string;
  contract_expiration: string;
  work_address: {
    id: number;
    street: string;
    apartment: string;
    zip_code: string;
    building_number: string;
  };
  supervisor_id: number;
  phone_number: string;
  employee_id: string;
}
interface SupervisorData {
  id: number;
  firstname: string;
  surname: string;
}

export default function EmployeeDataComponent({ userId }: { userId: number }) {
  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const [supervisorData, setSupervisorData] = useState<SupervisorData | null>(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/v1/user/${userId}`)
      .then(response => response.json())
      .then(data => {
        setEmployee(data);

        if (data.supervisor_id) {
          return fetch(`http://localhost:8080/api/v1/user/simple/${data.supervisor_id}`)
            .then(response => response.json())
            .then(supervisorData => setSupervisorData(supervisorData));
        }
      });
  }, [userId]);

  if (!employee) return <div>Loading...</div>;

  return (
    <div>
      <h2>{employee.firstname} {employee.surname}</h2>
      <p>Email: {employee.email}</p>
      <p>Phone Number: {employee.phone_number}</p>
      <p>Employee ID: {employee.employee_id}</p>
      <h3>Residence</h3>
      <p>{employee.residence.street}, {employee.residence.building_number}/{employee.residence.apartment}, {employee.residence.zip_code}</p>
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
      <h3>Work Address</h3>
      <p>{employee.work_address.street}, {employee.work_address.building_number}/{employee.work_address.apartment}, {employee.work_address.zip_code}</p>
      <p>Supervisor: {supervisorData ? `${supervisorData.firstname} ${supervisorData.surname}` : 'Loading...'}</p>
    </div>
  );
}