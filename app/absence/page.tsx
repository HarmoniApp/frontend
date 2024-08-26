import AbsenceEmployer from '@/components/absence/employer';
import Navbar from "@/components/navbar";
import styles from './main.module.scss';

export default function AbsencePage() {
    return (
        <div className={styles.absencePageContainerMain}>
            <Navbar />
            <AbsenceEmployer />
        </div>
    );
}