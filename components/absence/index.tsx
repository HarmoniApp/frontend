import Employee from './employee';
import Employer from './employer';
import styles from './main.module.scss';

const Absence = () => {
    const whoIsLogged = true;  //true = employee, false = employer
    const employeeId = 26;

    return (
        <div className={styles.absenceContainerMain}>
            {whoIsLogged ? <Employee userId={employeeId}/> : <Employer />}
        </div>
    )
}
export default Absence;