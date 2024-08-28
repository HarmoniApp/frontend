import CalendarHeader from '@/components/schedule/calendar/calendarHeader';
import CalendarRow from '@/components/schedule/calendar/calendarRow';
import styles from './main.module.scss';

interface CalendarProps {
    weekData: Date[];
}

const Calendar: React.FC<CalendarProps> = ({weekData}) => {
    return (
        <div className={styles.calendarContainerMain}>
            <CalendarHeader weekData={weekData}/>
            <CalendarRow currentWeek={weekData}/>
        </div>
    );
};
export default Calendar;