import Absence from '@/components/absence';
import Navbar from "@/components/navbar";
import styles from './main.module.scss';

export default function AbsencePage() {
    return (
        <div className={styles.absencePageContainerMain}>
            <Navbar />
            <Absence />
        </div>
    );
}