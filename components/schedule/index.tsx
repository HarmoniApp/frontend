import Employee from './employee';
import Employer from './employer';
import styles from './main.module.scss';

const Schedule = () => {
    const whoIsLogged = true;  //true = employer, false = employee
    const employeeId = 42;

    return (
        <div className={styles.absenceContainerMain}>
            {whoIsLogged ? <Employer /> : <Employee userId={employeeId}/>}
        </div>
    )
}
export default Schedule;