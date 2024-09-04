import Navbar from "@/components/navbar";
import Schedule from '@/components/schedule';
import styles from './main.module.scss';

export default function SchedulePage() {
  return (
    <div className={styles.schedulePageContainerMain}>
      <Navbar />
      <Schedule />
    </div>
  );
}