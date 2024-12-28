'use client';
import React from "react";
import { usePathname, useRouter } from 'next/navigation';
import styles from "./main.module.scss";
interface NavbarBottomProps {
  isThisAdmin: boolean;
}

const NavbarBottom: React.FC<NavbarBottomProps> = ({ isThisAdmin }) => {
  const pathname = usePathname();
  const router = useRouter();
  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li onClick={() => navigateTo('/schedule')} className={`${styles.navItem} ${pathname === '/schedule' ? styles.active : ''}`}>Kalendarz</li>
        {isThisAdmin ? <li onClick={() => navigateTo('/employees')} className={`${styles.navItem} ${pathname.startsWith('/employees') ? styles.active : ''}`}>Pracownicy</li> : ''}
        <li onClick={() => navigateTo('/chat')} className={`${styles.navItem} ${pathname === '/chat' ? styles.active : ''}`}>Czat</li>
        <li onClick={() => navigateTo('/absence')} className={`${styles.navItem} ${pathname === '/absence' ? styles.active : ''}`}>Urlopy</li>
        {isThisAdmin ? <li onClick={() => navigateTo('/plannerAI')} className={`${styles.navItem} ${pathname === '/plannerAI' ? styles.active : ''}`}>PlannerAI</li> : ''}
      </ul>
    </nav>
  );
};
export default NavbarBottom;