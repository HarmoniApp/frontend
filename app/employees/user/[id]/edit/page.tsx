'use client';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from "@/components/navbar";
import EditEmployeeDataPopUp from '@/components/employees/employeeData/editEmployeeData';
import EmployeeData from '@/components/types/employeeData';
import styles from './main.module.scss';
import { fetchUserData } from '@/services/userService';

const EditEmployeePage: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();

  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
        if (!id) {
            setError('No userId provided');
            setLoading(false);
            return;
        }
        if (typeof id === 'string') {
            await fetchUserData(id, setEmployee, setLoading);
        } else {
            setError('Invalid userId format');
            setLoading(false);
        }
    };

    loadData();
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