import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faSearch, faBell, faUser } from '@fortawesome/free-solid-svg-icons';
import styles from "./main.module.scss";

const NavbarTop = () => {
    return (
        <nav className={styles.navbar}>
            <div className={styles.leftSection}>
                <p><FontAwesomeIcon icon={faPlay} className={`${styles.icon} ${styles.rotate}`} /></p>
                <span className={styles.logo}>HA</span>
            </div>
            <div className={styles.rightSection}>
                <p><FontAwesomeIcon icon={faSearch} className={styles.icon} /></p>
                <p><FontAwesomeIcon icon={faBell} className={styles.icon} /></p>
                <p><FontAwesomeIcon icon={faUser} className={styles.icon} /></p>
            </div>
        </nav>
    );
};

export default NavbarTop;
