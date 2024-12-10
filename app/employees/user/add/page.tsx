import Navbar from "@/components/navbar";
import AddEmployee from '@/components/employees/addEmployee';
import styles from '@/styles/components/pages.module.scss';

export default function AddEmployeePage() {
    return (
        <div className={styles.pageContainer}>
            <Navbar />
            <AddEmployee />
        </div>
    );
};