import Navbar from "@/components/navbar";
import Schedule from '@/components/schedule';
import styles from '@/styles/components/pages.module.scss';

export default function SchedulePage() {
  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <Schedule />
    </div>
  );
}