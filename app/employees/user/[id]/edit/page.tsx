'use client';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from "@/components/navbar";
import EditEmployeeDataPopUp from '@/components/employees/employeeData/editEmployeeData';
import EmployeeData from '@/components/types/employeeData';
import styles from './main.module.scss';

const EditEmployeePage: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();

  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployeeData = async () => {
        if (!id) {
            setError('No userId provided');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/v1/user/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch employee data');
            }
            const data = await response.json();
            setEmployee(data);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    fetchEmployeeData();
}, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!employee) return <div>No employee data found</div>;

  return (
    <div className={styles.editEmployeePageContainerMain}>
      <Navbar />
      <EditEmployeeDataPopUp
        employee={employee}
        onCloseEdit={() => router.push(`/employees/user/${id}`)}
      />
    </div>
  );
};
export default EditEmployeePage;