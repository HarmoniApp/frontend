import Navbar from "@/components/navbar";
import EmployeeDataComponent from '@/components/employees/employeeData';
import styles from '@/styles/components/pages.module.scss';

export default function EmpoyeeDataPage({ params }: { params: { id: number } }) {
  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <EmployeeDataComponent userId={params.id} />
    </div>
  );
}