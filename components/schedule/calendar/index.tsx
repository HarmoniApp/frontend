import CalendarHeader from '@/components/schedule/calendar/calendarHeader';
import styles from './main.module.scss';

interface CalendarProps {
    weekData: Date[];
}

const Calendar: React.FC<CalendarProps> = ({weekData}) => {
    return (
        <div className={styles.calendarContainerMain}>
            <CalendarHeader weekData={weekData}/>
        </div>
    );
};
export default Calendar;