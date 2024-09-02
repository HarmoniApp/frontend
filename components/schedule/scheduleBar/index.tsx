import styles from './main.module.scss';

interface ScheduleBarProps {
  currentWeek: Date[];
  onNextWeek: () => void;
  onPreviousWeek: () => void;
  onPublishAll: () => void;
}

const ScheduleBar: React.FC<ScheduleBarProps> = ({ currentWeek, onNextWeek, onPreviousWeek, onPublishAll }) => {
  return (
    <div className={styles.scheduleBarContainerMain}>
      <button className={styles.Button}>Domyslne zmiany</button>
      <div className={styles.weekSwitcher}>
        <button onClick={onPreviousWeek}>◀</button>
        <div className={styles.dateRange}>
          {currentWeek[0].toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' })} -
          {currentWeek[6].toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' })}
        </div>
        <button onClick={onNextWeek}>▶</button>
      </div>
      <button className={styles.Button}>Importuj</button>
      <button 
        className={styles.Button} 
        onClick={() => {
          onPublishAll();
        }}
      >
        Opublikuj wszystkie
      </button>
    </div>
  );
};

export default ScheduleBar;