'use client';
import React, { useState } from "react";
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faSearch, faBell, faUser } from '@fortawesome/free-solid-svg-icons';
import Notifications from "./notifications";
import styles from "./main.module.scss";
import './main.css';

interface NavbarTopProps {
    onAccountIconClick: () => void;
    userId: number;
}

const NavbarTop: React.FC<NavbarTopProps> = ({ onAccountIconClick, userId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const pathname = usePathname();
    const mustBeBackButton = pathname === '/dashboard' || pathname === '/register' || pathname === '/login';
    const mustBeAccoutButton = pathname === '/register' || pathname === '/login';

    const  closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.leftSection}>
                {!mustBeBackButton && <p><FontAwesomeIcon icon={faPlay} className={`${styles.icon} ${styles.rotate}`} /></p>}
                <span className={styles.logo}>HA</span>
            </div>
            <div className={styles.rightSection}>
                {!mustBeBackButton && <p><FontAwesomeIcon icon={faSearch} className={`${styles.icon} ${pathname !== '/schedule' && pathname !== '/employees' ? styles.hidden : ''}`} /></p>}
                {!mustBeAccoutButton && <p onClick={() => setIsModalOpen(true)}><FontAwesomeIcon icon={faBell} className={`${styles.icon} ${pathname === '/notifications' ? styles.active : ''}`} /></p>}
                {!mustBeAccoutButton && <p onClick={onAccountIconClick}><FontAwesomeIcon icon={faUser} className={`${styles.icon} ${pathname === '/settings' ? styles.active : ''}`} /></p>}
            </div>

            {isModalOpen && (
                <div className={styles.modalOverlayOfNotification}>
                    <div className={styles.modalContentOfNotification}>
                        <Notifications userId={userId} onClose={closeModal}/>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default NavbarTop;
