import WeekSwitcher from '@/components/schedule/scheduleBar/weekSwitcher';
import styles from './main.module.scss';



const ScheduleBar: React.FC = () => {

    return (
        <div className={styles.scheduleBar}>
            <WeekSwitcher />
        </div>
    );
};

export default ScheduleBar;
