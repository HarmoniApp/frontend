import Navbar from "@/components/navbar";
import EmployeesComponent from "@/components/employees";
import styles from './main.module.scss';

export default function EmployeesPage() {

    return (
        <div className={styles.employeesPageContainerMain}>
            <Navbar />
            <EmployeesComponent />
        </div>
    )
}