import Login from "@/components/login";
import styles from '@/styles/components/pages.module.scss';

export default function Home() {
  return (
    <div className={styles.pageContainer}>
      <Login />
    </div>
  );
}