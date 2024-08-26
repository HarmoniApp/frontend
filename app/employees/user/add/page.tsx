import Navbar from "@/components/navbar";
import AddEmployee from '@/components/employees/addEmployee';
import styles from './main.module.scss';

const AddEmployeePage = () => {
    return (
        <div className={styles.addEmployeePageContainerMain}>
            <Navbar />
            <AddEmployee />
        </div>
    );
};
export default AddEmployeePage;