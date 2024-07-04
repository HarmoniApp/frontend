'use client';
import React from "react";
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faSearch, faBell, faUser } from '@fortawesome/free-solid-svg-icons';
import styles from "./main.module.scss";
import './main.css';

const NavbarTop = () => {

    const pathname = usePathname();
    const isDashboard = pathname === '/dashboard';

    return (
        <nav className={styles.navbar}>
            <div className={styles.leftSection}>
                {!isDashboard && <p><FontAwesomeIcon icon={faPlay} className={`${styles.icon} ${styles.rotate}`} /></p>}
                <span className={styles.logo}>HA</span>
            </div>
            <div className={styles.rightSection}>
                {!isDashboard && <p><FontAwesomeIcon icon={faSearch} className={styles.icon} /></p>}
                <p><FontAwesomeIcon icon={faBell} className={styles.icon} /></p>
                <p><FontAwesomeIcon icon={faUser} className={styles.icon} /></p>
            </div>
        </nav>
    );
};

export default NavbarTop;
