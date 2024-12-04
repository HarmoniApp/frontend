import Navbar from "@/components/navbar";
import styles from './main.module.scss';
import PlanerAi from '@/components/plannerAI';

export default function PlanerAiPage() {
    return (
        <div className={styles.planerAiPageContainerMain}>
            <Navbar />
            <PlanerAi />
        </div>
    );
}