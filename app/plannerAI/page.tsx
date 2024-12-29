import Navbar from "@/components/navbar";
import PlanerAi from '@/components/plannerAI';
import styles from '@/styles/components/pages.module.scss';

export default function PlanerAiPage() {
    return (
        <div className={styles.pageContainer}>
            <Navbar />
            <PlanerAi />
        </div>
    );
}