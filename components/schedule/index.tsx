import Employee from './employee';
import Employer from './employer';
import styles from './main.module.scss';

const Schedule = () => {
    const whoIsLogged = true;  //true = employee, false = employer
    const employeeId = 42;

    return (
        <div className={styles.absenceContainerMain}>
            {whoIsLogged ? <Employee userId={employeeId}/> : <Employer />}
        </div>
    )
}
export default Schedule;