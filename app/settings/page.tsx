import Navbar from "@/components/navbar";
import Settings from '@/components/settings';
import styles from '@/styles/components/pages.module.scss';

export default function SettingsPage() {
  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <Settings />
    </div>
  );
}