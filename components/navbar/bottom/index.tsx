'use client';
import React from "react";
import { usePathname, useRouter } from 'next/navigation';
import styles from "./main.module.scss";

const NavbarBottom = () => {
  const pathname = usePathname();

  const router = useRouter();
  const scheduleToGo = () => {
    router.push('/schedule');
  };
  const employeesToGo = () => {
    router.push('/employees');
  };
  const chatToGo = () => {
    router.push('/chat');
  };
  const vacationToGo = () => {
    router.push('/vacation');
  };
  const statisticsToGo = () => {
    router.push('/statistics');
  };

  const plannerAiToGo = () => {
    router.push('/plannerAI');
  };

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li onClick={scheduleToGo} className={`${styles.navItem} ${pathname === '/schedule' ? styles.active : ''}`}>Kalendarz</li>
        <li onClick={employeesToGo} className={`${styles.navItem} ${pathname === '/employees' ? styles.active : ''}`}>Pracownicy</li>
        <li onClick={chatToGo} className={`${styles.navItem} ${pathname === '/chat' ? styles.active : ''}`}>Czat</li>
        <li onClick={vacationToGo} className={`${styles.navItem} ${pathname === '/vacation' ? styles.active : ''}`}>Urlopy</li>
        <li onClick={statisticsToGo} className={`${styles.navItem} ${pathname === '/statistics' ? styles.active : ''}`}>Statystyki</li>
        <li onClick={plannerAiToGo} className={`${styles.navItem} ${pathname === '/plannerAI' ? styles.active : ''}`}>PlannerAI</li>
      </ul>
    </nav>
  );
};

export default NavbarBottom;
