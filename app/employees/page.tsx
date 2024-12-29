import Navbar from "@/components/navbar";
import EmployeesComponent from "@/components/employees";
import styles from '@/styles/components/pages.module.scss';

export default function EmployeesPage() {
    return (
        <div className={styles.pageContainer}>
            <Navbar />
            <EmployeesComponent />
        </div>
    )
}