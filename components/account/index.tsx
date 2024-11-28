'use client';
import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faImage, faQuestionCircle, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import PhotoChange from './photoChange';
import styles from './main.module.scss';


interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

const Account: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [changePhotoModal, setChangePhotoModal] = useState(false);

    const pathname = usePathname();
    const router = useRouter();
    const customContent = isAdmin ? styles.adminContent : styles.userContent;

    useEffect(() => {
        const storedIsAdmin = sessionStorage.getItem('isAdmin');

        if (storedIsAdmin !== null) {
            setIsAdmin(JSON.parse(storedIsAdmin));
        }
    }, []);

    const settingsToGo = () => {
        router.push('/settings');
    };

    const logout = () => {
        localStorage.clear();
        sessionStorage.clear();
        router.push('/');
    }

    return (
        <>
            <div className={`${styles.sidebarContainer} ${isOpen ? styles.open : ''}`}>
                <div className={styles.header}>
                    <FontAwesomeIcon icon={faUser} className={styles.headerIcon} />
                    <span>Moje konto</span>
                </div>
                <div className={customContent}>
                    <div className={`${styles.item} ${styles.future}`}>
                        <FontAwesomeIcon icon={faQuestionCircle} className={styles.icon} />
                        <span>Pomoc i Wsparcie</span>
                    </div>
                    <div className={`${styles.item} ${pathname === '/settings' ? styles.active : ''}`} onClick={isAdmin ? settingsToGo : () => setChangePhotoModal(true)}>
                        <FontAwesomeIcon icon={isAdmin ? faCog : faImage} className={styles.icon} />
                        <span>{isAdmin ? "Ustawienia" : "Zmień zdjęcie"}</span>
                    </div>
                </div>
                <div className={styles.footer}>
                    <div className={styles.logoContainer}>
                        <p className={styles.logo}>HA</p>
                    </div>
                    <div className={styles.logout} onClick={logout}>
                        <FontAwesomeIcon icon={faSignOutAlt} className={styles.icon} />
                        <span>Wyloguj się</span>
                    </div>
                </div>
            </div>

            {isOpen && <div className={styles.overlay} onClick={toggleSidebar}></div>}

            {changePhotoModal && (
                <div className={styles.modalOverlayChangePhoto}>
                    <div className={styles.modalContentOfChangePhoto}>
                        <PhotoChange
                            onClose={() => setChangePhotoModal(false)}
                         />
                    </div>
                </div>
            )}
        </>
    );
};
export default Account;
