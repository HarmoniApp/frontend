import Login from "@/components/login";
import styles from "@/app/page.module.scss";

export default function Home() {
  return (
    <div className={styles.pageContainer}>
      <Login />
    </div>
  );
}
