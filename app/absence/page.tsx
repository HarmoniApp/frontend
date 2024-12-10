import Absence from '@/components/absence';
import Navbar from "@/components/navbar";
import styles from '@/styles/components/pages.module.scss';

export default function AbsencePage() {
    return (
        <div className={styles.pageContainer}>
            <Navbar />
            <Absence />
        </div>
    );
}