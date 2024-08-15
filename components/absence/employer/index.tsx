import styles from './main.module.scss';
import AbsenceCard from '@/components/absence/employer/absentCard';

const AbsenceEmployer: React.FC = () => {
    return (
        <div className={styles.absenceEmployerContainer}>
      <h2>Lista Urlopów Pracowników</h2>
      <AbsenceCard />
    </div>
    )
}
export default AbsenceEmployer