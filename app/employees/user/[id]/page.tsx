import Navbar from "@/components/navbar";
import EmployeeDataComponent from '@/components/employees/employeeData';
import styles from './main.module.scss';

export default function EmpoyeeDataPage({ params }: { params: { id: number } }) {
    return (
      <div className={styles.employeeDataPageContainerMain}>
        <Navbar />
        <EmployeeDataComponent userId={params.id} />
      </div>
    );
  }