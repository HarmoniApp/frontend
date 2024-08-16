"use client";
import { use, useEffect, useState } from 'react';

interface Employee {
  id: number;
  firstname: string;
  surname: string;
  languages: { id: number; name: string }[];
}

export default function EmployeeDataComponent({ userId }: { userId: string }) {
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/v1/user/${userId}`)
      .then(response => response.json())
      .then(data => setEmployee(data));
  }, [userId]);

  if (!employee) return <div>Loading...</div>;

  return (
    <div>
      <h2>{employee.firstname} {employee.surname}</h2>
      <p>Languages: {employee.languages.map(lang => lang.name).join(', ')}</p>
    </div>
  );
}
