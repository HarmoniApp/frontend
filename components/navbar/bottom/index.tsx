import React from "react";
import styles from "./main.module.scss";

const NavbarBottom = () => {
    return (
        <nav className={styles.navbar}>
            <ul className={styles.navList}>
                <li className={styles.navItem}>Kalendarz</li>
                <li className={`${styles.navItem} ${styles.active}`}>Pracownicy</li>
                <li className={styles.navItem}>Czat</li>
                <li className={styles.navItem}>Urlopy</li>
                <li className={styles.navItem}>Statystyki</li>
                <li className={styles.navItem}>PlannerAI</li>
            </ul>
        </nav>
    );
};

export default NavbarBottom;
