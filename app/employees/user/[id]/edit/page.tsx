'use client';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchUserData } from '@/services/userService';
import Navbar from "@/components/navbar";
import EditEmployeeDataPopUp from '@/components/employees/employeeData/editEmployeeData';
import EmployeeData from '@/components/types/employeeData';
import styles from '@/styles/components/pages.module.scss';
import LoadingSpinner from '@/components/loadingSpinner';

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

  if (loading) return <LoadingSpinner wholeModal={false}/>;
  if (error) return <div>Error: {error}</div>;
  if (!employee) return <div>Nie znaleziono danych pracownika</div>;

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <EditEmployeeDataPopUp
        employee={employee}
        onCloseEdit={() => router.push(`/employees/user/${id}`)}
      />
    </div>
  );
};
export default EditEmployeePage;