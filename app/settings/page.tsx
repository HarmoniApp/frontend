import Navbar from "@/components/navbar";
import Settings from '@/components/settings';
import styles from './main.module.scss';

export default function SettingsPage() {
  return (
    <div className={styles.schedulePageContainerMain}>
      <Navbar />
      <Settings />
    </div>
  );
}