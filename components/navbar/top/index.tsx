'use client';
import React from "react";
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faSearch, faBell, faUser } from '@fortawesome/free-solid-svg-icons';
import styles from "./main.module.scss";
import './main.css';

interface NavbarTopProps {
    onAccountIconClick: () => void;
}

const NavbarTop: React.FC<NavbarTopProps> = ({ onAccountIconClick }) => {

    const pathname = usePathname();
    const mustBeBackButton = pathname === '/dashboard' || pathname === '/register' || pathname === '/login';
    const mustBeAccoutButton =  pathname === '/register' || pathname === '/login';

    return (
        <nav className={styles.navbar}>
            <div className={styles.leftSection}>
                {!mustBeBackButton && <p><FontAwesomeIcon icon={faPlay} className={`${styles.icon} ${styles.rotate}`} /></p>}
                <span className={styles.logo}>HA</span>
            </div>
            <div className={styles.rightSection}>
                {!mustBeBackButton && <p><FontAwesomeIcon icon={faSearch} className={styles.icon} /></p>}
                {!mustBeAccoutButton && <p><FontAwesomeIcon icon={faBell} className={styles.icon} /></p>}
                {!mustBeAccoutButton && <p onClick={onAccountIconClick}><FontAwesomeIcon icon={faUser} className={styles.icon} /></p>}
            </div>
        </nav>
    );
};

export default NavbarTop;
