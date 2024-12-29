import Navbar from "@/components/navbar";
import DashboardCenter from "@/components/dashboard";
import styles from '@/styles/components/pages.module.scss';

export default function DashboardPage() {
    return (
        <div className={styles.pageContainer}>
            <Navbar />
            <DashboardCenter />
        </div>
    )
}