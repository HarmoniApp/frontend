import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEdit, faQuestionCircle, faClipboard, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import Flag from 'react-flagkit';
import styles from './main.module.scss';


interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

const Account: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {

const pathname = usePathname();
const router = useRouter();

const settingsToGo = () => {
    router.push('/settings');
  };
    return (
        <>
            <div className={`${styles.sidebarContainer} ${isOpen ? styles.open : ''}`}>
                <div className={styles.header}>
                    <FontAwesomeIcon icon={faUser} className={styles.headerIcon} />
                    <span>Moje konto</span>
                </div>
                <div className={styles.content}>
                    {/* <div className={styles.item}>
                        <FontAwesomeIcon icon={faEdit} className={styles.icon} />
                        <span>Edytuj Dane Konta</span>
                    </div> */}
                    <div className={styles.item}>
                        <FontAwesomeIcon icon={faQuestionCircle} className={styles.icon} />
                        <span>Pomoc i Wsparcie</span>
                    </div>
                    <div className={styles.item}>
                        <FontAwesomeIcon icon={faClipboard} className={styles.icon} />
                        <span>Przekaż Opinię</span>
                    </div>
                    <div className={`${styles.item} ${pathname === '/settings' ? styles.active : ''}`} onClick={settingsToGo}>
                        <FontAwesomeIcon icon={faCog} className={styles.icon} />
                        <span>Ustawienia</span>
                    </div>
                    <div className={styles.logout}>
                        <FontAwesomeIcon icon={faSignOutAlt} className={styles.icon} />
                        <span>Wyloguj się</span>
                    </div>
                </div>
                <div className={styles.footer}>
                    <div className={styles.logoContainer}>
                        <p className={styles.logo}>HA</p>
                    </div>
                    <div className={styles.languages}>
                        <Flag className={styles.para} country="PL" />
                        <Flag className={styles.para} country="GB" />
                        <Flag className={styles.para} country="ES" />
                    </div>
                </div>
            </div>
            {isOpen && <div className={styles.overlay} onClick={toggleSidebar}></div>}
        </>
    );
};
export default Account;
