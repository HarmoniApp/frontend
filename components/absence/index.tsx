import Employee from './employee';
import Employer from './employer';
import styles from './main.module.scss';

const Absence = () => {
    const whoIsLogged = true;  //true = employer, false = employee
    const employeeId = 26;

    return (
        <div className={styles.absenceContainerMain}>
            {whoIsLogged ? <Employer /> : <Employee userId={employeeId}/>}
        </div>
    )
}
export default Absence;