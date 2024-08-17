'use client';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from "@/components/navbar";
import EditEmployeeDataPopUp from '@/components/employees/employeeData/editEmployeeData';
import EmployeeData from '@/components/types/employeeData';

const EditEmployeePage: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();

  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8080/api/v1/user/${id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch employee data');
          }
          return response.json();
        })
        .then(data => {
          setEmployee(data);
          setLoading(false);
        })
        .catch(error => {
          setError(error.message);
          setLoading(false);
        });
    } else {
      setError('No userId provided');
      setLoading(false);
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!employee) return <div>No employee data found</div>;

  return (
    <div>
      <Navbar />
      <EditEmployeeDataPopUp
        employee={employee}
        onCloseEdit={() => router.push(`/employees/user/${id}`)}
      />
    </div>
  );
};
export default EditEmployeePage;