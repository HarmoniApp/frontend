import WeekSwitcher from '@/components/schedule/scheduleBar/weekSwitcher';
import styles from './main.module.scss';



const ScheduleBar: React.FC = () => {

    return (
        <div className={styles.scheduleBar}>
            <button className={styles.Button}>Domyslne zmiany</button>
            <WeekSwitcher />
            <button className={styles.Button}>Importuj</button>
            <button className={styles.Button}>Opublikuj</button>
        </div>
    );
};

export default ScheduleBar;
