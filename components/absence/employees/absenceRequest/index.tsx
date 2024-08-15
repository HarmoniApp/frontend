import styles from './main.module.scss';

const AbsenceEmployeesRequest = () => {
    /*
    Miss endpoint for select of reasonsVac
    User_id is needed to send request to the server (no login is created)
    Absence_id is needed to send request to the server (reasonsVac is needed)
    Submision Date and Update Date are needed to sent request to the server propably but it's not clear
    */
    return (
        <div>
            <p>Złóż wniosek o urlop</p>
            <select name="" id="">
                <option value="" disabled>Wybierz powód ubiegania sie o urlop</option>
            </select>
            <label>
                Data rozpoczęcia: <input type="date" placeholder="startDateVac" />
            </label>
            <label>
                Data zakończenia: <input type="date" placeholder="endDateVac" />
            </label>
            <button>Wyślij wniosek</button>
        </div>
    )
}
export default AbsenceEmployeesRequest